import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API } from "../../axios"
import { TOrder, TResponse, TUser } from "../../types"

export const getAllOrders = createAsyncThunk("admin/getOrders", async () => {
	return (await API.get("/api/admin/order").then(
		res => res.data,
		res => res.response?.data
	)) as TResponse<TOrder[]>
})

export const getAllUsers = createAsyncThunk("admin/getUsers", async () => {
	return (await API.get("/api/admin/users").then(
		res => res.data,
		res => res.response?.data
	)) as TResponse<TUser[]>
})

type State = {
	Orders: TOrder[]
	OrdersIsLoading: boolean
	OrdersIsLoaded: boolean
	Users: TUser[]
	UsersIsLoading: boolean
	UsersIsLoaded: boolean
	Error: string
}

const initState: State = {
	Orders: [] as TOrder[],
	OrdersIsLoading: false,
	OrdersIsLoaded: false,
	Users: [] as TUser[],
	UsersIsLoading: false,
	UsersIsLoaded: false,
	Error: "",
}

const adminSlice = createSlice({
	name: "admin",
	initialState: initState,
	reducers: {
		// setUser: (state, payload: PayloadAction<TUser>) => {
		// 	state.Orders = payload.payload
		// 	state.OrdersIsLoaded = true
		// 	state.Error = ""
		// },
	},
	extraReducers: req => {
		req.addCase(getAllOrders.pending, state => {
			state.OrdersIsLoading = true
		})
		req.addCase(getAllOrders.fulfilled, (state, payload) => {
			const type = payload.payload.Type

			if (type) {
				state.Orders = payload.payload.Message
			} else {
				state.Error = payload.payload.Error
			}

			state.OrdersIsLoading = false
			state.OrdersIsLoaded = true
		})

		req.addCase(getAllUsers.pending, state => {
			state.UsersIsLoading = true
		})
		req.addCase(getAllUsers.fulfilled, (state, payload) => {
			const type = payload.payload.Type

			if (type) {
				state.Users = payload.payload.Message
			} else {
				state.Error = payload.payload.Error
			}

			state.UsersIsLoading = false
			state.UsersIsLoaded = true
		})
	},
})

export const adminReducer = adminSlice.reducer
export const {} = adminSlice.actions
