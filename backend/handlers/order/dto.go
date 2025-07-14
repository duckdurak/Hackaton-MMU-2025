package order

type CommentDto struct {
	OrderID uint   `json:"order_id" binding:"required"`
	Content string `json:"content" binding:"required"`
	Rate    int    `json:"rate" binding:"required,min=1,max=5"`
}

type ProductOrderDto struct {
	OrderID   *uint `json:"order_id,omitempty"` // Может быть nil
	ProductID uint  `json:"product_id" binding:"required"`
	Quantity  uint  `json:"quantity" binding:"required,min=1"`
}

type DeleteProductOrderDto struct {
	ID uint `json:"id" binding:"required"`
}

type AddTrackingDto struct {
	OrderID uint   `json:"order_id" binding:"required"`
	Status  string `json:"status" binding:"required"`
}

type UpdatedOrderedDto struct {
	OrderID string `json:"order_id" binding:"required"`
}

type AddProductOrderDto struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  uint `json:"quantity" binding:"required,min=1"`
}
