package config

import (
	"flowersshop/models"
	"fmt"

	"github.com/go-redis/redis"
	"github.com/ilyakaznacheev/cleanenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	RedisClient *redis.Client
	DbClient    *gorm.DB
	JwtSecret   []byte
	MailHost    string
	MailPort    int
	MailUser    string
	MailPass    string
	BotToken    string
	ServerPort  int
)

type ApplicationConfig struct {
	MailHost   string `env:"MAIL_HOST"`
	MailPort   int    `env:"MAIL_PORT"`
	MailUser   string `env:"MAIL_USER"`
	MailPass   string `env:"MAIL_PASSWORD"`
	JwtSecret  []byte `env:"JWT_SECRET_KEY"`
	BotToken   string `env:"TELEGRAM_BOT_TOKEN"`
	DbHost     string `env:"DB_HOST"`
	DbUser     string `env:"DB_USER"`
	DbPass     string `env:"DB_PASSWORD"`
	DbName     string `env:"DB_NAME"`
	DbPort     int    `env:"DB_PORT"`
	RedisHost  string `env:"REDIS_ADDR"`
	RedisPort  int    `env:"REDIS_PORT"`
	ServerPort int    `env:"LISTEN_PORT"`
}

var cfg ApplicationConfig

func LoadConfig() {
	if err := cleanenv.ReadConfig(".env", &cfg); err != nil {
		if err := cleanenv.ReadEnv(&cfg); err != nil {
			panic("Проверьте переменные окружения!")
		}
	}

	JwtSecret = cfg.JwtSecret
	MailHost = cfg.MailHost
	MailPort = cfg.MailPort
	MailUser = cfg.MailUser
	MailPass = cfg.MailPass
	BotToken = cfg.BotToken
	ServerPort = cfg.ServerPort
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

	DbClient.AutoMigrate(&models.Category{})
	DbClient.AutoMigrate(&models.Address{})
	DbClient.AutoMigrate(&models.Tracking{})
	DbClient.AutoMigrate(&models.User{})
	DbClient.AutoMigrate(&models.Order{})
	DbClient.AutoMigrate(&models.Comment{})
	DbClient.AutoMigrate(&models.ProductOrder{})
	DbClient.AutoMigrate(&models.Image{})
	DbClient.AutoMigrate(&models.Product{})
}

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%d", cfg.RedisHost, cfg.RedisPort),
	})

	if err := RedisClient.Ping().Err(); err != nil {
		panic("Не удалось подключиться к базе данных Redis: " + err.Error())
	}
}
