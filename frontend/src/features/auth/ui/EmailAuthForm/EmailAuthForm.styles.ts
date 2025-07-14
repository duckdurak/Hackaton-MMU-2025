import styled from "styled-components"

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

export const Box = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

export const SwitchButton = styled.button`
	background: none;
	border: none;
	color: #666;
	cursor: pointer;
	text-decoration: underline;
	font-size: 14px;
	margin-top: 8px;
`

export const FormContainer = styled.div`
	width: 100%;
	max-width: 400px;
	padding: 24px;
`

export const Title = styled.h2`
	font-size: 24px;
	font-weight: 500;
	margin-bottom: 24px;
	text-align: center;
	color: #333;
`

export const InputField = styled.div`
	margin-bottom: 4px;
`

export const InputLabel = styled.label`
	display: block;
	margin-bottom: 8px;
	font-size: 14px;
	color: #666;
`

export const Input = styled.input`
	width: 100%;
	padding: 12px 16px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 16px;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: #8a4baf;
	}
`

export const PrimaryButton = styled.button`
	width: 100%;
	padding: 14px;
	background-color: #8a4baf;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	margin-top: 8px;
	transition: background-color 0.3s;

	&:hover {
		background-color: #7d3a98;
	}
`

export const TextButton = styled.button`
	background: none;
	border: none;
	color: #666;
	font-size: 14px;
	cursor: pointer;
	padding: 8px 0;
	display: block;
	width: 100%;
	text-align: center;
	margin-top: 8px;

	&:hover {
		text-decoration: underline;
	}
`

export const ButtonGroup = styled.div``

export const ErrorMessage = styled.div``
