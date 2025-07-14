package config

import (
	"fmt"

	"github.com/ilyakaznacheev/cleanenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DbClient    *gorm.DB
	MailHost    string
	MailPort    int
	MailUser    string
	MailPass    string
	BotToken    string
	ServerPort  int
)

type ApplicationConfig struct {
	DbHost     string `env:"DB_HOST"`
	DbUser     string `env:"DB_USER"`
	DbPass     string `env:"DB_PASSWORD"`
	DbName     string `env:"DB_NAME"`
	DbPort     int    `env:"DB_PORT"`
	BotToken   string `env:"TELEGRAM_BOT_TOKEN"`
}

var cfg ApplicationConfig

func LoadConfig() {
	if err := cleanenv.ReadConfig(".env", &cfg); err != nil {
		if err := cleanenv.ReadEnv(&cfg); err != nil {
			panic("Проверьте переменные окружения!")
		}
	}

	BotToken = cfg.BotToken
}

func InitDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		cfg.DbHost,
		cfg.DbUser,
		cfg.DbPass,
		cfg.DbName,
		cfg.DbPort,
	)

	var err error
	DbClient, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		panic("Не удалось подключиться к базе данных: " + err.Error())
	}
}
