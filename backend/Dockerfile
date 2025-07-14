FROM golang:latest AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o app .

FROM alpine:latest

COPY --from=builder /app/app /app

WORKDIR /

EXPOSE 3000

CMD ["/app"]