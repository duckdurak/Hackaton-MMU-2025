package models

import (
	"time"
)

// User Сущность пользователя
// @Description Описание сущности пользователя
type User struct {
	// ID указывает на уникальный идентфиикатор пользователя
	ID uint `gorm:"primaryKey;autoIncrement"`
	// FirstName указывает на имя пользователя
	FirstName string `gorm:"column:first_name"`
	// LastName указывает на фамилию пользователя
	LastName string `gorm:"column:last_name"`
	// Email указывает на почту пользователя
	Email string `gorm:"unique"`
	// Password указывает на пароль пользователя
	Password string `form:"password"`
	// Role указывает на роль пользователя (1 - пользователь, 2 - администратор)
	Role int
	// TelegramID указывает на уникальный идентификатор пользователя в телеграмме
	TelegramID int
	// Discount указывает на текущий уровень скидки
	Discount int
	// Verified указывает на подтверждение профиля пользователя
	Verified bool
	// Avatar указывает на сущность Image
	Avatar Image `gorm:"foreignKey:UserID"`
	// Addresses указывает на существующие адреса пользователя
	Addresses []Address `gorm:"foreignKey:UserID;references:ID"`
	// Comments указывает массив сущностей Comment
	Comments []Comment `gorm:"foreignKey:UserID"`
	// AvatarID указывает на уникальные идентификаторы на сущности Image
	AvatarID *uint
}

// User Сущность адреса
// @Description Описание сущности адреса
type Address struct {
	// ID указывает на уникальный идентфиикатор адреса
	ID uint `gorm:"primaryKey;autoIncrement"`
	// FullAddress указывает на полный адрес пользователя
	FullAddress string
	// UserID указывает на айди пользователя этого адреса
	UserID uint
}

// Product Сущность товара
// @Description Описание сущности товара
type Product struct {
	ID          uint `gorm:"primaryKey;autoIncrement"`
	Name        string
	Description string
	Price       int
	Disabled    bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
	CategoryID  uint     `gorm:"not null"`
	Category    Category `gorm:"foreignKey:CategoryID;references:ID;OnDelete:CASCADE"`
	UserID      uint
	User        User    `gorm:"foreignKey:UserID;references:ID;OnDelete:CASCADE"`
	Images      []Image `gorm:"foreignKey:ProductID"`
}

// Category Сущность категории товара
// @Description Описание сущности категории товара
type Category struct {
	ID      uint `gorm:"primaryKey;autoIncrement"`
	Name    string
	ImageID *uint
	Image   *Image `gorm:"foreignKey:ImageID"`
}

// Order Сущность заказа
// @Description Описание сущности заказа
type Order struct {
	ID            uint `gorm:"primaryKey;autoIncrement"`
	CreatedAt     time.Time
	Buyer_id      uint `gorm:"not null"`
	Buyer         User `gorm:"foreignKey:Buyer_id;references:ID"`
	Finished      bool
	Ordered       bool
	Trackings     []Tracking     `gorm:"foreignKey:OrderID"`
	Comments      []Comment      `gorm:"foreignKey:OrderID"`
	ProductOrders []ProductOrder `gorm:"foreignKey:OrderID"`
}

// ProductOrder Сущность корзины
// @Description Описание сущности корзины
type ProductOrder struct {
	ID        uint `gorm:"primaryKey;autoIncrement"`
	Quantity  uint
	ProductID uint    `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID;references:ID"`
	OrderID   uint    `gorm:"not null"`
	// Order     Order   `gorm:"foreignKey:OrderID;references:ID"`
}

// Tracking Сущность трекинга статуса заказа
// @Description Описание сущности трекинга статуса заказа
type Tracking struct {
	ID        uint `gorm:"primaryKey;autoIncrement"`
	Status    string
	CreatedAt time.Time
	OrderID   uint `gorm:"not null"`
}

// Comment Сущность коментария заказа
// @Description Описание сущности коментария заказа
type Comment struct {
	ID        uint   `gorm:"primaryKey;autoIncrement"`
	Content   string `gorm:"type:text"`
	Rate      int    `gorm:"check:rate >= 1 AND rate <= 5"`
	CreatedAt time.Time
	UserID    uint `gorm:"not null"`
	User      User `gorm:"foreignKey:UserID;references:ID"`

	OrderID uint  `gorm:"not null"`
	Order   Order `gorm:"foreignKey:OrderID;references:ID"`
}

// Image Сущность загруженных фотографий
// @Description Описание сущности загруженных фотографий
type Image struct {
	ID         uint `gorm:"primaryKey;autoIncrement"`
	FullPath   string
	UserID     *uint
	ProductID  *uint
	CategoryID *uint
	Category   *Category `gorm:"foreignKey:CategoryID"`
}
