import { FC } from "react"
import { API_ENDPOINT } from "../../axios"
import { useAppSelector } from "../../store/hooks"
import {
	CategoriesContainer,
	CategoriesGrid,
	CategoriesTitle,
	CategoryCard,
	CategoryContent,
	CategoryImage,
	CategoryName,
	ViewButtonWithIcon,
} from "./Main.styles"

export const MainPage: FC = () => {
	const Category = useAppSelector(state => state.category.Category)
	const IsLoading = useAppSelector(state => state.category.IsLoading)

	return (
		<CategoriesContainer>
			<CategoriesTitle>Категории товаров</CategoriesTitle>
			<CategoriesGrid>
				{!IsLoading &&
					Category?.length > 0 &&
					Category.map(Category => (
						<CategoryCard key={Category.ID}>
							<CategoryImage
								src={`${API_ENDPOINT}/api/image/${Category.ImageID}`}
							/>
							<CategoryContent>
								<CategoryName>{Category.Name}</CategoryName>
								<ViewButtonWithIcon to={`/catalog`}>
									СМОТРЕТЬ
								</ViewButtonWithIcon>
							</CategoryContent>
						</CategoryCard>
					))}
			</CategoriesGrid>
		</CategoriesContainer>
	)
}
