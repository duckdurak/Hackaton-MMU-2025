import { type FC, Fragment, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../store/hooks"

type Props = {
	children: ReactNode
	admin?: boolean
}

export const ProtectedPage: FC<Props> = ({ children, admin }) => {
	const navigate = useNavigate()

	const { User, IsLoaded, IsLoading } = useAppSelector(state => state.auth)

	const token = window.localStorage.getItem("token")

	if (!token) {
		navigate("/")
	}

	if (IsLoading || !IsLoaded) {
		return <></>
	}

	if (admin && User.Role == 1) {
		navigate("/")
	}

	return <Fragment>{children}</Fragment>
}
