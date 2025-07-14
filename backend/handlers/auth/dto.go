package auth

// RegisterDto Форма регистрации
type RegisterDto struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

// RegisterDto Форма авторизации
type LoginDto struct {
	// Email пользователя
	Email    string `json:"email" binding:"required,email" example:"user@example.com"`
	// Password пользователя
	Password string `json:"password" binding:"required" example:"qwerty1234"`
}
