package admin

import (
	"errors"
	"flowersshop/config"
	. "flowersshop/models"
	. "flowersshop/types"
	"fmt"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Paginate(page int, pageSize int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if page <= 0 {
			page = 1
		}
		if pageSize <= 0 {
			pageSize = 10
		}
		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}

func UpdateDisabledProduct(c *gin.Context) {
	// 1. Структура для получения данных из JSON
	var dto UpdateDisabledDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Неверные данные запроса!",
			Message: "",
		})
		return
	}

	var product Product
	if err := config.DbClient.First(&product, dto.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, &DefaultResponse{
				Type:    false,
				Error:   "Продукт не найден!",
				Message: "",
			})
			return
		}
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при получении продукта!",
			Message: "",
		})
		return

	}

	product.Disabled = dto.Disabled

	if err := config.DbClient.Save(&product).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось обновить статус продукта!",
			Message: "",
		})
		return
	}

	c.JSON(404, &DefaultResponse{
		Type:    false,
		Error:   "",
		Message: "Статус успешно обновлен",
	})

}

func GetProducts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	sortBy := c.DefaultQuery("sort_by", "id")
	order := c.DefaultQuery("order", "asc")

	categoryID := c.Query("category_id")
	minPrice := c.Query("min_price")
	maxPrice := c.Query("max_price")
	search := c.Query("search")

	validSortFields := map[string]bool{
		"id":       true,
		"name":     true,
		"price":    true,
		"category": true,
	}
	if !validSortFields[sortBy] {
		sortBy = "id"
	}

	if sortBy == "category" {
		sortBy = "categories.name"
	}

	if order != "asc" && order != "desc" {
		order = "asc"
	}

	var products []Product
	var total int64

	db := config.DbClient.
		Preload("Category").
		Preload("User").
		Preload("Images").
		Find(&products)

	if categoryID != "" {
		db = db.Where("products.category_id = ?", categoryID)
	}

	if minPrice != "" {
		db = db.Where("products.price >= ?", minPrice)
	}

	if maxPrice != "" {
		db = db.Where("products.price <= ?", maxPrice)
	}

	if search != "" {
		db = db.Where("products.name ILIKE ?", "%"+search+"%")
	}
	if limit >= 10 {
		limit = 10
	}

	db.Model(&Product{}).Count(&total)

	sortQuery := fmt.Sprintf("%s %s", sortBy, order)
	db = db.Order(sortQuery)

	db.Scopes(Paginate(page, limit)).Find(&products)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: products,
	})
}

func UpdateProductCategory(c *gin.Context) {
	var dto UpdateProductCategoryDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля!",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)

	var product Product
	if err := config.DbClient.Where("id = ? AND user_id = ?", dto.ProductID, user.ID).First(&product).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Продукт не найден!",
			Message: "",
		})
		return
	}

	var category Category
	if err := config.DbClient.Where("id = ?", dto.CategoryID).First(&category).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Категория не найдена!",
			Message: "",
		})
		return
	}

	config.DbClient.Model(&product).Update("CategoryID", dto.CategoryID)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Категория успешно изменена!",
	})
}

func UpdateCategory(c *gin.Context) {
	var dto UpdateCategoryDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля!",
			Message: "",
		})
		return
	}

	var category Category
	if err := config.DbClient.Where("id = ?", dto.CategoryID).First(&category).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Категория не найдена!",
			Message: "",
		})
		return
	}

	config.DbClient.Model(&category).Update("Name", dto.Name)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Категория успешно обновлена!",
	})
}

func AddCategory(c *gin.Context) {
	var dto AddCategoryDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля!",
			Message: "",
		})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Изображение не загружено",
			Message: "",
		})
		return
	}

	filename := fmt.Sprintf("%d", time.Now().UnixNano())
	uploadPath := "./uploads/category/" + filename

	// Сохраняем файл
	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка сохранения файла",
			Message: "",
		})
		return
	}

	newCategory := Category{
		Name: dto.Name,
	}

	if err := config.DbClient.Create(&newCategory).Error; err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Произошла ошибка создания категории",
			Message: "",
		})
		return
	}

	image := Image{
		FullPath:   "/uploads/category/" + filename,
		CategoryID: &newCategory.ID,
	}

	if err := config.DbClient.Create(&image).Error; err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка сохранения изображения",
			Message: "",
		})
		return
	}

	newCategory.ImageID = &image.ID
	config.DbClient.Save(newCategory)

	c.JSON(200, &DefaultResponse{
		Type:  true,
		Error: "",
		Message: gin.H{
			"message":     "Категория и изображение успешно добавлены",
			"name":        newCategory.Name,
			"category_id": newCategory.ID,
			"image_id":    image.ID,
		},
	})
}

func GetUsers(c *gin.Context) {
	var users []User

	if err := config.DbClient.
		Preload("Addresses").
		Preload("Comments").
		Preload("Avatar").
		Find(&users).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при получении пользователей",
			Message: nil,
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: users,
	})
}

func GetAllOrders(c *gin.Context) {
	var orders []Order
	if err := config.DbClient.
		Preload("ProductOrders").
		Preload("Buyer").
		Find(&orders).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при загрузке заказов",
			Message: nil,
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: orders,
	})
}