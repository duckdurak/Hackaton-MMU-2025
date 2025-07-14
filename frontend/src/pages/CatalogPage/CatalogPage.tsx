import { useEffect, useState } from "react"
import styled from "styled-components"
import { API, API_ENDPOINT } from "../../axios"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { openLoginModal } from "../../store/slices/modal.slice"
import { setCart } from "../../store/slices/order"
import { getProducts } from "../../store/slices/product"
import { TOrder, TResponse } from "../../types"
import FilterComponent from "../../widgets/filter/FilterComponent"

const CatalogPage = () => {
	const dispatch = useAppDispatch()
	// const { products, categories, loading, error } = useAppSelector(
	// 	state => state.product
	// )
	const [priceSort, setPriceSort] = useState<"asc" | "desc">("desc")

	const User = useAppSelector(state => state.auth.User)
	const Products = useAppSelector(state => state.product.Product)
	const IsLoading = useAppSelector(state => state.product.IsLoading)

	useEffect(() => {
		dispatch(getProducts())
	}, [dispatch])

	const addToCart = async (ProductID: number) => {
		const values = { product_id: ProductID, quantity: 1 }
		const json = (await API.post("/api/order/add", values).then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<TOrder>

		if (json.Type) {
			dispatch(setCart(json.Message.ProductOrders))
		}
	}

	return (
		<CatalogContainer>
			<CatalogHeader>
				<h1>Каталог цветов</h1>
				<CategoryScroll>
					{/* {categories.map(category => (
						<CategoryTag key={category.id}>{category.name}</CategoryTag>
					))} */}
				</CategoryScroll>
			</CatalogHeader>

			<CatalogToolbar>
				<FilterComponent />
				<SortButton
					onClick={() =>
						setPriceSort(prev => (prev === "asc" ? "desc" : "asc"))
					}
				>
					ЦЕНА {priceSort === "asc" ? "↑" : "↓"}
				</SortButton>
			</CatalogToolbar>

			<ProductGrid>
				{!IsLoading &&
					Products.map(Product => (
						<ProductCard key={Product.ID}>
							<ProductImage>
								{Product.Images[0] && (
									<img
										src={`${API_ENDPOINT}/api/image/${Product.Images[0].ID}`}
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								)}
							</ProductImage>
							<ProductInfo>
								<h3>{Product.Name}</h3>
								<p>{Product.Description}</p>
								<PriceContainer>
									<Price>{Product.Price.toLocaleString()} ₽</Price>
								</PriceContainer>
								<AddToCartButton
									onClick={() =>
										User?.Token
											? addToCart(Product.ID)
											: dispatch(openLoginModal())
									}
								>
									В корзину
								</AddToCartButton>
							</ProductInfo>
						</ProductCard>
					))}
			</ProductGrid>
		</CatalogContainer>
	)
}

// Стилизованные компоненты
const CatalogContainer = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
`

const CatalogHeader = styled.div`
	margin-bottom: 30px;

	h1 {
		font-size: 2rem;
		color: #333;
		margin-bottom: 20px;
		font-family: "Playfair Display", serif;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 1.5rem;
		}
	}
`

const CategoryScroll = styled.div`
	display: flex;
	overflow-x: auto;
	gap: 10px;
	padding-bottom: 10px;
	-webkit-overflow-scrolling: touch;

	&::-webkit-scrollbar {
		height: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: #8a4baf;
		border-radius: 2px;
	}
`

const CatalogToolbar = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	padding: 15px 0;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
`

const SortButton = styled.button`
	background: none;
	border: none;
	font-size: 1rem;
	cursor: pointer;
	color: #666;
`

const ProductGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 30px;

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
	}

	@media (max-width: 480px) {
		grid-template-columns: 1fr;
	}
`

const ProductCard = styled.div`
	background: white;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s, box-shadow 0.3s;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}
`

const ProductImage = styled.div`
	height: 250px;
	background: #f8f3ff;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	@media (max-width: 768px) {
		height: 180px;
	}
`

const ProductInfo = styled.div`
	padding: 20px;

	h3 {
		font-size: 1.1rem;
		margin-bottom: 8px;
		color: #333;
	}

	p {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 15px;
	}
`

const PriceContainer = styled.div`
	margin-bottom: 15px;
`

const Price = styled.span`
	font-size: 1.2rem;
	font-weight: bold;
	color: #8a4baf;
`

const AddToCartButton = styled.button`
	width: 100%;
	padding: 10px;
	background: #8a4baf;
	color: white;
	border: none;
	border-radius: 4px;
	font-weight: 500;
	cursor: pointer;
	transition: background 0.3s;

	&:hover {
		background: #7d3a98;
	}
`

export default CatalogPage
