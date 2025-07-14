import { configureStore } from "@reduxjs/toolkit"
import { adminReducer } from "./slices/admin.slice"
import { authReducer } from "./slices/auth.slice"
import { categoryReducer } from "./slices/category.slice"
import { modalReducer } from "./slices/modal.slice"
import { orderReducer } from "./slices/order"
import { productReducer } from "./slices/product"

export const store = configureStore({
	reducer: {
		modal: modalReducer,
		auth: authReducer,
		category: categoryReducer,
		product: productReducer,
		order: orderReducer,
		admin: adminReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
