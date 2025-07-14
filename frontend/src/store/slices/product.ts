import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { API } from "../../axios"
import { TProduct, TResponse } from "../../types"

export const getProducts = createAsyncThunk("product/getProducts", async () => {
	return (await API.get("/api/product").then(
		res => res.data,
		res => res.response?.data
	)) as TResponse<TProduct[]>
})

type State = {
	Product: TProduct[]
	IsLoading: boolean
	IsLoaded: boolean
	Error: string
}

const initState: State = {
	Product: [] as TProduct[],
	IsLoading: false,
	IsLoaded: false,
	Error: "",
}

const productSlice = createSlice({
	name: "product",
	initialState: initState,
	reducers: {
		addProduct: (state, payload: PayloadAction<TProduct>) => {
			state.Product.push(payload.payload)
		},
		removeProductById: (state, payload: PayloadAction<number>) => {
			state.Product = state.Product.filter(
				Product => Product.ID !== payload.payload
			)
		},
	},
	extraReducers: req => {
		req.addCase(getProducts.pending, state => {
			state.IsLoading = true
		})
		req.addCase(getProducts.fulfilled, (state, payload) => {
			console.log(payload.payload)
			const type = payload.payload.Type

			if (type) {
				state.Product = payload.payload.Message
			} else {
				state.Error = payload.payload.Error
			}

			state.IsLoading = false
			state.IsLoaded = true
		})
	},
})

export const productReducer = productSlice.reducer
export const { addProduct, removeProductById } = productSlice.actions
