package forms



type FormSeller struct {
	Organization string `form:"organization" binding:"required"`
	FullAddress  string `form:"fullAddress" binding:"required"`
	Inn          string `form:"inn" binding:"required"`
}

type FormProduct struct {
	Name        string
	Description string
	Category    string
	PathImages  string
	Price       int
}
