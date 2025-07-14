import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { API } from "../../axios"
import { TCategory, TResponse } from "../../types"

export const getCategories = createAsyncThunk(
	"product/getCategories",
	async () => {
		return (await API.get("/api/category").then(
			res => res.data,
			res => res.response?.data
		)) as TResponse<TCategory[]>
	}
)

type State = {
	Category: TCategory[]
	IsLoading: boolean
	IsLoaded: boolean
	Error: string
}

const initState: State = {
	Category: [] as TCategory[],
	IsLoading: false,
	IsLoaded: false,
	Error: "",
}

const categorySlice = createSlice({
	name: "category",
	initialState: initState,
	reducers: {
		addCategory: (state, payload: PayloadAction<TCategory>) => {
			state.Category.push(payload.payload)
		},
	},
	extraReducers: req => {
		req.addCase(getCategories.pending, state => {
			state.IsLoading = true
		})
		req.addCase(getCategories.fulfilled, (state, payload) => {
			console.log(payload.payload)
			const type = payload.payload.Type

			if (type) {
				state.Category = payload.payload.Message
			} else {
				state.Error = payload.payload.Error
			}

			state.IsLoading = false
			state.IsLoaded = true
		})
	},
})

export const categoryReducer = categorySlice.reducer
export const { addCategory } = categorySlice.actions
