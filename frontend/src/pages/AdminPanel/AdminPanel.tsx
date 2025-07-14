import { FC, JSX, useEffect, useState } from "react"
import { BiExit } from "react-icons/bi"
import {
	FiDollarSign,
	FiMenu,
	FiPackage,
	FiPieChart,
	FiUsers,
	FiX,
} from "react-icons/fi"
import styled from "styled-components"
import { API } from "../../axios"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { getAllOrders, getAllUsers } from "../../store/slices/admin.slice"
import { getProducts, removeProductById } from "../../store/slices/product"
import { TResponse } from "../../types"
import { CreateCategoryModal } from "./CreateCategoryModal"
import { CreateProductModal } from "./CreateProductModal"

const AdminPanel: FC = () => {
	const dispatch = useAppDispatch()

	const [activeTab, setActiveTab] = useState<string>("dashboard")
	const [sidebarOpen, _] = useState<boolean>(true)
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
	const [isProductModalOpen, setIsProductModalOpen] = useState(false)
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

	const Category = useAppSelector(state => state.category.Category)
	const Products = useAppSelector(state => state.product.Product)
	const ProductsIsLoading = useAppSelector(state => state.product.IsLoading)
	const Orders = useAppSelector(state => state.admin.Orders)
	const OrdersIsLoading = useAppSelector(state => state.admin.OrdersIsLoading)
	const Users = useAppSelector(state => state.admin.Users)
	const UsersIsLoading = useAppSelector(state => state.admin.UsersIsLoading)

	useEffect(() => {
		switch (activeTab) {
			case "products":
				dispatch(getProducts())
				break
			case "orders":
				dispatch(getAllOrders())
				break
			case "users":
				dispatch(getAllUsers())
				break
		}
	}, [activeTab, dispatch])

	const handleDeleteProduct = async (ProductID: number) => {
		if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
			const json = (await API.delete("/api/product/" + ProductID).then(
				res => res.data,
				res => res.response?.data
			)) as TResponse<string>

			if (json.Type) {
				dispatch(removeProductById(ProductID))
			}
		}
	}
	const renderTabContent = (): JSX.Element => {
		switch (activeTab) {
			case "users":
				return (
					<TableContainer>
						<h2>Пользователи</h2>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Имя</th>
									<th>Email</th>
									<th>Роль</th>
								</tr>
							</thead>
							<tbody>
								{!UsersIsLoading &&
									Users.map((User, index) => (
										<tr key={User.ID}>
											<td>{index + 1}</td>
											<td>
												{User.FirstName} {User.LastName}
											</td>
											<td>{User.Email}</td>
											<td>
												<RoleBadge role={User.Role === 2 ? "admin" : "user"}>
													{User.Role === 2 ? "Администратор" : "Пользователь"}
												</RoleBadge>
											</td>
										</tr>
									))}
							</tbody>
						</Table>
					</TableContainer>
				)
			case "products":
				return (
					<TableContainer>
						<TableHeader>
							<h2>Товары</h2>
							<ButtonGroup>
								<AddButton onClick={() => setIsCategoryModalOpen(true)}>
									Добавить категорию
								</AddButton>
								<AddButton onClick={() => setIsProductModalOpen(true)}>
									Добавить товар
								</AddButton>
							</ButtonGroup>
						</TableHeader>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Название</th>
									<th>Категория</th>
									<th>Цена</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{!ProductsIsLoading &&
									Products.map((Product, index) => (
										<tr key={Product.ID}>
											<td>{index + 1}</td>
											<td>{Product.Name}</td>
											<td>{Product.Category.Name}</td>
											<td>{Product.Price.toLocaleString()} ₽</td>
											<td>
												<ActionButton>Изменить</ActionButton>
												<ActionButton
													danger
													onClick={() => handleDeleteProduct(Product.ID)}
												>
													Удалить
												</ActionButton>
											</td>
										</tr>
									))}
							</tbody>
						</Table>
					</TableContainer>
				)
			case "orders":
				return (
					<TableContainer>
						<h2>Заказы</h2>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Клиент</th>
									<th>Дата</th>
									<th>Сумма</th>
									<th>Статус</th>
									{/* <th>Действия</th> */}
								</tr>
							</thead>
							<tbody>
								{!OrdersIsLoading &&
									Orders.map((Order, index) => (
										<tr key={Order.ID}>
											<td>{index + 1}</td>
											<td>
												{Order.Buyer.FirstName} {Order.Buyer.LastName}
											</td>
											<td>{new Date(Order.CreatedAt).toLocaleDateString()}</td>
											<td>{3000} ₽</td>
											<td>
												<StatusBadge
													status={Order.Finished ? "completed" : "pending"}
												>
													{Order.Finished ? "Завершен" : "В обработке"}
												</StatusBadge>
											</td>
											{/* <td>
												<ActionButton>Подробнее</ActionButton>
												{order.status === "pending" && (
													<ActionButton>Изменить статус</ActionButton>
												)}
											</td> */}
										</tr>
									))}
							</tbody>
						</Table>
					</TableContainer>
				)
			case "dashboard":
			default:
				return (
					<DashboardContainer>
						<h2>Статистика</h2>
						<StatsGrid>
							<StatCard>
								<StatValue>10000 ₽</StatValue>
								<StatLabel>Общий доход</StatLabel>
							</StatCard>
							<StatCard>
								<StatValue>13</StatValue>
								<StatLabel>Всего клиентов</StatLabel>
							</StatCard>
							<StatCard>
								<StatValue>1</StatValue>
								<StatLabel>Всего товаров</StatLabel>
							</StatCard>
						</StatsGrid>

						<ChartsContainer>
							<ChartSection>
								<h3>Продажи за месяц</h3>
								<ChartPlaceholder />
							</ChartSection>
							<ChartSection>
								<h3>Популярные категории</h3>
								<ChartPlaceholder />
							</ChartSection>
						</ChartsContainer>
					</DashboardContainer>
				)
		}
	}

	return (
		<AdminContainer>
			<CreateProductModal
				isOpen={isProductModalOpen}
				onClose={() => setIsProductModalOpen(false)}
				categories={Category}
			/>
			<CreateCategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => setIsCategoryModalOpen(false)}
			/>

			<MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
				{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
			</MobileMenuButton>

			{/* Боковая панель */}
			<Sidebar $open={sidebarOpen} $mobileOpen={mobileMenuOpen}>
				<SidebarHeader>
					<h2>Управление</h2>
					<ToggleButton>
						<Exit href="/">
							<BiExit size={20} />
						</Exit>
					</ToggleButton>
				</SidebarHeader>

				<NavMenu>
					<NavItem
						active={activeTab === "dashboard"}
						onClick={() => {
							setActiveTab("dashboard")
							setMobileMenuOpen(false)
						}}
					>
						<FiPieChart />
						<span>Статистика</span>
					</NavItem>
					<NavItem
						active={activeTab === "orders"}
						onClick={() => {
							setActiveTab("orders")
							setMobileMenuOpen(false)
						}}
					>
						<FiPackage />
						<span>Заказы</span>
					</NavItem>
					<NavItem
						active={activeTab === "products"}
						onClick={() => {
							setActiveTab("products")
							setMobileMenuOpen(false)
						}}
					>
						<FiDollarSign />
						<span>Товары</span>
					</NavItem>
					<NavItem
						active={activeTab === "users"}
						onClick={() => {
							setActiveTab("users")
							setMobileMenuOpen(false)
						}}
					>
						<FiUsers />
						<span>Пользователи</span>
					</NavItem>
				</NavMenu>
			</Sidebar>

			{/* Основное содержимое */}
			<MainContent $sidebarOpen={sidebarOpen}>
				<ContentHeader>
					<h1>{getTabTitle(activeTab)}</h1>
					<UserProfile>
						<span>Администратор</span>
						<UserAvatar>A</UserAvatar>
					</UserProfile>
				</ContentHeader>

				{renderTabContent()}
			</MainContent>
		</AdminContainer>
	)
}

// Вспомогательные функции
const getTabTitle = (tab: string): string => {
	switch (tab) {
		case "dashboard":
			return "Дашборд"
		case "orders":
			return "Управление заказами"
		case "products":
			return "Управление товарами"
		case "users":
			return "Управление пользователями"
		case "settings":
			return "Настройки системы"
		default:
			return "Админ-панель"
	}
}

// Стилизованные компоненты
type SidebarProps = {
	$open: boolean
	$mobileOpen: boolean
}

type MainContentProps = {
	$sidebarOpen: boolean
}

type NavItemProps = {
	active: boolean
}

type RoleBadgeProps = {
	role: string
}

type StatusBadgeProps = {
	status: "completed" | "pending"
}

type ActionButtonProps = {
	danger?: boolean
}

const Exit = styled.a`
	display: block;
	padding: 10px 24px;
	color: white;
	text-decoration: none;
	transition: background 0.2s;

	&:hover {
		color: #8a4baf;
	}

	@media (max-width: 768px) {
		padding: 10px 16px;
	}
`

const AdminContainer = styled.div`
	display: flex;
	min-height: 100vh;
	background-color: #f5f7fa;
`

const MobileMenuButton = styled.button`
	position: fixed;
	top: 20px;
	left: 20px;
	z-index: 1100;
	background: #8a4baf;
	color: white;
	border: none;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	@media (min-width: 992px) {
		display: none;
	}
`

const Sidebar = styled.div<SidebarProps>`
	width: ${props => (props.$open ? "250px" : "80px")};
	background: #2c3e50;
	color: white;
	transition: width 0.3s ease;
	position: fixed;
	height: 100vh;
	z-index: 1000;
	overflow: hidden;

	@media (max-width: 991px) {
		transform: ${props =>
			props.$mobileOpen ? "translateX(0)" : "translateX(-100%)"};
		width: 250px;
		transition: transform 0.3s ease;
	}
`

const SidebarHeader = styled.div`
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);

	h2 {
		margin: 0;
		white-space: nowrap;
	}
`

const ToggleButton = styled.button`
	background: none;
	border: none;
	color: white;
	cursor: pointer;
`

const NavMenu = styled.nav`
	padding: 20px 0;
`

const NavItem = styled.div<NavItemProps>`
	display: flex;
	align-items: center;
	padding: 12px 20px;
	cursor: pointer;
	background: ${props =>
		props.active ? "rgba(255, 255, 255, 0.1)" : "transparent"};
	color: ${props => (props.active ? "#fff" : "rgba(255, 255, 255, 0.7)")};
	transition: all 0.3s ease;

	svg {
		margin-right: 15px;
		flex-shrink: 0;
	}

	span {
		white-space: nowrap;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}
`

const MainContent = styled.main<MainContentProps>`
	flex: 1;
	margin-left: ${props => (props.$sidebarOpen ? "250px" : "80px")};
	transition: margin-left 0.3s ease;

	@media (max-width: 991px) {
		margin-left: 0;
	}
`

const ContentHeader = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	background: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	h1 {
		margin: 0;
		font-size: 1.5rem;
	}
`

const UserProfile = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`

const UserAvatar = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: #8a4baf;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
`

const DashboardContainer = styled.div`
	padding: 20px;
`

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 20px;
	margin-bottom: 30px;
`

const StatCard = styled.div`
	background: white;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`

const StatValue = styled.div`
	font-size: 2rem;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 5px;
`

const StatLabel = styled.div`
	color: #7f8c8d;
	font-size: 0.9rem;
`

const ChartsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 1fr;
	}
`

const ChartSection = styled.div`
	background: white;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	h3 {
		margin-top: 0;
		margin-bottom: 20px;
	}
`

const ChartPlaceholder = styled.div`
	height: 300px;
	background: #f5f7fa;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #7f8c8d;
`

const TableContainer = styled.div`
	padding: 20px;

	h2 {
		margin-top: 0;
	}
`

const TableHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
`

const ButtonGroup = styled.div`
	display: flex;

	button + button {
		margin-left: 10px;
	}
`

const AddButton = styled.button`
	background: #8a4baf;
	color: white;
	border: none;
	padding: 10px 15px;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background: #7d3a98;
	}
`

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	background: white;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	th,
	td {
		padding: 12px 15px;
		text-align: left;
		border-bottom: 1px solid #f0f0f0;
	}

	th {
		background: #f5f7fa;
		font-weight: 500;
		color: #2c3e50;
	}

	tr:hover {
		background: #f9f9f9;
	}
`

const RoleBadge = styled.span<RoleBadgeProps>`
	display: inline-block;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 0.8rem;
	font-weight: 500;
	background: ${props => (props.role === "admin" ? "#e3f2fd" : "#e8f5e9")};
	color: ${props => (props.role === "admin" ? "#1976d2" : "#388e3c")};
`

const StatusBadge = styled.span<StatusBadgeProps>`
	display: inline-block;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 0.8rem;
	font-weight: 500;
	background: ${props =>
		props.status === "completed" ? "#e8f5e9" : "#fff8e1"};
	color: ${props => (props.status === "completed" ? "#388e3c" : "#ff8f00")};
`

const ActionButton = styled.button<ActionButtonProps>`
	padding: 6px 12px;
	margin-right: 8px;
	border: 1px solid ${props => (props.danger ? "#f44336" : "#ddd")};
	border-radius: 4px;
	background: white;
	color: ${props => (props.danger ? "#f44336" : "#333")};
	cursor: pointer;
	font-size: 0.8rem;

	&:hover {
		background: ${props => (props.danger ? "#ffebee" : "#f5f5f5")};
	}
`

export default AdminPanel
