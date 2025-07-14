package bot

import (
	"context"
	"fmt"
	"log"
	"strings"
	"tgbot/config"
	. "tgbot/models"

	"github.com/mymmrac/telego"
	th "github.com/mymmrac/telego/telegohandler"
	tu "github.com/mymmrac/telego/telegoutil"
)

func InitBot() {
	ctx := context.Background()

	bot, err := telego.NewBot(config.BotToken, telego.WithDefaultDebugLogger())
	if err != nil {
		panic(err.Error())
	}

	updates, err := bot.UpdatesViaLongPolling(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to get updates: %v", err)
	}

	bot_handler, err := th.NewBotHandler(bot, updates)
	if err != nil {
		log.Fatalf("Failed to create handler: %v", err)
	}
	defer bot_handler.Stop()

	bot_handler.HandleMessage(func(ctx *th.Context, msg telego.Message) error {
		message := msg.Text
		if strings.Contains(message, "/start ") {
			chat_id := msg.Chat.ChatID()
			telegram_id := msg.From.ID
			user_id := strings.Replace(message, "/start ", "", 1)

			var user User
			if err := config.DbClient.Where("id = ?", user_id).First(&user).Error; err != nil {
				fmt.Println(err.Error())
				return nil
			}

			user.TelegramID = int(telegram_id)
			if err := config.DbClient.Save(user).Error; err != nil {
				fmt.Println(err.Error())
				return nil
			}

			bot.SendMessage(ctx, tu.Message(chat_id, "Вы успешно привязали свой телеграм аккаунт! Теперь вы будете получать уведомления здесь."))
		}

		return nil
	})

	defer func() { _ = bot_handler.Stop() }()

	_ = bot_handler.Start()
}