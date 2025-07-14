import axios from "axios"

export const API_ENDPOINT = ""

export const API = axios.create({
	baseURL: API_ENDPOINT,
})

API.interceptors.request.use(config => {
	if (config && config.headers) {
		config.headers.Authorization = window.localStorage.getItem("token")
	}
	return config
})
