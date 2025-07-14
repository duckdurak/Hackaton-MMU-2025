import { createSlice } from "@reduxjs/toolkit"

interface State {
	isOpen: boolean
	authType: "login" | "register"
}

const initState: State = {
	isOpen: false,
	authType: "login",
}

const modalSlice = createSlice({
	name: "modal",
	initialState: initState,
	reducers: {
		openLoginModal(state) {
			state.isOpen = true
			state.authType = "login"
		},
		openRegisterModal(state) {
			state.isOpen = true
			state.authType = "register"
		},
		closeAuthModal(state) {
			state.isOpen = false
		},
	},
})

export const modalReducer = modalSlice.reducer
export const { openLoginModal, openRegisterModal, closeAuthModal } =
	modalSlice.actions
