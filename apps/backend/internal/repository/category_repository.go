package repository

import (
	"sakura-blog/internal/database"
	"sakura-blog/internal/model"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository() *CategoryRepository {
	return &CategoryRepository{db: database.GetDB()}
}

func (r *CategoryRepository) Create(category *model.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) FindByID(id uint) (*model.Category, error) {
	var category model.Category
	err := r.db.First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepository) FindBySlug(slug string) (*model.Category, error) {
	var category model.Category
	err := r.db.Where("slug = ?", slug).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepository) Update(category *model.Category) error {
	return r.db.Save(category).Error
}

func (r *CategoryRepository) Delete(id uint) error {
	return r.db.Delete(&model.Category{}, id).Error
}

func (r *CategoryRepository) List() ([]model.Category, error) {
	var categories []model.Category
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *CategoryRepository) ListWithPostCount() ([]model.Category, error) {
	var categories []model.Category
	err := r.db.Find(&categories).Error
	if err != nil {
		return nil, err
	}

	// 获取每个分类的文章数量
	for i := range categories {
		var count int64
		r.db.Model(&model.Post{}).Where("category_id = ? AND status = ?", categories[i].ID, "published").Count(&count)
		categories[i].PostCount = int(count)
	}

	return categories, nil
}

func (r *CategoryRepository) ExistsByName(name string) bool {
	var count int64
	r.db.Model(&model.Category{}).Where("name = ?", name).Count(&count)
	return count > 0
}

func (r *CategoryRepository) ExistsBySlug(slug string) bool {
	var count int64
	r.db.Model(&model.Category{}).Where("slug = ?", slug).Count(&count)
	return count > 0
}







