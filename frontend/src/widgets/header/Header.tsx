import { FC, useState } from "react"
import { RiMenu2Fill } from "react-icons/ri"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { AuthButton } from "../../features/auth/ui/AuthButton/AuthButton"
import { AuthModal } from "../../features/auth/ui/AuthModal/AuthModal"
import Cart from "../../pages/Cart/Cart"
import { useAppSelector } from "../../store/hooks"
import {
	ActionsContainer,
	DesktopLogo,
	Divider,
	DropdownItem,
	DropdownMenu,
	HeaderContainer,
	Logo,
	LogoImage,
	MainHeader,
	MobileHidden,
	MobileLogo,
	NavButton,
	TopBar,
	TopBarLeft,
	TopBarRight,
} from "./Header.styles"

export const Header: FC = () => {
	const navigate = useNavigate()

	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const User = useAppSelector(state => state.auth.User)
	const Order = useAppSelector(state => state.order.Order)
	const IsLoading = useAppSelector(state => state.auth.IsLoading)

	return (
		<HeaderContainer>
			<TopBar>
				<MobileLogo>
					<LogoImage src={logo} alt="BellaFlowers logo" />
					<Logo>BellaFlowers</Logo>
				</MobileLogo>

				<TopBarLeft />

				<TopBarRight>
					<p>Ленинградский просп., 13, стр. 1</p>
					<Divider>/</Divider>
					<p>+7 (925) 544-59-69</p>
				</TopBarRight>
			</TopBar>

			<MainHeader>
				<NavButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<RiMenu2Fill size={20} />
					<MobileHidden>Меню</MobileHidden>
				</NavButton>

				<DesktopLogo onClick={() => navigate("/")}>
					<LogoImage src={logo} alt="BellaFlowers logo" />
					<Logo>Bella Flowers</Logo>
				</DesktopLogo>

				<ActionsContainer>
					{!IsLoading &&
						User?.Token &&
						Order &&
						Order.ProductOrders?.length > 0 && <Cart />}
					<AuthButton />
				</ActionsContainer>

				<DropdownMenu $isOpen={isMenuOpen}>
					<DropdownItem onClick={() => setIsMenuOpen(false)}>
						<Link to={"/"}>Главная</Link>
					</DropdownItem>
					<DropdownItem onClick={() => setIsMenuOpen(false)}>
						<Link to={"/catalog"}>Каталог</Link>
					</DropdownItem>
					<DropdownItem href="/about" onClick={() => setIsMenuOpen(false)}>
						О нас / Контакты
					</DropdownItem>
				</DropdownMenu>
			</MainHeader>

			<AuthModal />
		</HeaderContainer>
	)
}
