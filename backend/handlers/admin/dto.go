package admin

type UpdateDisabledDto struct {
	ID       uint `json:"id" binding:"required"`
	Disabled bool `json:"disabled" binding:"required"`
}

type UpdateProductCategoryDto struct {
	ProductID  uint `json:"product_id" binding:"required"`
	CategoryID uint `json:"category_id" binding:"required"`
}

type UpdateCategoryDto struct {
	CategoryID uint   `json:"category_id" binding:"required"`
	Name       string `json:"name" binding:"required"`
}

type AddCategoryDto struct {
	Name string `form:"name" json:"name" binding:"required"`
}
