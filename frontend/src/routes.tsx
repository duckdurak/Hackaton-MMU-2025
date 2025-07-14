import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./features/auth/ui/Layout/Layout"
import { AboutPage } from "./pages/AboutPage/AboutPage"
import AdminPanel from "./pages/AdminPanel/AdminPanel"
import CatalogPage from "./pages/CatalogPage/CatalogPage"
import { MainPage } from "./pages/Main/Main"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import { ProtectedPage } from "./pages/ProtectedPage/ProtectedPage"

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <MainPage />,
			},
			{
				path: "/about",
				element: <AboutPage />,
			},
			{
				path: "/catalog",
				element: <CatalogPage />,
			},
			{
				path: "/profile",
				element: (
					<ProtectedPage>
						<ProfilePage />
					</ProtectedPage>
				),
			},
		],
	},
	{
		path: "/admin",
		element: (
			<ProtectedPage admin>
				<AdminPanel />
			</ProtectedPage>
		),
	},
	// {
	// 	path: "/profile/verify",
	// 	element: <VerifyEmailPage />,
	// },
])
