package model

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name        string `gorm:"uniqueIndex;size:50;not null" json:"name"`
	Slug        string `gorm:"uniqueIndex;size:50;not null" json:"slug"`
	Description string `gorm:"size:200" json:"description"`
	Color       string `gorm:"size:20" json:"color"` // 用于前端展示的颜色
	PostCount   int    `gorm:"-" json:"post_count"`  // 不存储，动态计算

	// 关联
	Posts []Post `gorm:"foreignKey:CategoryID" json:"posts,omitempty"`
}

// CreateCategoryRequest 创建分类请求
type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required,max=50"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Color       string `json:"color"`
}

// UpdateCategoryRequest 更新分类请求
type UpdateCategoryRequest struct {
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Color       string `json:"color"`
}







