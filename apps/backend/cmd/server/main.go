package main

import (
	"log"
	"os"

	"sakura-blog/internal/config"
	"sakura-blog/internal/database"
	"sakura-blog/internal/handler"
	"sakura-blog/internal/utils"

	"github.com/joho/godotenv"
)

func main() {
	// 尝试加载配置文件（按优先级：.env > config.env）
	if err := godotenv.Load(); err != nil {
		// 尝试加载 config.env
		if err := godotenv.Load("config.env"); err != nil {
			log.Println("No .env or config.env file found, using environment variables")
		} else {
			log.Println("Loaded config from config.env")
		}
	} else {
		log.Println("Loaded config from .env")
	}

	// 加载配置
	cfg := config.Load()

	// 初始化JWT
	utils.InitJWT(cfg.JWT.Secret, cfg.JWT.ExpireHours)

	// 连接数据库
	if err := database.Init(&cfg.Database); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 自动迁移数据库
	if err := database.AutoMigrate(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// 初始化种子数据
	if err := database.Seed(); err != nil {
		log.Printf("Warning: Failed to seed database: %v", err)
	}

	// 设置路由
	r := handler.SetupRouter(cfg)

	// 启动服务器
	port := cfg.Server.Port
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s...", port)
	log.Printf("API available at http://localhost:%s/api", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
		os.Exit(1)
	}
}




