package product

import (
	"errors"
	"flowersshop/config"
	. "flowersshop/models"
	. "flowersshop/types"
	"fmt"
	"os"
	"path/filepath"
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

// @Summary Создать товар
// @Description Создать товар с указанными фотографиями и категорией
// @Tags Товары
// @Accept multipart/form-data
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param name formData string true "Название товара"
// @Param description formData string false "Описание товара"
// @Param category formData integer true "ID категории"
// @Param price formData number true "Цена товара"
// @Param images formData file true "Изображения товара"
// @Failure 400 {object} DefaultResponse "Невалидные данные"
// @Failure 404 {object} DefaultResponse "Категория не найдена!"
// @Failure 500 {object} DefaultResponse "Ошибка при сохранении файлов"
// @Success 200 {object} DefaultResponse{message=Product} "Товар успешно создан"
// @Router /api/product [post]
func CreateProduct(c *gin.Context) {
	var dto CreateProductDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните форму полностью!",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)

	var category Category
	if err := config.DbClient.Where("id = ?", dto.Category).First(&category).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Категория не найдена!",
			Message: "",
		})
		return
	}

	product := Product{
		Name:        dto.Name,
		Description: dto.Description,
		Disabled:    true,
		CategoryID:  dto.Category,
		Category:    category,
		User:        user,
		UserID:      user.ID,
		Price:       dto.Price,
	}
	config.DbClient.Create(&product)

	uploadDir := fmt.Sprintf("./uploads/product/%d", product.ID)
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	for _, file := range dto.Images {
		filename := fmt.Sprintf("%d", time.Now().UnixNano())
		dstPath := filepath.Join(uploadDir, filename)

		err := c.SaveUploadedFile(file, dstPath)
		if err != nil {
			c.JSON(500, &DefaultResponse{
				Type:    false,
				Error:   "Не получилось сохранить файл!",
				Message: err.Error(),
			})
		}

		image := Image{
			FullPath:  "/" + dstPath,
			ProductID: &product.ID,
		}
		config.DbClient.Create(&image)
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: product,
	})
}

// @Summary Удаление товара
// @Description Удаление товара по ID
// @Tags Товары
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param Форма body string true "Форма удаления товара"
// @Failure 400 {object} DefaultResponse "Заполните форму полностью!"
// @Failure 403 {object} DefaultResponse "Вы не являетесь владельцем этого товара!"
// @Failure 404 {object} DefaultResponse "Товар не найден!"
// @Failure 500 {object} DefaultResponse "Не удалось удалить папку с изображениями!"
// @Success 200 {object} DefaultResponse "Товар успешно удален!"
// @Router /api/product [delete]
func DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Неверный продукт!",
			Message: "",
		})
		return
	}

	var product Product

	if err := config.DbClient.Preload("Images").First(&product, id).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Товар не найден!",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)
	if product.UserID != user.ID {
		c.JSON(403, &DefaultResponse{
			Type:    false,
			Error:   "Вы не являетесь владельцем этого товара!",
			Message: "",
		})
		return
	}

	if err := config.DbClient.Delete(&product).Error; err != nil {
		c.JSON(403, &DefaultResponse{
				Type:    false,
				Error:   "Нельзя удалить продукт, который уже был заказан!",
				Message: "",
			})
			return
	}

	uploadDir := fmt.Sprintf("./uploads/product/%d", id)
	if _, err := os.Stat(uploadDir); !os.IsNotExist(err) {
		err := os.RemoveAll(uploadDir)
		if err != nil {
			c.JSON(500, &DefaultResponse{
				Type:    false,
				Error:   "Не удалось удалить папку с изображениями!",
				Message: err.Error(),
			})
			return
		}
	}

	if len(product.Images) > 0 {
		config.DbClient.Where("product_id = ?", id).Delete(&Image{})
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Товар успешно удален!",
	})
}

// func GetProducts(c *gin.Context) {
// 	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
// 	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
// 	sortBy := c.DefaultQuery("sort_by", "id")
// 	order := c.DefaultQuery("order", "asc")

// 	categoryID := c.Query("category_id")
// 	minPrice := c.Query("min_price")
// 	maxPrice := c.Query("max_price")
// 	search := c.Query("search")

// 	validSortFields := map[string]bool{
// 		"id":       true,
// 		"name":     true,
// 		"price":    true,
// 		"category": true,
// 	}
// 	if !validSortFields[sortBy] {
// 		sortBy = "id"
// 	}

// 	if sortBy == "category" {
// 		sortBy = "categories.name"
// 	}

// 	if order != "asc" && order != "desc" {
// 		order = "asc"
// 	}

// 	var products []Product
// 	var total int64

// 	db := config.DbClient.
// 		Preload("Category").
// 		Preload("User").
// 		Preload("Images").
// 		Find(&products).
// 		Where("products.disabled = ?", false)

// 	if categoryID != "" {
// 		db = db.Where("products.category_id = ?", categoryID)
// 	}

// 	if minPrice != "" {
// 		db = db.Where("products.price >= ?", minPrice)
// 	}

// 	if maxPrice != "" {
// 		db = db.Where("products.price <= ?", maxPrice)
// 	}

// 	if search != "" {
// 		db = db.Where("products.name ILIKE ?", "%"+search+"%")
// 	}
// 	if limit >= 10 {
// 		limit = 10
// 	}

// 	db.Model(&Product{}).Count(&total)

// 	sortQuery := fmt.Sprintf("%s %s", sortBy, order)
// 	db = db.Order(sortQuery)

// 	db.Scopes(Paginate(page, limit)).Find(&products)

// 	c.JSON(200, &DefaultResponse{
// 		Type:    true,
// 		Error:   "",
// 		Message: products,
// 	})
// }

func GetProducts(c *gin.Context) {
	var products []Product

	if err := config.DbClient.
		Preload("Category").
		Preload("User").
		Preload("Images").
		Find(&products).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при получении товаров",
			Message: nil,
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: products,
	})
}

func GetProduct(c *gin.Context) {
	idStr := c.Param("id")
	if idStr == "" {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "ID продукта не указан!",
			Message: "",
		})
		return
	}

	id, err := strconv.ParseUint(idStr, 10, strconv.IntSize)
	if err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Некорректный ID продукта!",
			Message: err.Error(),
		})
		return
	}

	var product Product

	result := config.DbClient.
		Preload("Category").
		Preload("User").
		Preload("Images").
		Where("id = ?", id).
		First(&product).
		Where("products.disabled = ?", false)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(400, &DefaultResponse{
				Type:    false,
				Error:   "Продукт не найден!",
				Message: "",
			})
			return
		}
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при получении продукта!",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: product,
	})
}

func GetCategories(c *gin.Context) {
	var categories []Category
	config.DbClient.Find(&categories)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: categories,
	})
}

func GetProductsByCategory(c *gin.Context) {
	var products []Product

	categoryID := c.Param("id")

	if err := config.DbClient.
		Preload("Category").
		Preload("User").
		Preload("Images").
		Where("category_id = ?", categoryID).
		Find(&products).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при получении товаров",
			Message: nil,
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: products,
	})
}

func GetImage(c *gin.Context) {
	imageID := c.Param("id")

	var image Image
	if err := config.DbClient.
		Preload("Category").
		First(&image, imageID).Error; err != nil {

		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Изображение не найдено!",
			Message: nil,
		})
		return
	}

	_, err := os.ReadFile("./" + image.FullPath)
	if err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Изображение не найдено1!",
			Message: nil,
		})
		return
	}

	c.Header("Content-Type", "image/jpeg")
	c.File("." + image.FullPath)
}
