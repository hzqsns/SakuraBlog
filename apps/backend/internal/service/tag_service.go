package service

import (
	"errors"

	"sakura-blog/internal/model"
	"sakura-blog/internal/repository"
	"sakura-blog/internal/utils"
)

type TagService struct {
	repo *repository.TagRepository
}

func NewTagService() *TagService {
	return &TagService{repo: repository.NewTagRepository()}
}

// Create 创建标签
func (s *TagService) Create(req *model.CreateTagRequest) (*model.Tag, error) {
	// 检查名称是否已存在
	if s.repo.ExistsByName(req.Name) {
		return nil, errors.New("标签名称已存在")
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

	tag := &model.Tag{
		Name:  req.Name,
		Slug:  slug,
		Color: req.Color,
	}

	if err := s.repo.Create(tag); err != nil {
		return nil, errors.New("创建标签失败")
	}

	return tag, nil
}

// Update 更新标签
func (s *TagService) Update(id uint, req *model.UpdateTagRequest) (*model.Tag, error) {
	tag, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("标签不存在")
	}

	if req.Name != "" {
		tag.Name = req.Name
	}
	if req.Slug != "" {
		tag.Slug = req.Slug
	}
	if req.Color != "" {
		tag.Color = req.Color
	}

	if err := s.repo.Update(tag); err != nil {
		return nil, errors.New("更新标签失败")
	}

	return tag, nil
}

// Delete 删除标签
func (s *TagService) Delete(id uint) error {
	_, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("标签不存在")
	}

	return s.repo.Delete(id)
}

// GetByID 根据ID获取标签
func (s *TagService) GetByID(id uint) (*model.Tag, error) {
	return s.repo.FindByID(id)
}

// GetBySlug 根据Slug获取标签
func (s *TagService) GetBySlug(slug string) (*model.Tag, error) {
	return s.repo.FindBySlug(slug)
}

// List 获取所有标签
func (s *TagService) List() ([]model.Tag, error) {
	return s.repo.List()
}

// ListWithPostCount 获取所有标签（包含文章数量）
func (s *TagService) ListWithPostCount() ([]model.Tag, error) {
	return s.repo.ListWithPostCount()
}







