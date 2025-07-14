import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { API } from "../../axios"
import { TCart, TOrder, TResponse } from "../../types"

export const getCart = createAsyncThunk("order/getOrder", async () => {
	return (await API.get("/api/order").then(
		res => res.data,
		res => res.response?.data
	)) as TResponse<TOrder>
})

export const getOrders = createAsyncThunk("order/getOrders", async () => {
	return (await API.get("/api/order?ordered=true").then(
		res => res.data,
		res => res.response?.data
	)) as TResponse<TOrder[]>
})

type State = {
	Order: TOrder
	OrderIsLoading: boolean
	OrderIsLoaded: boolean
	Orders: TOrder[]
	OrdersIsLoading: boolean
	OrdersIsLoaded: boolean
	Error: string
}

const initState: State = {
	Order: {} as TOrder,
	OrderIsLoading: false,
	OrderIsLoaded: false,
	Orders: [] as TOrder[],
	OrdersIsLoading: false,
	OrdersIsLoaded: false,
	Error: "",
}

const orderSlice = createSlice({
	name: "order",
	initialState: initState,
	reducers: {
		setCart: (state, payload: PayloadAction<TCart[]>) => {
			state.Order.ProductOrders = payload.payload
		},
		emptyOrder: state => {
			state.Order = {} as TOrder
		},
	},
	extraReducers: req => {
		req.addCase(getCart.pending, state => {
			state.OrderIsLoading = true
		})
		req.addCase(getCart.fulfilled, (state, payload) => {
			const type = payload.payload.Type

			if (type) {
				state.Order = payload.payload.Message
			} else {
				state.Error = payload.payload.Error
			}

			state.OrderIsLoading = false
			state.OrderIsLoaded = true
		})

		req.addCase(getOrders.pending, state => {
			state.OrdersIsLoading = true
		})
		req.addCase(getOrders.fulfilled, (state, payload) => {
			const type = payload.payload.Type

			if (type) {
				state.Orders = payload.payload.Message
			} else {
				state.Error = payload.payload.Error
			}

			state.OrdersIsLoading = false
			state.OrdersIsLoaded = true
		})
	},
})

export const orderReducer = orderSlice.reducer
export const { setCart, emptyOrder } = orderSlice.actions
