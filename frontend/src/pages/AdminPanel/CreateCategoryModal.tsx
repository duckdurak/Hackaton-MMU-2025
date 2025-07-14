import { FC } from "react"
import { useForm } from "react-hook-form"
import { FiPlus, FiX } from "react-icons/fi"
import styled from "styled-components"
import { API } from "../../axios"
import { useAppDispatch } from "../../store/hooks"
import { addCategory } from "../../store/slices/category.slice"
import { TCategory, TResponse } from "../../types"

interface ProductModalProps {
	isOpen: boolean
	onClose: () => void
}

type TForm = {
	name: string
	image: FileList
}

export const CreateCategoryModal: FC<ProductModalProps> = ({
	isOpen,
	onClose,
}) => {
	const dispatch = useAppDispatch()
	const { register, handleSubmit } = useForm<TForm>()

	const onSubmit = async (values: TForm) => {
		const formData = new FormData()
		formData.append("name", values.name)
		formData.append("image", values.image[0])
		const json = (await API.post("/api/admin/category", formData).then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<TCategory>

		if (json.Type) {
			dispatch(addCategory(json.Message))
			onClose()
		}
	}

	if (!isOpen) return null

	return (
		<ModalOverlay>
			<ModalContainer onClick={e => e.stopPropagation()}>
				<ModalHeader>
					<h3>Добавить новую категорию</h3>
					<CloseButton onClick={onClose}>
						<FiX size={24} />
					</CloseButton>
				</ModalHeader>

				<ModalBody>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<FormGroup>
							<label>Название категории *</label>
							<FormInput type="text" required {...register("name")} />
						</FormGroup>
						<FormGroup>
							<label>Изображение категории</label>
							<ImageInputContainer>
								<FormInput {...register("image")} type="file" />
							</ImageInputContainer>
						</FormGroup>
						<FormActions>
							<CancelButton type="button" onClick={onClose}>
								Отмена
							</CancelButton>
							<SubmitButton>
								<FiPlus /> Создать категорию
							</SubmitButton>
						</FormActions>
					</Form>
				</ModalBody>
			</ModalContainer>
		</ModalOverlay>
	)
}

const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
`

const ModalContainer = styled.div`
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 600px;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`

const ModalHeader = styled.div`
	padding: 20px;
	border-bottom: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;

	h3 {
		margin: 0;
		font-size: 1.25rem;
	}
`

const CloseButton = styled.button`
	background: none;
	border: none;
	color: #666;
	cursor: pointer;
	padding: 5px;

	&:hover {
		color: #333;
	}
`

const ModalBody = styled.div`
	padding: 20px;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	label {
		font-weight: 500;
		color: #333;
	}
`
const FormInput = styled.input`
	padding: 10px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;

	&:focus {
		outline: none;
		border-color: #8a4baf;
	}
`

const ImageInputContainer = styled.div`
	display: flex;
	gap: 10px;
`

const FormActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 15px;
	padding-top: 20px;
	border-top: 1px solid #eee;
`

const CancelButton = styled.button`
	padding: 10px 20px;
	background: #f5f5f5;
	border: none;
	border-radius: 4px;
	color: #333;
	cursor: pointer;

	&:hover {
		background: #e0e0e0;
	}
`

const SubmitButton = styled.button`
	padding: 10px 20px;
	background: #8a4baf;
	border: none;
	border-radius: 4px;
	color: white;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;

	&:hover {
		background: #7d3a98;
	}
`
