import { Fragment, type FC } from "react"
import { useForm } from "react-hook-form"
import { API } from "../../../../axios"
import { useAppDispatch } from "../../../../store/hooks"
import { setUser } from "../../../../store/slices/auth.slice"
import { closeAuthModal } from "../../../../store/slices/modal.slice"
import { TResponse, TUser } from "../../../../types"
import type { EmailAuthFormProps } from "./EmailAuthForm.interface"
import {
	ButtonGroup,
	ErrorMessage,
	Form,
	FormContainer,
	Input,
	InputField,
	InputLabel,
	PrimaryButton,
	SwitchButton,
	Title,
} from "./EmailAuthForm.styles"

type TLogin = {
	email: string
	password: string
}

type TRegister = {
	first_name: string
	last_name: string
	email: string
	password: string
	repeat_password: string
}

export const EmailAuthForm: FC<EmailAuthFormProps> = ({
	isLogin,
	onSwitch,
	error,
	isLoading,
}) => {
	// const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const loginForm = useForm<TLogin>()
	const registerForm = useForm<TRegister>()

	const handleLoginSubmit = async (values: TLogin) => {
		const json = (await API.post("/api/auth/login", values).then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<{ User: TUser; Token: string }>

		if (json.Type === true) {
			window.localStorage.setItem("token", json.Message.Token)
			json.Message.User.Token = json.Message.Token

			dispatch(setUser(json.Message.User))
			dispatch(closeAuthModal())
			// alert(json.Message)
			// navigate("/profile")
		}
	}

	const handleRegisterSubmit = async (values: TRegister) => {
		console.log(values)
		const json = (await API.post("/api/auth/register", values).then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<string>

		if (json.Type === true) {
			dispatch(closeAuthModal())
			alert("Проверьте почту!")
		}
	}

	return (
		<FormContainer>
			<Form
				onSubmit={
					isLogin
						? loginForm.handleSubmit(handleLoginSubmit)
						: registerForm.handleSubmit(handleRegisterSubmit)
				}
			>
				<Title>{isLogin ? "Авторизация" : "Регистрация"}</Title>

				{error && <ErrorMessage>{error}</ErrorMessage>}

				{isLogin ? (
					<Fragment>
						<InputField>
							<InputLabel>E-mail*</InputLabel>
							<Input type="email" required {...loginForm.register("email")} />
							{/* {formErrors.email && (
								<ErrorMessage>{formErrors.email}</ErrorMessage>
							)} */}
						</InputField>

						<InputField>
							<InputLabel>Пароль*</InputLabel>
							<Input
								type="password"
								required
								{...loginForm.register("password")}
							/>
							{/* {formErrors.password && (
								<ErrorMessage>{formErrors.password}</ErrorMessage>
							)} */}
						</InputField>
					</Fragment>
				) : (
					<Fragment>
						<InputField>
							<InputLabel>Имя*</InputLabel>
							<Input
								type="text"
								required
								{...registerForm.register("first_name")}
							/>
							{/* {formErrors.firstName && (
								<ErrorMessage>{formErrors.firstName}</ErrorMessage>
							)} */}
						</InputField>
						<InputField>
							<InputLabel>Фамилия*</InputLabel>
							<Input
								type="text"
								required
								{...registerForm.register("last_name")}
							/>
							{/* {formErrors.lastName && (
								<ErrorMessage>{formErrors.lastName}</ErrorMessage>
							)} */}
						</InputField>
						<InputField>
							<InputLabel>E-mail*</InputLabel>
							<Input
								type="email"
								required
								{...registerForm.register("email")}
							/>
							{/* {formErrors.email && (
								<ErrorMessage>{formErrors.email}</ErrorMessage>
							)} */}
						</InputField>
						<InputField>
							<InputLabel>Пароль*</InputLabel>
							<Input
								type="password"
								required
								{...registerForm.register("password")}
							/>
							{/* {formErrors.password && (
								<ErrorMessage>{formErrors.password}</ErrorMessage>
							)} */}
						</InputField>
						<InputField>
							<InputLabel>Подтвердите пароль*</InputLabel>
							<Input
								type="password"
								required
								{...registerForm.register("repeat_password")}
							/>
							{/* {formErrors.confirmPassword && (
								<ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>
							)} */}
						</InputField>
					</Fragment>
				)}

				<ButtonGroup>
					<PrimaryButton type="submit" disabled={isLoading}>
						{isLoading
							? "Загрузка..."
							: isLogin
							? "Авторизоваться"
							: "Зарегистрироваться"}
					</PrimaryButton>

					<div>
						<SwitchButton type="button" onClick={onSwitch}>
							{isLogin
								? "Нет аккаунта? Зарегистрироваться"
								: "Уже есть аккаунт? Войти"}
						</SwitchButton>
					</div>
					{/* 
					{isLogin && (
						<TextButton type="button">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</TextButton>
					)} */}
				</ButtonGroup>
			</Form>
		</FormContainer>
	)
}
