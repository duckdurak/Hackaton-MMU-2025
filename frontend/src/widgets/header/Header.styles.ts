import styled from "styled-components"

const HeaderContainer = styled.header`
	background: white;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	position: relative;
	z-index: 100;
`

const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 24px;
	border-bottom: 1px solid #f0f0f0;
	font-size: 14px;
	color: #555;

	@media (max-width: 768px) {
		padding: 8px 16px;
	}
`

const NavButton = styled.button`
	background: none;
	border: none;
	color: #333;
	font-size: 14px;
	cursor: pointer;
	padding: 8px 12px;
	transition: color 0.2s;
	display: flex;
	align-items: center;
	gap: 4px;

	&:hover {
		color: #8a4baf;
	}

	@media (max-width: 768px) {
		padding: 6px 8px;
		font-size: 12px;
	}
`

const Divider = styled.span`
	color: #ddd;

	@media (max-width: 768px) {
		display: none;
	}
`

const MainHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 24px;

	@media (max-width: 768px) {
		padding: 12px 16px;
	}
`

const Logo = styled.h4`
	font-size: 24px;
	font-weight: 700;
	color: #8a4baf;
	margin: 0;

	@media (max-width: 768px) {
		font-size: 18px;
	}
`

const IconButton = styled.button`
	background: none;
	border: none;
	color: #333;
	font-size: 16px;
	cursor: pointer;
	padding: 8px;
	position: relative;
	transition: color 0.2s;

	&:hover {
		color: #8a4baf;
	}

	@media (max-width: 768px) {
		padding: 6px;
	}
`

const ActionsContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	width: full;
	@media (max-width: 480px) {
		gap: 6px;
	}
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
	position: absolute;
	top: 100%;
	left: 24px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	padding: 12px 0;
	min-width: 200px;
	display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
	z-index: 1000;

	@media (max-width: 768px) {
		left: 16px;
		right: 16px;
		width: auto;
	}
`

const DropdownItem = styled.a`
	display: block;
	padding: 10px 24px;
	color: #333;
	text-decoration: none;
	transition: background 0.2s;

	&:hover {
		background: #f9f9f9;
		color: #8a4baf;
	}

	@media (max-width: 768px) {
		padding: 10px 16px;
	}
`

const LogoImage = styled.img`
	width: 32px;
	height: 32px;
`

const TopBarLeft = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	width: full;
	@media (max-width: 768px) {
		display: none;
	}
`

const TopBarRight = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	@media (max-width: 768px) {
		display: none;
	}
`

const MobileLogo = styled.div`
	display: none;
	width: full;
	@media (max-width: 768px) {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-right: auto;
	}
`

const DesktopLogo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	width: full;
	cursor: pointer;
	@media (max-width: 768px) {
		display: none;
	}
`

const MobileHidden = styled.span`
	@media (max-width: 768px) {
		display: none;
	}
`

export {
	ActionsContainer,
	DesktopLogo,
	Divider,
	DropdownItem,
	DropdownMenu,
	HeaderContainer,
	IconButton,
	Logo,
	LogoImage,
	MainHeader,
	MobileHidden,
	MobileLogo,
	NavButton,
	TopBar,
	TopBarLeft,
	TopBarRight,
}
