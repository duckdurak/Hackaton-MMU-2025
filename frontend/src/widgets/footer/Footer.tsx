import { Link } from 'react-router-dom';
import { FaInstagram, FaVk, FaTelegram } from 'react-icons/fa';
import { FooterContainer,FooterContent,FooterSection,SocialLinks,Copyright } from './Footer.styles';



export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Магазин</h3>
          <ul>
            <li><Link to="/about">О нас</Link></li>
            <li><Link to="/catalog">Каталог</Link></li>
            <li><Link to="/reviews">Отзывы</Link></li>
            <li><Link to="/contacts">Контакты</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Помощь</h3>
          <ul>
            <li><Link to="/delivery">Доставка и оплата</Link></li>
            <li><Link to="/returns">Возврат и обмен</Link></li>
            <li><Link to="/faq">Вопросы и ответы</Link></li>
            <li><Link to="/wholesale">Оптовым покупателям</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Контакты</h3>
          <ul>
            <li>г. Москва, Ленинградский пр-т, 13с1</li>
            <li>+7 (925) 544-59-69</li>
            <li>order@bellaflowers.ru</li>
            <li>Ежедневно с 8:00 до 22:00</li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Мы в соцсетях</h3>
          <SocialLinks>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://vk.com" aria-label="VKontakte"><FaVk /></a>
            <a href="https://telegram.org" aria-label="Telegram"><FaTelegram /></a>
          </SocialLinks>
          <p>Подписывайтесь на новости и акции</p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} BellaFlowers. Все права защищены.
      </Copyright>
    </FooterContainer>
  );
};