import { useCallback } from "react"
import { Modal } from "../../../../shared/ui/modal/Modal"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import {
	closeAuthModal,
	openLoginModal,
	openRegisterModal,
} from "../../../../store/slices/modal.slice"
import { EmailAuthForm } from "../EmailAuthForm/EmailAuthForm"

export const AuthModal = () => {
	const dispatch = useAppDispatch()
	const { isOpen, authType } = useAppSelector(state => state.modal)
	const isLoginMode = authType === "login"

	const handleClose = useCallback(() => {
		dispatch(closeAuthModal())
	}, [dispatch])

	const handleSwitchAuthType = useCallback(() => {
		dispatch(isLoginMode ? openRegisterModal() : openLoginModal())
	}, [dispatch, isLoginMode])

	if (!isOpen) return null

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<EmailAuthForm isLogin={isLoginMode} onSwitch={handleSwitchAuthType} />
		</Modal>
	)
}
