package auth

import (
	. "flowersshop/models"
	. "flowersshop/types"

	"github.com/gin-gonic/gin"
)

// @Summary Получить данные текущего пользователя
// @Description Возвращает данные аутентифицированного пользователя и его токен
// @Tags Авторизация
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Success 200 {object} DefaultResponse{message=SuccessAuthResponse} "Успешный ответ"
// @Failure 401 {object} DefaultResponse "Токен невалиден или отсутствует"
// @Router /api/auth [get]
func Get(c *gin.Context) {
	user := c.MustGet("User").(User)
	token := c.MustGet("Token").(string)

	c.JSON(200, &DefaultResponse{ 
			Type: true,
			Error: "",
			Message: &SuccessAuthResponse{
				Token: token,
				User: user,
			},
		})
}