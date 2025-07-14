package profile

import (
	"flowersshop/config"
	"flowersshop/handlers/mail"
	. "flowersshop/models"
	. "flowersshop/types"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// @Summary Поиск пользователя
// @Description Поиск пользователя по ID
// @Tags Профиль
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param id path int true "ID пользователя"
// @Success 404 {object} DefaultResponse "Пользователь не найден!"
// @Failure 200 {object} DefaultResponse{Message=User}
// @Router /api/profile/:id [get]
func Profile(c *gin.Context) {
	id := c.Param("id")

	var user User
	result := config.DbClient.Where("id = ?", id).First(&user)
	if result.Error != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Пользователь не найден!",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: user,
	})
}

// @Summary Добавление адреса
// @Description Добавление адреса доставки
// @Tags Профиль
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param Форма body AddressDto true "Полный адрес пользователя"
// @Success 400 {object} DefaultResponse "Заполните форму полностью!"
// @Success 403 {object} DefaultResponse "Вы не можете добавить больше 10 адресов!"
// @Failure 200 {object} DefaultResponse "Адрес был успешно добавлен!"
// @Router /api/profile/address [post]
func AddAddress(c *gin.Context) {
	var dto AddressDto
	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните форму полностью!",
			Message: "",
		})
		return
	}
	user := c.MustGet("User").(User)
	var count int64

	config.DbClient.Model(&Address{}).Where("user_id = ?", user.ID).Count(&count)

	if count >= 10 {
		c.JSON(403, &DefaultResponse{
			Type:    false,
			Error:   "Вы не можете добавить больше 10 адресов!",
			Message: "",
		})
		return
	}

	NewAddress := Address{
		FullAddress: dto.FullAddress,
		UserID:      user.ID,
	}

	config.DbClient.Create(&NewAddress)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: NewAddress,
	})
}

// @Summary Получить список адресов
// @Description Получить список адресов текущего пользвоателя
// @Tags Профиль
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Failure 200 {object} DefaultResponse{Message=[]Address}
// @Router /api/profile/addresses [get]
func GetAddresses(c *gin.Context) {
	user := c.MustGet("User").(User)

	var addresses []Address
	config.DbClient.Where("user_id = ?", user.ID).Find(&addresses)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: addresses,
	})
}

// @Summary Удаление адреса
// @Description Удаление адреса доставки
// @Tags Профиль
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param Форма body DeleteAddressDto true "ID адреса"
// @Success 400 {object} DefaultResponse "Заполните форму полностью!"
// @Success 404 {object} DefaultResponse "Адрес не найден!"
// @Failure 200 {object} DefaultResponse "Адрес был успешно удален!"
// @Router /api/profile/address [delete]
func DeleteAddress(c *gin.Context) {
	var dto DeleteAddressDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните форму полностью!",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)

	var address Address
	if err := config.DbClient.Where("id = ? AND user_id = ?", dto.ID, user.ID).First(&address).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Адрес не найден!",
			Message: "",
		})
		return
	}

	config.DbClient.Delete(&address)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Адрес был успешно удален!",
	})
}

func BindTelegramId(c *gin.Context) {
	var dto BindTelegramDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля!",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)

	config.DbClient.Model(&user).Update("TelegramID", dto.TelegramID)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Telegram ID успешно привязан!",
	})
}

func UpdatePassword(c *gin.Context) {
	var dto ChangePasswordDto

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка валидации",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.Password)); err != nil {
		c.JSON(403, &DefaultResponse{
			Type:  false,
			Error: "Неверный текущий пароль!",
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка сервера",
			Message: "",
		})
		return
	}

	if err := config.DbClient.Model(&user).Update("Password", string(hashedPassword)).Error; err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось обновить пароль",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Пароль успешно изменён",
	})

}

// @Summary Отправка токена на почту
// @Description Отправка токена на почту для восстановления доступа на почту
// @Tags Авторизация
// @Accept json
// @Produce json
// @Param credentials body ForgotPasswordDto true "Почта пользователя"
// @Success 200 {object} DefaultResponse "Письмо отправлено!"
// @Failure 400 {object} DefaultResponse "Ошибка сервера!"
// @Failure 500 {object} DefaultResponse "Не удалось отправить отправить письмо!"
// @Router /api/auth/forgot [post]
func ForgotPassword(c *gin.Context) {
	var dto ForgotPasswordDto

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Неверные данные!",
			Message: "",
		})
		return
	}

	var user User
	if err := config.DbClient.Where("email = ?", dto.Email).First(&user).Error; err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Пользователь не найден!",
			Message: "",
		})
		return
	}

	token := uuid.New().String()

	if err := config.RedisClient.Set("reset_token_"+token, dto.Email, 15*time.Minute).Err(); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка сервера!",
			Message: "",
		})
		return
	}

	schema := "http"
	if c.Request.TLS != nil {
		schema = "https"
	}

	body := mail.GenerateResetMessage(fmt.Sprintf("%s://%s/profile/reset?token=%s", schema, c.Request.Host, token))

	if err := mail.SendEmail(dto.Email, "Восстановление забытого пароля", body); err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось отправить отправить письмо!",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Письмо отправлено!",
	})
}

// @Summary Сброс пароля
// @Description Сброс пароля с действуюшим токеном
// @Tags Авторизация
// @Accept json
// @Produce json
// @Param credentials body ResetPasswordDto true "Почта пользователя"
// @Success 200 {object} DefaultResponse "Письмо отправлено!"
// @Failure 400 {object} DefaultResponse "Недействительный или истёкший токен!"
// @Failure 404 {object} DefaultResponse "Пользователь не найден!"
// @Router /api/auth/reset [post]
func ResetPassword(c *gin.Context) {
	var dto ResetPasswordDto

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все данные!",
			Message: "",
		})
		return
	}

	email, err := config.RedisClient.Get("reset_token_" + dto.Token).Result()
	if err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Недействительный или истёкший токен!",
			Message: "",
		})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(dto.NewPassword), bcrypt.DefaultCost)

	var user User
	if err := config.DbClient.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Пользователь не найден!",
			Message: "",
		})
		return
	}

	config.DbClient.Model(&user).Update("Password", string(hashedPassword))

	config.RedisClient.Del("reset_token_" + dto.Token)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Пароль успешно изменён",
	})
}

// @Summary Загрузка аватарки
// @Description Загрузка аватарки пользователя
// @Tags Профиль
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param Форма formData file true "Файл аватара"
// @Success 400 {object} DefaultResponse "Загрузите фото!"
// @Success 404 {object} DefaultResponse "Адрес не найден!"
// @Success 500 {object} DefaultResponse "Не удалось сохранить аватарку!"
// @Failure 200 {object} DefaultResponse{Message=Image}
// @Router /api/profile/avatar [post]
func UploadAvatar(c *gin.Context) {
	user := c.MustGet("User").(User)

	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Загрузите фото!",
			Message: "",
		})
		return
	}

	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", user.ID, ext)
	uploadPath := "./uploads/avatars/" + filename

	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось сохранить аватарку!",
			Message: "",
		})
		return
	}

	avatarURL := "/uploads/avatars/" + filename

	if user.AvatarID != nil {
		var oldImage Image
		config.DbClient.Where("id = ?", *user.AvatarID).First(&oldImage)
		if oldImage.FullPath != "" {
			os.Remove("." + oldImage.FullPath)
		}
		config.DbClient.Delete(&oldImage)
	}

	newImage := Image{
		FullPath: avatarURL,
		UserID:   &user.ID,
	}

	if err := config.DbClient.Create(&newImage).Error; err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось сохранить запись аватарки!",
			Message: "",
		})
		return
	}

	user.AvatarID = &newImage.ID
	config.DbClient.Save(&user)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: newImage,
	})
}

// @Summary Удаление аватарки
// @Description Удаление аватарки текущего пользователя
// @Tags Профиль
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Failure 403 {object} DefaultResponse "Аватарка не установлена"
// @Failure 404 {object} DefaultResponse "Не удалось найти запись аватарки"
// @Failure 200 {object} DefaultResponse "Аватарка успешно удалена!"
// @Router /api/profile/avatar [delete]
func DeleteAvatar(c *gin.Context) {
	user := c.MustGet("User").(User)

	if user.AvatarID == nil {
		c.JSON(403, &DefaultResponse{
			Type:    false,
			Error:   "Аватарка не установлена",
			Message: "",
		})
		return
	}

	var image Image
	if err := config.DbClient.First(&image, *user.AvatarID).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось найти запись аватарки",
			Message: "",
		})
		return
	}

	filePath := "." + image.FullPath
	if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось удалить файл аватарки",
			Message: "",
		})
		return
	}

	config.DbClient.Delete(&image)

	user.AvatarID = nil
	config.DbClient.Save(&user)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Аватарка успешно удалена!",
	})
}

func GetImage(c *gin.Context) {
	imageID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Нету такого id!",
			Message: "",
		})
		return
	}

	var image Image
	if err := config.DbClient.First(&image, imageID).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "",
			Message: "Аватарка не найдена!",
		})
	}

	c.JSON(200, gin.H{
		"id":       image.ID,
		"fullPath": image.FullPath,
	})

	c.JSON(200, &DefaultResponse{
		Type:  true,
		Error: "",
		Message: gin.H{
			"id":       image.ID,
			"fullPath": image.FullPath,
		},
	})
}

func UpdateUserInfo(c *gin.Context) {
	var dto UpdateFIODto

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, gin.H{
			"Type":    false,
			"Error":   "Неверные данные",
			"Message": nil,
		})
		return
	}

	user := c.MustGet("User").(User)

	config.DbClient.Model(&user).Updates(map[string]interface{}{
		"first_name": dto.FirstName,
		"last_name":  dto.LastName,
	})

	c.JSON(200, gin.H{
		"Type":    true,
		"Error":   "",
		"Message": "Имя и фамилия успешно обновлены",
	})
}
