package models

type User struct {
	ID         uint   `gorm:"primaryKey;autoIncrement"`
	FirstName  string `gorm:"column:first_name"`
	LastName   string `gorm:"column:last_name"`
	Email      string `gorm:"unique"`
	Password   string `form:"password"`
	Role       int
	TelegramID int
	Discount   int
}

