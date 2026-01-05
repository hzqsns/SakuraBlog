package service

import (
	"errors"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"sakura-blog/internal/model"
	"sakura-blog/internal/repository"
	"sakura-blog/internal/utils"
)

type PostService struct {
	postRepo     *repository.PostRepository
	tagRepo      *repository.TagRepository
	categoryRepo *repository.CategoryRepository
}

func NewPostService() *PostService {
	return &PostService{
		postRepo:     repository.NewPostRepository(),
		tagRepo:      repository.NewTagRepository(),
		categoryRepo: repository.NewCategoryRepository(),
	}
}

// Create 创建文章
func (s *PostService) Create(req *model.CreatePostRequest) (*model.Post, error) {
	// 生成slug
	slug := req.Slug
	if slug == "" {
		slug = utils.GenerateSlug(req.Title)
	}
	// 确保slug唯一
	if s.postRepo.ExistsBySlug(slug) {
		slug = utils.GenerateUniqueSlug(req.Title)
	}

	// 计算字数和阅读时间
	wordCount := utf8.RuneCountInString(req.Content)
	readingTime := calculateReadingTime(wordCount)

	// 生成摘要
	excerpt := req.Excerpt
	if excerpt == "" {
		excerpt = generateExcerpt(req.Content, 200)
	}

	// 确定状态
	status := model.PostStatusDraft
	if req.Status == "published" {
		status = model.PostStatusPublished
	}

	var publishDate *time.Time
	if status == model.PostStatusPublished {
		now := time.Now()
		publishDate = &now
	}

	// 如果提供了发布日期字符串，解析它
	if req.PublishDateStr != "" {
		if parsed, err := time.Parse("2006-01-02", req.PublishDateStr); err == nil {
			publishDate = &parsed
		}
	}

	post := &model.Post{
		Title:       req.Title,
		Slug:        slug,
		Content:     req.Content,
		Excerpt:     excerpt,
		CoverImage:  req.CoverImage,
		Status:      status,
		PublishDate: publishDate,
		CategoryID:  req.CategoryID,
		WordCount:   wordCount,
		ReadingTime: readingTime,
	}

	if err := s.postRepo.Create(post); err != nil {
		return nil, errors.New("创建文章失败")
	}

	// 处理标签
	if err := s.handleTags(post.ID, req.TagIDs, req.TagNames); err != nil {
		return nil, err
	}

	// 重新加载文章（包含关联数据）
	return s.postRepo.FindByID(post.ID)
}

// Update 更新文章
func (s *PostService) Update(id uint, req *model.UpdatePostRequest) (*model.Post, error) {
	post, err := s.postRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("文章不存在")
	}

	// 更新字段
	if req.Title != "" {
		post.Title = req.Title
	}
	if req.Slug != "" {
		post.Slug = req.Slug
	}
	if req.Content != "" {
		post.Content = req.Content
		post.WordCount = utf8.RuneCountInString(req.Content)
		post.ReadingTime = calculateReadingTime(post.WordCount)
	}
	if req.Excerpt != "" {
		post.Excerpt = req.Excerpt
	}
	if req.CoverImage != "" {
		post.CoverImage = req.CoverImage
	}
	if req.CategoryID != 0 {
		post.CategoryID = req.CategoryID
	}

	// 处理状态变化
	if req.Status != "" {
		newStatus := model.PostStatus(req.Status)
		if post.Status != model.PostStatusPublished && newStatus == model.PostStatusPublished {
			// 首次发布，设置发布时间
			now := time.Now()
			post.PublishDate = &now
		}
		post.Status = newStatus
	}

	if err := s.postRepo.Update(post); err != nil {
		return nil, errors.New("更新文章失败")
	}

	// 处理标签
	if len(req.TagIDs) > 0 || len(req.TagNames) > 0 {
		if err := s.handleTags(post.ID, req.TagIDs, req.TagNames); err != nil {
			return nil, err
		}
	}

	return s.postRepo.FindByID(id)
}

// Delete 删除文章
func (s *PostService) Delete(id uint) error {
	_, err := s.postRepo.FindByID(id)
	if err != nil {
		return errors.New("文章不存在")
	}

	return s.postRepo.Delete(id)
}

// GetByID 根据ID获取文章
func (s *PostService) GetByID(id uint) (*model.Post, error) {
	return s.postRepo.FindByID(id)
}

// GetBySlug 根据Slug获取文章
func (s *PostService) GetBySlug(slug string) (*model.Post, error) {
	return s.postRepo.FindBySlug(slug)
}

// List 获取文章列表
func (s *PostService) List(query *model.PostQuery) (*model.PostListResponse, error) {
	posts, total, err := s.postRepo.List(query)
	if err != nil {
		return nil, err
	}

	// 转换为响应格式
	var postResponses []model.PostResponse
	for _, post := range posts {
		postResponses = append(postResponses, post.ToResponse())
	}

	totalPages := int(total) / query.PageSize
	if int(total)%query.PageSize > 0 {
		totalPages++
	}

	return &model.PostListResponse{
		Posts:      postResponses,
		Total:      total,
		Page:       query.Page,
		PageSize:   query.PageSize,
		TotalPages: totalPages,
	}, nil
}

// IncrementViewCount 增加浏览次数
func (s *PostService) IncrementViewCount(id uint) error {
	return s.postRepo.IncrementViewCount(id)
}

// handleTags 处理文章标签
func (s *PostService) handleTags(postID uint, tagIDs []uint, tagNames []string) error {
	var tags []model.Tag

	// 通过ID获取标签
	if len(tagIDs) > 0 {
		tagsByID, err := s.tagRepo.FindByIDs(tagIDs)
		if err != nil {
			return err
		}
		tags = append(tags, tagsByID...)
	}

	// 通过名称获取或创建标签
	if len(tagNames) > 0 {
		tagsByName, err := s.tagRepo.FindOrCreateByNames(tagNames)
		if err != nil {
			return err
		}
		tags = append(tags, tagsByName...)
	}

	// 更新文章标签关联
	return s.postRepo.UpdateTags(postID, tags)
}

// calculateReadingTime 计算阅读时间
func calculateReadingTime(wordCount int) string {
	// 假设每分钟阅读300个字
	minutes := wordCount / 300
	if minutes < 1 {
		return "1分钟"
	}
	return strconv.Itoa(minutes) + "分钟"
}

// generateExcerpt 生成摘要
func generateExcerpt(content string, maxLen int) string {
	// 移除Markdown语法
	content = strings.ReplaceAll(content, "#", "")
	content = strings.ReplaceAll(content, "*", "")
	content = strings.ReplaceAll(content, "`", "")
	content = strings.ReplaceAll(content, "\n", " ")
	content = strings.TrimSpace(content)

	runes := []rune(content)
	if len(runes) <= maxLen {
		return content
	}
	return string(runes[:maxLen]) + "..."
}
