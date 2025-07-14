import { Link } from "react-router-dom"
import styled from "styled-components"

export const CategoriesContainer = styled.section`
	padding: 40px 20px;
	max-width: 1200px;
	margin: 0 auto;
`

export const CategoriesTitle = styled.h2`
	font-size: 2rem;
	text-align: center;
	margin-bottom: 30px;
	color: #333;

	@media (max-width: 768px) {
		font-size: 1.5rem;
		margin-bottom: 20px;
	}
`

export const CategoriesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 20px;
	min-height: 400px;

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 480px) {
		grid-template-columns: 1fr;
	}
`

export const CategoryCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
	text-align: center;
	cursor: pointer;

	&:hover {
		transform: translateY(-5px);
	}
`

export const CategoryImage = styled.img`
	height: 200px;
	background-color: #f8f3ff;
s	background-size: cover;
	background-position: center;

	@media (max-width: 768px) {
		height: 150px;
	}
`

export const CategoryContent = styled.div`
	padding: 20px;
`

export const CategoryName = styled.h3`
	font-size: 1.2rem;
	margin-bottom: 15px;
	color: #333;
`

export const ViewButton = styled(Link)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 10px 24px;
	background: linear-gradient(135deg, #8a4baf 0%, #6a3b8a 100%);
	color: white;
	border-radius: 30px;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.95rem;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	box-shadow: 0 4px 15px rgba(138, 75, 175, 0.3);
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.2),
			transparent
		);
		transition: 0.5s;
	}

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(138, 75, 175, 0.4);

		&::before {
			left: 100%;
		}
	}

	&:active {
		transform: translateY(0);
		box-shadow: 0 3px 10px rgba(138, 75, 175, 0.3);
	}

	@media (max-width: 768px) {
		padding: 8px 20px;
		font-size: 0.85rem;
	}
`

export const ViewButtonWithIcon = styled(ViewButton)`
	&::after {
		content: "→";
		margin-left: 8px;
		transition: transform 0.3s;
	}

	&:hover::after {
		transform: translateX(3px);
	}
`
