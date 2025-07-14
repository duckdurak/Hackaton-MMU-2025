import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import "./App.css"
import { router } from "./routes"
import { useAppDispatch } from "./store/hooks"
import { getAuth } from "./store/slices/auth.slice"
import { getCategories } from "./store/slices/category.slice"
import { getCart } from "./store/slices/order"

function App() {
	const dispatch = useAppDispatch()
	const token = window.localStorage.getItem("token")

	useEffect(() => {
		if (token) {
			dispatch(getAuth())
			dispatch(getCart())
		}
	}, [token])

	useEffect(() => {
		dispatch(getCategories())
	}, [])

	return <RouterProvider router={router} />
}

export default App
