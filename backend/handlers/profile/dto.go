package profile

// AddressDto Форма добавления адреса
type AddressDto struct {
	// FullAddress Пользователя
	FullAddress string `json:"fulladdress" binding:"required"`
}

// DeleteAddressDto Форма удаления адреса
type DeleteAddressDto struct {
	// ID Адреса
	ID uint `json:"id" binding:"required"`
}

type BindTelegramDto struct {
	TelegramID int `json:"telegram_id" binding:"required"`
}

type ChangePasswordDto struct {
	Password       string `json:"password" binding:"required"`
	NewPassword    string `json:"new_password" binding:"required,min=6"`
	RepeatPassword string `json:"repeat_password" binding:"required,eqfield=NewPassword"`
}

// ForgotPasswordDto Форма попытки сброса пароля
type ForgotPasswordDto struct {
	// Email пользователя
	Email string `json:"email" binding:"required,email" example:"user@example.com"`
}

// ResetPasswordDto Форма сброса пароля
type ResetPasswordDto struct {
	// Token с Query['token'] параметра
	Token string `json:"token" binding:"required"`
	// NewPassword пользователя
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type UpdateFIODto struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
}
