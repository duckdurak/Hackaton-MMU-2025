package main

import (
	"tgbot/bot"
	"tgbot/config"
)

func main() {
	config.LoadConfig()
	config.InitDB()
	bot.InitBot()

	// r := gin.Default()
}