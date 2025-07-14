package product

import "mime/multipart"

// CreateProductDto Форма создания товара
type CreateProductDto struct {
	// Name товара
	Name        string                  `form:"name" binding:"required"`
	// Description товара
	Description string                  `form:"description" binding:"required"`
	// Price товара
	Price       int                     `form:"price" binding:"required"`
	// Category товара
	Category    uint                    `form:"category" binding:"required"`
	// Images товара
	Images      []*multipart.FileHeader `form:"images" binding:"required"`
}

// CreateProductDto Форма удаления товара
type DeleteProductDto struct {
	// ID товара
	ID uint `json:"id" binding:"required"`
}
