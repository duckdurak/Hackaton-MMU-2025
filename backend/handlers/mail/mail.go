package mail

import (
	"flowersshop/config"
	"fmt"

	"gopkg.in/gomail.v2"
)

func GenerateResetMessage(target_host string) string {
	return fmt.Sprintf(`<h2>Сброс пароля</h2><p>Перейдите по ссылке, чтобы восстановить пароль:</p><a href="%s">Ссылка</a>`, target_host)
}

func GenerateApproveMessage(target_host string) string {
	return fmt.Sprintf(`<h2>Подтверждения пароля</h2><p>Перейдите по ссылке, чтобы подтвердить аккаунт:</p><a href="%s">Ссылка</a>`, target_host)
}

func SendEmail(target_email, target_subject, target_body string) error {
	mailer := gomail.NewMessage()
	mailer.SetHeader("From", config.MailUser)
	mailer.SetHeader("To", target_email)
	mailer.SetHeader("Subject", target_subject)
	mailer.SetBody("text/html", target_body)

	dialer := gomail.NewDialer(config.MailHost, config.MailPort, config.MailUser, config.MailPass)

	return dialer.DialAndSend(mailer)
}
