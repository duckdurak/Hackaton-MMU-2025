package order

import (
	"bytes"
	"encoding/json"
	"flowersshop/config"
	"flowersshop/handlers/mail"

	. "flowersshop/models"
	. "flowersshop/types"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AddComment(c *gin.Context) {
	var dto CommentDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля корректно!",
			Message: "",
		})
		return
	}

	user := c.MustGet("user").(User)

	var order Order
	if err := config.DbClient.Where("id = ? AND (buyer_id = ? OR seller_id = ?)", dto.OrderID, user.ID, user.ID).First(&order).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Заказ не найден!",
			Message: "",
		})
		return
	}

	newComment := Comment{
		Content:   dto.Content,
		Rate:      dto.Rate,
		UserID:    user.ID,
		OrderID:   dto.OrderID,
		CreatedAt: time.Now(),
	}

	config.DbClient.Create(&newComment)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Комментарий успешно добавлен!",
	})
}

func AddProductOrder(c *gin.Context) {
	var dto AddProductOrderDto

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля!",
			Message: "",
		})
		return
	}

	user := c.MustGet("User").(User)

	var product Product
	if err := config.DbClient.First(&product, dto.ProductID).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Продукт не найден",
			Message: "",
		})
		return
	}

	var order Order

	if err := config.DbClient.
		Preload("Buyer").
		Preload("Trackings").
		Preload("Comments").
		Preload("ProductOrders").
		Preload("ProductOrders.Product").
		Preload("ProductOrders.Product.Images").
		Where("buyer_id = ? AND finished = ? AND ordered = ?", user.ID, false, false).
		First(&order).Error; err == nil {

		var existingPO ProductOrder
		if err := config.DbClient.Where("product_id = ? AND order_id = ?", dto.ProductID, order.ID).
			First(&existingPO).Error; err == nil {
			existingPO.Quantity += dto.Quantity
			config.DbClient.Save(&existingPO)
		} else {
			po := ProductOrder{
				ProductID: dto.ProductID,
				OrderID:   order.ID,
				Quantity:  dto.Quantity,
			}
			config.DbClient.Create(&po)
		}
	} else {
		newOrder := Order{
			Buyer_id: user.ID,
			Finished: false,
			Ordered:  false,
		}
		config.DbClient.Create(&newOrder)

		po := ProductOrder{
			ProductID: dto.ProductID,
			OrderID:   newOrder.ID,
			Quantity:  dto.Quantity,
		}
		config.DbClient.Create(&po)

		order = newOrder
	}

	var updatedOrder Order
	if err := config.DbClient.
		Preload("Buyer").
		Preload("Trackings").
		Preload("Comments").
		Preload("ProductOrders").
		Preload("ProductOrders.Product").
		Preload("ProductOrders.Product.Images").
		Where("id = ?", order.ID).
		First(&updatedOrder).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при загрузке заказа",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: updatedOrder,
	})
}

func ProcessOrder(c *gin.Context) {
	user := c.MustGet("User").(User)

	var order Order
	if err := config.DbClient.Where("buyer_id = ? AND ordered = ?", user.ID, false).Preload("ProductOrders").First(&order).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Корзина пуста или не найдена",
			Message: nil,
		})
		return
	}

	if len(order.ProductOrders) == 0 {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "В корзине нет товаров",
			Message: nil,
		})
		return
	}

	order.Ordered = true
	config.DbClient.Save(&order)

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Заказ успешно оформлен",
	})
}

func DeleteProductOrder(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(403, &DefaultResponse{
			Type:    false,
			Error:   "Неверный продукт для удаления",
			Message: "",
		})
		return
	}

	var productOrder ProductOrder
	if err := config.DbClient.First(&productOrder, id).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Товар в заказе не найден!",
			Message: "",
		})
		return
	}

	config.DbClient.Delete(&productOrder)

	var remainingCount int64
	config.DbClient.Model(&ProductOrder{}).
		Where("order_id = ?", productOrder.OrderID).
		Count(&remainingCount)

	var order Order

	if remainingCount == 0 {
		config.DbClient.Delete(&Order{}, productOrder.OrderID)
		c.JSON(200, &DefaultResponse{
			Type:    true,
			Error:   "",
			Message: "Корзина пуста. Заказ удалён.",
		})
		return
	}

	if err := config.DbClient.
		Preload("ProductOrders").
		Preload("ProductOrders.Product").
		Preload("ProductOrders.Product.Images").
		First(&order, productOrder.OrderID).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Не удалось загрузить корзину",
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:  true,
		Error: "",
		Message: order,
	})
}

func GetOrders(c *gin.Context) {
	var orders []Order

	user := c.MustGet("User").(User)

	orderedStr := c.DefaultQuery("ordered", "false")
	ordered := orderedStr == "true"

	if err := config.DbClient.
		Preload("Buyer").
		Preload("Trackings").
		Preload("Comments").
		Preload("ProductOrders.Product.Images").
		Where("buyer_id = ?", user.ID).
		Where("ordered = ?", ordered).
		Where("finished = ?", false).
		Find(&orders).Error; err != nil {

		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Ошибка при загрузке заказов",
			Message: nil,
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: orders,
	})
}

func AddTracking(c *gin.Context) {
	var dto AddTrackingDto

	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "Заполните все поля!",
			Message: "",
		})
		return
	}

	newTracking := Tracking{
		OrderID: dto.OrderID,
		Status:  dto.Status,
	}

	if err := config.DbClient.Create(&newTracking).Error; err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   "Произошла ошибка с добавлением трэкинга!",
			Message: "",
		})
		return
	}

	var order Order
	if err := config.DbClient.Preload("Buyer").Where("id = ?", dto.OrderID).First(&order).Error; err != nil {
		c.JSON(404, &DefaultResponse{
			Type:    false,
			Error:   "Заказ не найден!",
			Message: "",
		})
		return
	}

	user := order.Buyer
	if user.TelegramID == 0 {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "У пользователя нет Telegram ID!",
			Message: "",
		})
		return
	}

	err := mail.SendEmail(user.Email, "Изменение статуса заказа!", newTracking.Status)
	if err != nil {
		c.JSON(400, &DefaultResponse{
			Type:    false,
			Error:   "не удалось уведомить пользователя об измении статуса заказа!",
			Message: "",
		})
		return
	}

	messageText := fmt.Sprintf("Ваш заказ #%d изменился на статус: %s", newTracking.OrderID, newTracking.Status)

	chatID := user.TelegramID

	err = sendTelegramMessage(config.BotToken, chatID, messageText)
	if err != nil {
		c.JSON(500, &DefaultResponse{
			Type:    false,
			Error:   fmt.Sprintf("Ошибка: %s", err),
			Message: "",
		})
		return
	}

	c.JSON(200, &DefaultResponse{
		Type:    true,
		Error:   "",
		Message: "Трэкинг успешно добавлен и уведомление отправлено!",
	})
}

func sendTelegramMessage(botToken string, chatID int, message string) error {
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)

	payload := map[string]interface{}{
		"chat_id":    chatID,
		"text":       message,
		"parse_mode": "Markdown",
	}

	body, _ := json.Marshal(payload)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		fmt.Println("Ошибка отправки сообщения в Telegram:", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Не удалось отправить сообщение в Telegram: %d\n", resp.StatusCode)
		return fmt.Errorf("telegram api error: %d", resp.StatusCode)
	}

	return nil
}
