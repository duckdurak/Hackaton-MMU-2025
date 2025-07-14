package middleware

import (
	config "flowersshop/config"
	. "flowersshop/models"
	. "flowersshop/types"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(403, &DefaultResponse{ 
				Type: false,
				Error: "Вы не авторизированы!",
				Message: "",
			})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &jwt.RegisteredClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})

		if !token.Valid || err != nil {
			c.JSON(404, &DefaultResponse{ 
				Type: false,
				Error: "Пройдите авторизацию еще раз!",
				Message: "",
			})
			c.Abort()
			return
		}

		var user User
		result := config.DbClient.First(&user, claims.Subject)
		if result.Error != nil {
			c.JSON(404, &DefaultResponse{ 
				Type: false,
				Error: "Пройдите авторизацию еще раз!",
				Message: "",
			})
			c.Abort()
			return
		}

		c.Set("User", user)
		c.Set("Token", tokenStr)
		c.Next()
	}
}

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(403, &DefaultResponse{ 
				Type: false,
				Error: "Вы не авторизированы!",
				Message: "",
			})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &jwt.RegisteredClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})

		if !token.Valid || err != nil {
			c.JSON(404, &DefaultResponse{ 
				Type: false,
				Error: "Пройдите авторизацию еще раз!",
				Message: "",
			})
			c.Abort()
			return
		}

		var user User
		result := config.DbClient.Where("id = ?", claims.Subject).First(&user)
		if result.Error != nil {
			c.JSON(404, &DefaultResponse{ 
				Type: false,
				Error: "Пройдите авторизацию еще раз!",
				Message: "",
			})
			c.Abort()
			return
		}

		if user.Role == 2 {
			c.Set("User", user)
			c.Set("Token", tokenStr)
			c.Next()
		} else {
			c.JSON(403, &DefaultResponse{ 
				Type: false,
				Error: "Недостаточно прав, чтобы выполнить это действие!",
				Message: "",
			})
			c.Abort()
		}
	}
}
