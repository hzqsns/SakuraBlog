package repository

import (
	"sakura-blog/internal/database"
	"sakura-blog/internal/model"

	"gorm.io/gorm"
)

type PostRepository struct {
	db *gorm.DB
}

func NewPostRepository() *PostRepository {
	return &PostRepository{db: database.GetDB()}
}

func (r *PostRepository) Create(post *model.Post) error {
	return r.db.Create(post).Error
}

func (r *PostRepository) FindByID(id uint) (*model.Post, error) {
	var post model.Post
	err := r.db.Preload("Category").Preload("Tags").First(&post, id).Error
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *PostRepository) FindBySlug(slug string) (*model.Post, error) {
	var post model.Post
	err := r.db.Preload("Category").Preload("Tags").Where("slug = ?", slug).First(&post).Error
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *PostRepository) Update(post *model.Post) error {
	return r.db.Save(post).Error
}

func (r *PostRepository) Delete(id uint) error {
	return r.db.Delete(&model.Post{}, id).Error
}

func (r *PostRepository) List(query *model.PostQuery) ([]model.Post, int64, error) {
	var posts []model.Post
	var total int64

	db := r.db.Model(&model.Post{})

	// 过滤条件
	if query.Status != "" {
		db = db.Where("status = ?", query.Status)
	}
	if query.CategoryID != 0 {
		db = db.Where("category_id = ?", query.CategoryID)
	}
	if query.AuthorID != 0 {
		db = db.Where("author_id = ?", query.AuthorID)
	}
	if query.TagID != 0 {
		db = db.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
			Where("post_tags.tag_id = ?", query.TagID)
	}
	if query.Search != "" {
		searchPattern := "%" + query.Search + "%"
		db = db.Where("title ILIKE ? OR content ILIKE ? OR excerpt ILIKE ?",
			searchPattern, searchPattern, searchPattern)
	}

	// 计算总数
	db.Count(&total)

	// 排序
	orderClause := query.OrderBy + " " + query.Order
	db = db.Order(orderClause)

	// 分页
	offset := (query.Page - 1) * query.PageSize
	db = db.Offset(offset).Limit(query.PageSize)

	// 预加载关联
	err := db.Preload("Category").Preload("Tags").Find(&posts).Error

	return posts, total, err
}

func (r *PostRepository) IncrementViewCount(id uint) error {
	return r.db.Model(&model.Post{}).Where("id = ?", id).
		UpdateColumn("view_count", gorm.Expr("view_count + ?", 1)).Error
}

func (r *PostRepository) ExistsBySlug(slug string) bool {
	var count int64
	r.db.Model(&model.Post{}).Where("slug = ?", slug).Count(&count)
	return count > 0
}

func (r *PostRepository) UpdateTags(postID uint, tags []model.Tag) error {
	post := model.Post{ID: postID}
	return r.db.Model(&post).Association("Tags").Replace(tags)
}

func (r *PostRepository) GetByAuthor(authorID uint, page, pageSize int) ([]model.Post, int64, error) {
	var posts []model.Post
	var total int64

	db := r.db.Model(&model.Post{}).Where("author_id = ?", authorID)
	db.Count(&total)

	offset := (page - 1) * pageSize
	err := db.Offset(offset).Limit(pageSize).
Preload("Category").Preload("Tags").
		Order("created_at DESC").
		Find(&posts).Error

	return posts, total, err
}




