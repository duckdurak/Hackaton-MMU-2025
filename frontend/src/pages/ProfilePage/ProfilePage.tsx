import { FC, Fragment, JSX, useEffect, useState } from "react"
import { FiMapPin, FiSettings, FiShoppingBag, FiUser } from "react-icons/fi"
import styled from "styled-components"
import { Button } from "../../features/auth/ui/AuthButton/AuthButton.styles"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { getOrders } from "../../store/slices/order"

type OrderStatus = "completed" | "pending"

type TabItemProps = {
	active: boolean
}

type OrderStatusProps = {
	status: OrderStatus
}

type ActionButtonProps = {
	danger?: boolean
}

const ProfilePage: FC = () => {
	const dispatch = useAppDispatch()

	const [activeTab, setActiveTab] = useState<string>("orders")

	const User = useAppSelector(state => state.auth.User)
	const Orders = useAppSelector(state => state.order.Orders)
	const OrdersIsLoading = useAppSelector(state => state.order.OrdersIsLoading)

	useEffect(() => {
		dispatch(getOrders())
	}, [])

	const renderTabContent = (): JSX.Element | null => {
		switch (activeTab) {
			case "orders":
				return (
					<OrdersTab>
						<h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
							История заказов
						</h3>
						{!OrdersIsLoading &&
							Orders?.map((Order, index) => {
								const sum = Order.ProductOrders.reduce(
									(sum, item) => sum + item.Product.Price * item.Quantity,
									0
								)
								return (
									<OrderCard key={Order.ID}>
										<OrderHeader>
											<span>Заказ №{index + 1}</span>
											<OrderStatus
												status={Order.Finished ? "completed" : "pending"}
											>
												{Order.Finished ? "Доставлен" : "В обработке"}
											</OrderStatus>
										</OrderHeader>
										<OrderDate>
											{new Date(Order.CreatedAt).toLocaleDateString()}
										</OrderDate>
										<OrderItems>
											{Order.ProductOrders.map(item => (
												<div key={item.ID}>{item.Product.Name}</div>
											))}
										</OrderItems>
										<OrderSum>
											Стоимость заказа: {sum.toLocaleString()} ₽
										</OrderSum>
									</OrderCard>
								)
							})}
					</OrdersTab>
				)
			case "data":
				return (
					<Fragment>
						<DataTab>
							<h3 style={{ fontWeight: 800 }}>Личные данные</h3>
							<FormGroup>
								<label>Имя</label>
								<Input type="text" disabled defaultValue={User.FirstName} />
							</FormGroup>
							<FormGroup>
								<label>Фамилия</label>
								<Input type="text" disabled defaultValue={User.LastName} />
							</FormGroup>
							<FormGroup>
								<label>Email</label>
								<Input type="email" disabled defaultValue={User.Email} />
							</FormGroup>
						</DataTab>
						<DataTab>
							<h3 style={{ fontWeight: 800 }}>Уведомления в Telegram</h3>
							<FormGroup>
								{User.TelegramID ? (
									"Подключены!"
								) : (
									<Button
										type="button"
										style={{ backgroundColor: "#24A1DE", color: "white" }}
									>
										<a
											href={`https://t.me/bellaflowers_bot?start=${User.ID}`}
											target="_blank"
										>
											Привязать
										</a>
									</Button>
								)}
							</FormGroup>
						</DataTab>
						<DataTab>
							<h3 style={{ fontWeight: 800 }}>Изменение пароля</h3>
							<FormGroup>
								<label>Текущий пароль</label>
								<Input type="password" />
							</FormGroup>
							<FormGroup>
								<label>Новый пароль</label>
								<Input type="password" />
							</FormGroup>
							<FormGroup>
								<label>Проверка пароля</label>
								<Input type="password" />
							</FormGroup>
							<SaveButton>Сохранить изменения</SaveButton>
						</DataTab>
					</Fragment>
				)
			case "addresses":
				return (
					<AddressesTab>
						<h3 style={{ fontWeight: 800 }}>Мои адреса</h3>
						<AddressCard>
							{/* <AddressText>{userData.address}</AddressText> */}
							<AddressActions>
								<ActionButton>Изменить</ActionButton>
								<ActionButton danger>Удалить</ActionButton>
							</AddressActions>
						</AddressCard>
						<AddAddressButton>+ Добавить новый адрес</AddAddressButton>
					</AddressesTab>
				)
			default:
				return null
		}
	}

	return (
		<ProfileContainer>
			<ProfileHeader>
				<UserAvatar>
					<FiUser size={48} />
				</UserAvatar>
				<UserName>
					{User.FirstName} {User.LastName}
				</UserName>
				<UserEmail>{User.Email}</UserEmail>
			</ProfileHeader>

			<TabsContainer>
				<TabMenu>
					<TabItem
						active={activeTab === "orders"}
						onClick={() => setActiveTab("orders")}
					>
						<FiShoppingBag />
						<span>Мои заказы</span>
					</TabItem>
					<TabItem
						active={activeTab === "data"}
						onClick={() => setActiveTab("data")}
					>
						<FiSettings />
						<span>Мои данные</span>
					</TabItem>
					<TabItem
						active={activeTab === "addresses"}
						onClick={() => setActiveTab("addresses")}
					>
						<FiMapPin />
						<span>Адреса доставки</span>
					</TabItem>
				</TabMenu>

				<TabContent>{renderTabContent()}</TabContent>
			</TabsContainer>
		</ProfileContainer>
	)
}

// Стили с типами
const ProfileContainer = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
`

const ProfileHeader = styled.div`
	text-align: center;
	margin-bottom: 30px;
`

const UserAvatar = styled.div`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 15px;
	color: #8a4baf;
`

const UserName = styled.h2`
	margin: 0 0 5px;
	font-size: 1.5rem;
`

const UserEmail = styled.p`
	color: #666;
	margin: 0;
`

const TabsContainer = styled.div`
	display: flex;
	flex-direction: column;

	@media (min-width: 768px) {
		flex-direction: row;
	}
`

const TabMenu = styled.div`
	display: flex;
	flex-direction: row;
	overflow-x: auto;
	padding-bottom: 10px;
	margin-bottom: 20px;

	@media (min-width: 768px) {
		flex-direction: column;
		width: 250px;
		padding-right: 20px;
		overflow-x: visible;
	}
`

const TabItem = styled.div<TabItemProps>`
	display: flex;
	align-items: center;
	padding: 12px 15px;
	margin-right: 10px;
	border-radius: 8px;
	cursor: pointer;
	white-space: nowrap;
	background: ${props => (props.active ? "#f0e6f6" : "transparent")};
	color: ${props => (props.active ? "#8a4baf" : "#333")};
	font-weight: ${props => (props.active ? "600" : "400")};

	svg {
		margin-right: 10px;
	}

	@media (min-width: 768px) {
		margin-right: 0;
		margin-bottom: 5px;
	}

	&:hover {
		background: #f5f5f5;
	}
`

const TabContent = styled.div`
	flex: 1;
`

const OrdersTab = styled.div`
	h3 {
		margin-top: 0;
	}
`

const OrderCard = styled.div`
	border: 1px solid #eee;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 15px;
`

const OrderHeader = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 5px;
`

const OrderStatus = styled.span<OrderStatusProps>`
	color: ${props => (props.status === "completed" ? "#4caf50" : "#ff9800")};
	font-weight: 500;
`

const OrderDate = styled.div`
	color: #666;
	font-size: 0.9rem;
	margin-bottom: 10px;
`

const OrderItems = styled.div`
	margin-bottom: 10px;
	color: #555;
`

const OrderSum = styled.div`
	font-weight: 600;
	color: #8a4baf;
`

const DataTab = styled.form`
	h3 {
		margin-top: 0;
	}
`

const FormGroup = styled.div`
	margin-bottom: 15px;

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
	}
`

const Input = styled.input`
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;
`

const SaveButton = styled.button`
	background: #8a4baf;
	color: white;
	border: none;
	padding: 12px 20px;
	border-radius: 4px;
	font-weight: 600;
	cursor: pointer;
	margin-top: 10px;

	&:hover {
		background: #7d3a98;
	}
`

const AddressesTab = styled.div`
	h3 {
		margin-top: 0;
	}
`

const AddressCard = styled.div`
	border: 1px solid #eee;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 15px;
`

const AddressActions = styled.div`
	display: flex;
	gap: 10px;
`

const ActionButton = styled.button<ActionButtonProps>`
	padding: 8px 12px;
	border: 1px solid ${props => (props.danger ? "#f44336" : "#ddd")};
	border-radius: 4px;
	background: white;
	color: ${props => (props.danger ? "#f44336" : "#333")};
	cursor: pointer;

	&:hover {
		background: ${props => (props.danger ? "#ffebee" : "#f5f5f5")};
	}
`

const AddAddressButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 12px;
	border: 2px dashed #ddd;
	border-radius: 8px;
	background: white;
	color: #666;
	cursor: pointer;
	font-size: 1rem;

	&:hover {
		border-color: #8a4baf;
		color: #8a4baf;
	}
`

export default ProfilePage
