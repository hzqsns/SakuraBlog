package model

import (
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name      string `gorm:"uniqueIndex;size:50;not null" json:"name"`
	Slug      string `gorm:"uniqueIndex;size:50;not null" json:"slug"`
	Color     string `gorm:"size:20" json:"color"` // 用于前端展示的颜色
	PostCount int    `gorm:"-" json:"post_count"`  // 不存储，动态计算

	// 关联 - 多对多
	Posts []Post `gorm:"many2many:post_tags;" json:"posts,omitempty"`
}

// CreateTagRequest 创建标签请求
type CreateTagRequest struct {
	Name  string `json:"name" binding:"required,max=50"`
	Slug  string `json:"slug"`
	Color string `json:"color"`
}

// UpdateTagRequest 更新标签请求
type UpdateTagRequest struct {
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Color string `json:"color"`
}

// TagWithCount 带文章数量的标签
type TagWithCount struct {
	Tag
	PostCount int `json:"post_count"`
}







