import about from "../../assets/about.png"
import { AboutContainer,Title,Subtitle,BenefitsList,BenefitItem,ContactInfo,Text,ContactItem,ContactIcon,AboutImg } from "./AboutPage.styles";


export const AboutPage = () => {
  return (
    <div className=' flex m-10 items-center'>

    <AboutContainer>
      <Title>О нас</Title>
      
      <Text>
        Мы — команда влюбленных в цветы людей, создающая неповторимые букеты 
        и цветочные композиции для самых важных моментов вашей жизни. 
        Наш магазин сочетает в себе изысканный вкус, свежесть и индивидуальный подход к каждому клиенту.
      </Text>
      
      <Subtitle>Почему выбирают нас?</Subtitle>
      
      <BenefitsList>
        <BenefitItem>Мы работаем только с проверенными поставщиками, чтобы наши цветы оставались прекрасными как можно дольше.</BenefitItem>
        <BenefitItem>Наши флористы создают композиции с душой, учитывая ваши пожелания и тренды в мире флористики.</BenefitItem>
        <BenefitItem>Будь то свадьба, день рождения или просто знак внимания — мы подберем идеальный вариант.</BenefitItem>
      </BenefitsList>
      
      <ContactInfo>
        <ContactItem>
          <ContactIcon>📍</ContactIcon>
          г.Москва, Ленинградский проспект, 13c
        </ContactItem>
        <ContactItem>
          <ContactIcon>📞</ContactIcon>
          +7 (925) 544-59-69
        </ContactItem>
        <ContactItem>
          <ContactIcon>✉️</ContactIcon>
          order@bellaflowers.ru
        </ContactItem>
        <ContactItem>
          <ContactIcon>📱</ContactIcon>
          Telegram: @bellaflowers
        </ContactItem>
      </ContactInfo>
    </AboutContainer>
    <AboutImg src={about} alt=""  className=' size-1/2'/>
    </div>
  );
};