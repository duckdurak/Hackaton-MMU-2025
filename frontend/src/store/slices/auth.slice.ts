import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { API } from "../../axios"
import { TResponse, TUser } from "../../types"

export const getAuth = createAsyncThunk("auth/getUser", async () => {
	return (await API.get("/api/auth").then(
		res => res.data,
		res => res.response?.data
	)) as TResponse<{ User: TUser; Token: string }>
})

type State = {
	User: TUser
	IsLoading: boolean
	IsLoaded: boolean
	Error: string
}

const initState: State = {
	User: {} as TUser,
	IsLoading: false,
	IsLoaded: false,
	Error: "",
}

const authSlice = createSlice({
	name: "auth",
	initialState: initState,
	reducers: {
		setUser: (state, payload: PayloadAction<TUser>) => {
			state.User = payload.payload
			state.IsLoaded = true
			state.Error = ""
		},
	},
	extraReducers: req => {
		req.addCase(getAuth.pending, state => {
			state.IsLoading = true
		})
		req.addCase(getAuth.fulfilled, (state, payload) => {
			console.log(payload.payload)
			const type = payload.payload.Type

			if (type) {
				state.User = payload.payload.Message.User
				state.User.Token = payload.payload.Message.Token
			} else {
				state.Error = payload.payload.Error
			}

			state.IsLoading = false
			state.IsLoaded = true
		})
	},
})

export const authReducer = authSlice.reducer
export const { setUser } = authSlice.actions
