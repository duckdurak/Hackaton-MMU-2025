import { useState } from "react"
import { FiTrash2, FiX } from "react-icons/fi"
import { LuShoppingBasket } from "react-icons/lu"
import styled from "styled-components"
import { API, API_ENDPOINT } from "../../axios"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { emptyOrder, setCart } from "../../store/slices/order"
import { TOrder, TResponse } from "../../types"

const Cart = () => {
	const dispatch = useAppDispatch()

	const [isOpen, setIsOpen] = useState(false)

	const Cart = useAppSelector(state => state.order.Order.ProductOrders)
	const IsLoading = useAppSelector(state => state.order.OrderIsLoading)
	const User = useAppSelector(state => state.auth.User)

	const taxRate = User.Discount / 100

	const total =
		Cart &&
		Cart.reduce((sum, item) => sum + item.Product.Price * item.Quantity, 0)
	const tax = total * taxRate

	const removeItem = async (ProductOrder: number) => {
		const json = (await API.delete("/api/order/" + ProductOrder).then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<TOrder>

		if (json.Type) {
			if (typeof json.Message === "object") {
				dispatch(setCart(json.Message.ProductOrders))
			} else {
				dispatch(setCart([]))
			}
		}
	}

	const sendOrder = async () => {
		const json = (await API.post("/api/order").then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<string>

		if (json.Type) {
			dispatch(emptyOrder())
		} else {
			alert(json.Error)
		}
	}

	return (
		!IsLoading && (
			<>
				<CartButton onClick={() => setIsOpen(true)}>
					<LuShoppingBasket size={22} />
					{Cart?.length > 0 && <CartBadge>{Cart?.length}</CartBadge>}
				</CartButton>

				{isOpen && (
					<CartOverlay>
						<CartContainer>
							<CartHeader>
								<h2>Ваш заказ</h2>
								<CloseButton onClick={() => setIsOpen(false)}>
									<FiX size={24} />
								</CloseButton>
							</CartHeader>

							<CartContent>
								{Cart?.map(item => (
									<CartItem key={item.ID}>
										<ItemImage
											src={`${API_ENDPOINT}/api/image/${
												item.Product.Images?.at(0)?.ID
											}`}
											alt={item.Product.Name}
										/>
										<ItemInfo>
											<ItemName>{item?.Product.Name}</ItemName>
											<ItemPrice>
												{item?.Product.Price.toLocaleString()} ₽
											</ItemPrice>
											<ItemControls>
												<Quantity>{item.Quantity}</Quantity>
												<RemoveButton onClick={() => removeItem(item.ID)}>
													<FiTrash2 size={16} />
												</RemoveButton>
											</ItemControls>
										</ItemInfo>
									</CartItem>
								))}

								<OrderSummary>
									<SummaryRow>
										<span>Скидка ({taxRate * 100}%)</span>
										<span>{tax.toLocaleString()} ₽</span>
									</SummaryRow>
									<Divider />
									<TotalRow>
										<span>Сумма заказа</span>
										<TotalPrice>
											<OriginalPrice>{total.toLocaleString()} ₽</OriginalPrice>
											<DiscountedPrice>
												{(total - tax).toLocaleString()} ₽
											</DiscountedPrice>
										</TotalPrice>
									</TotalRow>
								</OrderSummary>
							</CartContent>

							<CheckoutButton onClick={() => sendOrder()}>
								ОФОРМИТЬ ЗАКАЗ НА {(total - tax).toLocaleString()} ₽
							</CheckoutButton>
						</CartContainer>
					</CartOverlay>
				)}
			</>
		)
	)
}

const ItemImage = styled.img`
	width: 80px;
	height: 80px;
	object-fit: cover;
	border-radius: 8px;
	margin-right: 16px;
`

// Стилизованные компоненты
const CartButton = styled.button`
	position: relative;
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
`

const CartBadge = styled.span`
	position: absolute;
	top: -5px;
	right: -5px;
	background: #ff4081;
	color: white;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	font-size: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const CartOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: flex-end;
	z-index: 1000;
`

const CartContainer = styled.div`
	width: 100%;
	max-width: 400px;
	height: 100%;
	background: white;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
`

const CartHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #eee;
`

const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
`

const CartContent = styled.div`
	flex: 1;
	padding: 16px;
	overflow-y: auto;
`

const CartItem = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 12px 0;
	border-bottom: 1px solid #f5f5f5;
`

const ItemInfo = styled.div`
	flex: 1;
`

const ItemName = styled.div`
	font-weight: 500;
	margin-bottom: 4px;
`

const ItemPrice = styled.div`
	color: #8a4baf;
	font-weight: 600;
`

const ItemControls = styled.div`
	display: flex;
	align-items: center;
	text-align: center;
	gap: 8px;
`

const Quantity = styled.span`
	min-width: 20px;
	text-align: center;
`

const RemoveButton = styled.button`
	background: none;
	border: none;
	color: #999;
	cursor: pointer;
`

const OrderSummary = styled.div`
	margin-top: 20px;
	padding: 16px;
	background: #f9f9f9;
	border-radius: 8px;
`

const SummaryRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
	color: #666;
`

const TotalRow = styled(SummaryRow)`
	font-weight: 600;
	color: #333;
	margin-top: 12px;
`

const Divider = styled.hr`
	border: none;
	border-top: 1px solid #eee;
	margin: 12px 0;
`

const TotalPrice = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`

const OriginalPrice = styled.span`
	text-decoration: line-through;
	color: #999;
	font-size: 14px;
`

const DiscountedPrice = styled.span`
	color: #8a4baf;
	font-size: 18px;
`

const CheckoutButton = styled.button`
	margin: 16px;
	padding: 16px;
	background: #8a4baf;
	color: white;
	border: none;
	border-radius: 8px;
	font-weight: 600;
	font-size: 16px;
	cursor: pointer;
`

export default Cart
