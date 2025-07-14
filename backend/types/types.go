package types

import (
	. "flowersshop/models"
)

// DefaultResponse Дефолтный ответ сервера
type DefaultResponse struct {
	Type bool
	Error string
	Message any
}

// SuccessAuthResponse - успешный ответ аутентификации
// @Description Возвращает JWT-токен и данные пользователя
type SuccessAuthResponse struct {
	Token string	`example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
	User User 		``
}