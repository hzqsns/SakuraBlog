package database

import (
	"fmt"
	"log"

	"sakura-blog/internal/config"
	"sakura-blog/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init(cfg *config.DatabaseConfig) error {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connected successfully")
	return nil
}

func AutoMigrate() error {
	log.Println("Running auto migration...")
	err := DB.AutoMigrate(
		&model.User{},
		&model.Category{},
		&model.Tag{},
		&model.Post{},
	)
	if err != nil {
		return fmt.Errorf("failed to auto migrate: %w", err)
	}
	log.Println("Auto migration completed")
	return nil
}

func GetDB() *gorm.DB {
	return DB
}

// Seed 初始化一些默认数据
func Seed() error {
	// 创建默认分类
	var categoryCount int64
	DB.Model(&model.Category{}).Count(&categoryCount)
	if categoryCount == 0 {
		defaultCategories := []model.Category{
			{Name: "技术", Slug: "tech", Description: "技术相关文章", Color: "#3B82F6"},
			{Name: "生活", Slug: "life", Description: "生活随笔", Color: "#10B981"},
			{Name: "随想", Slug: "thoughts", Description: "随想杂谈", Color: "#8B5CF6"},
		}
		if err := DB.Create(&defaultCategories).Error; err != nil {
			log.Printf("Failed to create default categories: %v", err)
		} else {
			log.Println("Default categories created")
		}
	}

	// 创建默认标签
	var tagCount int64
	DB.Model(&model.Tag{}).Count(&tagCount)
	if tagCount == 0 {
		defaultTags := []model.Tag{
			{Name: "Go", Slug: "go", Color: "#00ADD8"},
			{Name: "React", Slug: "react", Color: "#61DAFB"},
			{Name: "TypeScript", Slug: "typescript", Color: "#3178C6"},
			{Name: "PostgreSQL", Slug: "postgresql", Color: "#336791"},
			{Name: "前端", Slug: "frontend", Color: "#F7DF1E"},
			{Name: "后端", Slug: "backend", Color: "#68A063"},
		}
		if err := DB.Create(&defaultTags).Error; err != nil {
			log.Printf("Failed to create default tags: %v", err)
		} else {
			log.Println("Default tags created")
		}
	}

	return nil
}







