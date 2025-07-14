package main

import (
	"flowersshop/config"
	"flowersshop/handlers/admin"
	"flowersshop/handlers/auth"
	"flowersshop/handlers/order"
	"flowersshop/handlers/product"
	"flowersshop/handlers/profile"
	"flowersshop/middleware"
	"fmt"

	_ "flowersshop/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Flower Shop
// @version 1.0
// @description Документация для API цветочного магазина на Golang + Gin
// @host localhost:3000
func main() {
	config.LoadConfig()
	config.InitDB()
	config.InitRedis()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
	}))

	router.MaxMultipartMemory = 10 << 20

	ApiGroup := router.Group("/api")
	{
		AuthGroup := ApiGroup.Group("/auth")
		{
			AuthGroup.GET("", middleware.AuthMiddleware(), auth.Get)
			AuthGroup.POST("/register", auth.Register)
			AuthGroup.GET("/verify", auth.VerifyEmail)
			AuthGroup.POST("/login", auth.Login)
			AuthGroup.POST("/forgot", profile.ForgotPassword)
			AuthGroup.POST("/reset", profile.ResetPassword)
		}

		ProfileGroup := ApiGroup.Group("/profile").Use(middleware.AuthMiddleware())
		{
			ProfileGroup.GET("/:id", profile.Profile)
			ProfileGroup.POST("/address", profile.AddAddress)
			ProfileGroup.GET("/address", profile.GetAddresses)
			ProfileGroup.DELETE("/address", profile.DeleteAddress)
			ProfileGroup.POST("/avatar", profile.UploadAvatar)
			ProfileGroup.DELETE("/avatar", profile.DeleteAvatar)
			ProfileGroup.POST("/fio", profile.UpdateUserInfo)
		}

		ImageGroup := ApiGroup.Group("/image")
		{
			ImageGroup.GET("/:id", product.GetImage)
		}

		ProductGroup := ApiGroup.Group("/product")
		{
			ProductGroup.POST("", middleware.AdminMiddleware(), product.CreateProduct)
			ProductGroup.DELETE("/:id", middleware.AdminMiddleware(), product.DeleteProduct)
			ProductGroup.GET("", product.GetProducts)
			ProductGroup.GET("/:id", product.GetProduct)
		}

		CategoryGroup := ApiGroup.Group("/category")
		{
			CategoryGroup.GET("", product.GetCategories)
			CategoryGroup.GET("/:id", product.GetProductsByCategory)
		}

		OrderGroup := ApiGroup.Group("/order").Use(middleware.AuthMiddleware())
		{
			OrderGroup.POST("/add", order.AddProductOrder) // Доабвить в корзину
			OrderGroup.POST("", order.ProcessOrder)        // Создать ордер

			//здесь должен быть query памаметр с ordered=true/false
			OrderGroup.GET("", order.GetOrders)

			OrderGroup.DELETE("/:id", order.DeleteProductOrder)
			OrderGroup.POST("/comment", order.AddComment)
		}

		AdminGroup := ApiGroup.Group("/admin").Use(middleware.AdminMiddleware())
		{
			AdminGroup.GET("/order", admin.GetAllOrders)
			AdminGroup.POST("/category", admin.AddCategory)
			AdminGroup.PATCH("/category", admin.UpdateCategory)
			AdminGroup.POST("/tracking", order.AddTracking)
			AdminGroup.GET("/users", admin.GetUsers)
		}

		ApiGroup.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	router.Run(fmt.Sprintf("0.0.0.0:%d", config.ServerPort))
}
