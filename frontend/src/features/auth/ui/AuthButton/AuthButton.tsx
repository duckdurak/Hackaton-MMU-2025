import { CiUser } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import { openLoginModal } from "../../../../store/slices/modal.slice"
import { Button } from "./AuthButton.styles"

export const AuthButton = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { Role } = useAppSelector(state => state.auth.User)

	const handleClick = () => {
		if (Role) {
			Role == 1 ? navigate("/profile") : navigate("/admin")
		} else {
			dispatch(openLoginModal())
		}
	}

	return (
		<Button onClick={handleClick}>
			<CiUser size={25} />
		</Button>
	)
}
