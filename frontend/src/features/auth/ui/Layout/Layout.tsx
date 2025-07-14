import { Outlet } from "react-router-dom"
import { Fragment } from "react/jsx-runtime"
import { Footer } from "../../../../widgets/footer/Footer"
import { Header } from "../../../../widgets/header/Header"

export const Layout = () => {
	return (
		<Fragment>
			<Header />
			<Outlet />
			<Footer />
		</Fragment>
	)
}
