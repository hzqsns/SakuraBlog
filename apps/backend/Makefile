.PHONY: build run dev clean test migrate

# 构建应用
build:
	go build -o bin/server ./cmd/server

# 运行应用
run: build
	./bin/server

# 开发模式运行（带热重载，需要安装air）
dev:
	air

# 直接运行（不构建）
start:
	go run ./cmd/server

# 清理构建文件
clean:
	rm -rf bin/

# 运行测试
test:
	go test -v ./...

# 下载依赖
deps:
	go mod download
	go mod tidy

# 格式化代码
fmt:
	go fmt ./...

# 代码检查
lint:
	golangci-lint run

# 创建.env文件
env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		echo "PORT=8080" > .env; \
		echo "GIN_MODE=debug" >> .env; \
		echo "DB_HOST=localhost" >> .env; \
		echo "DB_PORT=5432" >> .env; \
		echo "DB_USER=postgres" >> .env; \
		echo "DB_PASSWORD=postgres" >> .env; \
		echo "DB_NAME=sakura_blog" >> .env; \
		echo "JWT_SECRET=your-super-secret-key-change-this" >> .env; \
		echo "JWT_EXPIRE_HOURS=72" >> .env; \
		echo "CORS_ORIGINS=http://localhost:5173" >> .env; \
		echo ".env file created!"; \
	else \
		echo ".env file already exists"; \
	fi







