package service

import (
	"errors"

	"sakura-blog/internal/model"
	"sakura-blog/internal/repository"
	"sakura-blog/internal/utils"
)

type CategoryService struct {
	repo *repository.CategoryRepository
}

func NewCategoryService() *CategoryService {
	return &CategoryService{repo: repository.NewCategoryRepository()}
}

// Create 创建分类
func (s *CategoryService) Create(req *model.CreateCategoryRequest) (*model.Category, error) {
	// 检查名称是否已存在
	if s.repo.ExistsByName(req.Name) {
		return nil, errors.New("分类名称已存在")
	}

	// 生成slug
	slug := req.Slug
	if slug == "" {
		slug = utils.GenerateSlug(req.Name)
	}

	// 确保slug唯一
	if s.repo.ExistsBySlug(slug) {
		slug = utils.GenerateUniqueSlug(req.Name)
	}

	category := &model.Category{
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		Color:       req.Color,
	}

	if err := s.repo.Create(category); err != nil {
		return nil, errors.New("创建分类失败")
	}

	return category, nil
}

// Update 更新分类
func (s *CategoryService) Update(id uint, req *model.UpdateCategoryRequest) (*model.Category, error) {
	category, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("分类不存在")
	}

	if req.Name != "" {
		category.Name = req.Name
	}
	if req.Slug != "" {
		category.Slug = req.Slug
	}
	if req.Description != "" {
		category.Description = req.Description
	}
	if req.Color != "" {
		category.Color = req.Color
	}

	if err := s.repo.Update(category); err != nil {
		return nil, errors.New("更新分类失败")
	}

	return category, nil
}

// Delete 删除分类
func (s *CategoryService) Delete(id uint) error {
	_, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("分类不存在")
	}

	return s.repo.Delete(id)
}

// GetByID 根据ID获取分类
func (s *CategoryService) GetByID(id uint) (*model.Category, error) {
	return s.repo.FindByID(id)
}

// GetBySlug 根据Slug获取分类
func (s *CategoryService) GetBySlug(slug string) (*model.Category, error) {
	return s.repo.FindBySlug(slug)
}

// List 获取所有分类
func (s *CategoryService) List() ([]model.Category, error) {
	return s.repo.List()
}

// ListWithPostCount 获取所有分类（包含文章数量）
func (s *CategoryService) ListWithPostCount() ([]model.Category, error) {
	return s.repo.ListWithPostCount()
}







