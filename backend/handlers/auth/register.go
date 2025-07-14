package auth

import (
	"flowersshop/config"
	"flowersshop/handlers/mail"
	. "flowersshop/models"
	. "flowersshop/types"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// @Summary Зарегистрировать пользователя
// @Description Регистрация в системе по email и паролю
// @Tags Авторизация
// @Accept json
// @Produce json
// @Param credentials body RegisterDto true "Данные для регистрации"
// @Success 200 {object} DefaultResponse "Регистрация успешна. Проверьте почту для подтверждения."
// @Failure 400 {object} DefaultResponse "Заполните форму полностью!"
// @Failure 403 {object} DefaultResponse "Пользователь с такой почтой уже существует!"
// @Failure 500 {object} DefaultResponse "Ошибка сохранения токена!"
// @Router /api/auth/register [post]
func Register(c *gin.Context) {
	var dto RegisterDto
	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните форму полностью!",
			Message: "",
		})
		return
	}

	var existingUser User
	if err := config.DbClient.Where("email = ?", dto.Email).First(&existingUser).Error; err == nil {
		c.JSON(403, &DefaultResponse{
			Type:    false,
			Error:   "Пользователь с такой почтой уже существует!",
			Message: "",
		})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)

	user := User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Discount:  5,
		Password:  string(hashedPassword),
		Role:      1,
		Verified:  false,
	}
	config.DbClient.Create(&user)

	token := uuid.New().String()

	err := config.RedisClient.Set("confirm_email:"+token, user.Email, 15*time.Minute).Err()
	if err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка сохранения токена!",
			Message: "",
		})
		return
	}

	schema := "http"
	if c.Request.TLS != nil {
		schema = "https"
	}
	
	link := fmt.Sprintf("%s://%s/api/auth/verify?token=%s", schema, c.Request.Host, token)
	body := mail.GenerateApproveMessage(link)

	err = mail.SendEmail(user.Email, "Подтвердите регистрацию", body)
	if err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось отправить письмо!",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Регистрация успешна. Проверьте почту для подтверждения.",
	})
}

func VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Токен не указан!",
			Message: "",
		})
		return
	}

	email, err := config.RedisClient.Get("confirm_email:" + token).Result()
	if err == redis.Nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Твой токен истек или не существует!",
			Message: "",
		})
		return
	} else if err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Внутренняя ошибка сервера!",
			Message: "",
		})
		return

	}

	config.RedisClient.Del("confirm_email:" + token)

	var user User
	if err := config.DbClient.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Пользователь не найден!",
			Message: "",
		})
		return
	}

	user.Verified = true
	config.DbClient.Save(&user)

	c.Redirect(301, "/")
}
