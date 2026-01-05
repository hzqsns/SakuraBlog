package model

import (
	"time"

	"gorm.io/gorm"
)

type PostStatus string

const (
	PostStatusDraft     PostStatus = "draft"
	PostStatusPublished PostStatus = "published"
	PostStatusArchived  PostStatus = "archived"
)

type Post struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Title       string     `gorm:"size:200;not null" json:"title"`
	Slug        string     `gorm:"uniqueIndex;size:200;not null" json:"slug"`
	Content     string     `gorm:"type:text;not null" json:"content"`
	Excerpt     string     `gorm:"size:500" json:"excerpt"`
	CoverImage  string     `gorm:"size:255" json:"cover_image"`
	Status      PostStatus `gorm:"size:20;default:draft" json:"status"`
	PublishDate *time.Time `json:"publish_date"`
	ViewCount   int        `gorm:"default:0" json:"view_count"`
	WordCount   int        `gorm:"default:0" json:"word_count"`
	ReadingTime string     `gorm:"size:20" json:"reading_time"`

	// 外键
	CategoryID uint `json:"category_id"`

	// 关联
	Category Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Tags     []Tag    `gorm:"many2many:post_tags;" json:"tags,omitempty"`
}

// PostResponse 文章响应
type PostResponse struct {
	ID          uint       `json:"id"`
	Title       string     `json:"title"`
	Slug        string     `json:"slug"`
	Content     string     `json:"content"`
	Excerpt     string     `json:"excerpt"`
	CoverImage  string     `json:"cover_image"`
	Status      PostStatus `json:"status"`
	PublishDate *time.Time `json:"publish_date"`
	ViewCount   int        `json:"view_count"`
	WordCount   int        `json:"word_count"`
	ReadingTime string     `json:"reading_time"`
	Category    Category   `json:"category"`
	Tags        []Tag      `json:"tags"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

func (p *Post) ToResponse() PostResponse {
	return PostResponse{
		ID:          p.ID,
		Title:       p.Title,
		Slug:        p.Slug,
		Content:     p.Content,
		Excerpt:     p.Excerpt,
		CoverImage:  p.CoverImage,
		Status:      p.Status,
		PublishDate: p.PublishDate,
		ViewCount:   p.ViewCount,
		WordCount:   p.WordCount,
		ReadingTime: p.ReadingTime,
		Category:    p.Category,
		Tags:        p.Tags,
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
	}
}

// CreatePostRequest 创建文章请求
type CreatePostRequest struct {
	Title          string   `json:"title" binding:"required,max=200"`
	Slug           string   `json:"slug"`                       // 可选，不填则自动生成
	Content        string   `json:"content" binding:"required"`
	Excerpt        string   `json:"excerpt"`
	CoverImage     string   `json:"cover_image"`
	Status         string   `json:"status"`
	PublishDateStr string   `json:"publish_date"` // 发布日期字符串 YYYY-MM-DD
	CategoryID     uint     `json:"category_id"`
	TagIDs         []uint   `json:"tag_ids"`
	TagNames       []string `json:"tag_names"` // 支持通过名称创建/关联标签
}

// UpdatePostRequest 更新文章请求
type UpdatePostRequest struct {
	Title      string   `json:"title"`
	Slug       string   `json:"slug"`
	Content    string   `json:"content"`
	Excerpt    string   `json:"excerpt"`
	CoverImage string   `json:"cover_image"`
	Status     string   `json:"status"`
	CategoryID uint     `json:"category_id"`
	TagIDs     []uint   `json:"tag_ids"`
	TagNames   []string `json:"tag_names"`
}

// PostListResponse 文章列表响应
type PostListResponse struct {
	Posts      []PostResponse `json:"posts"`
	Total      int64          `json:"total"`
	Page       int            `json:"page"`
	PageSize   int            `json:"page_size"`
	TotalPages int            `json:"total_pages"`
}

// PostQuery 文章查询参数
type PostQuery struct {
	Page       int    `form:"page,default=1"`
	PageSize   int    `form:"page_size,default=10"`
	Status     string `form:"status"`
	CategoryID uint   `form:"category_id"`
	TagID      uint   `form:"tag_id"`
	AuthorID   uint   `form:"author_id"`
	Search     string `form:"search"`
	OrderBy    string `form:"order_by,default=created_at"`
	Order      string `form:"order,default=desc"`
}




