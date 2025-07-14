export type TResponse<T> = {
	Type: boolean
	Error: string
	Message: T
}

export type TUser = {
	ID: string
	FirstName: string
	LastName: string
	Email: string
	Password: string
	Role: number
	TelegramID: number
	Discount: number
	Verified: boolean
	Avatar: Object
	Addresses: []
	Comments: []
	AvatarID: number
	Token: string
}

export type TProduct = {
	ID: number
	Name: string
	Description: string
	Price: number
	Disabled: boolean
	CreatedAt: string
	UpdatedAt: string
	CategoryID: number
	Category: TCategory
	UserID: number
	User: TUser
	Images: TImage[]
}

export type TCategory = {
	ID: string
	Name: string
	ImageID: number
	Image: TImage
}

export type TImage = {
	ID: string
	FullPath: string
	UserID: number
	ProductID: number
}

export type TOrder = {
	ID: number
	CreatedAt: string
	Buyer_id: string
	Buyer: TUser
	Finished: boolean
	Ordered: boolean
	Trackings: {}
	Comments: {}
	ProductOrders: TCart[]
}

export type TCart = {
	ID: number
	ProductID: number
	Product: TProduct
	Quantity: number
	OrderID: number
	Order: TOrder
}
