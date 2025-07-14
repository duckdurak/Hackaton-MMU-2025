package auth

import (
	"flowersshop/config"
	. "flowersshop/models"
	. "flowersshop/types"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func generateToken(ID uint) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		Issuer:    "flowers",
		Subject:   strconv.Itoa(int(ID)),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JwtSecret)
}

// @Summary Авторизировать пользователя
// @Description Вход в систему по email и паролю
// @Tags Авторизация
// @Accept json
// @Produce json
// @Param credentials body LoginDto true "Данные для входа"
// @Success 200 {object} DefaultResponse{message=SuccessAuthResponse} "Успешная авторизация"
// @Failure 400 {object} DefaultResponse "Заполните форму полностью!"
// @Failure 403 {object} DefaultResponse "Пользователь с такой почтой уже существует!"
// @Failure 500 {object} DefaultResponse "Ошибка сохранения токена!"
// @Router /api/auth/login [post]
func Login(c *gin.Context) {
	var dto LoginDto
	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{ 
			Type: false,
			Error: "Заполните форму полностью!",
			Message: "",
		})
		return
	}

	var user User
	if err := config.DbClient.Where("email = ?", dto.Email).First(&user).Error; err != nil {
		c.JSON(403, &DefaultResponse{ 
			Type: false,
			Error: "Неверный логин или пароль!",
			Message: "",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.Password)); err != nil {
		c.JSON(403, &DefaultResponse{ 
			Type: false,
			Error: "Неверный логин или пароль!",
			Message: "",
		})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(500, &DefaultResponse{ 
			Type: false,
			Error: "Внутренняя ошибка!",
			Message: "",
		})
		return
	}

	if (!user.Verified) {
		c.JSON(403, &DefaultResponse{ 
			Type: false,
			Error: "Подтвердите почту!",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{ 
			Type: true,
			Error: "",
			Message: &SuccessAuthResponse{
				Token: token,
				User: user,
			},
		})
}