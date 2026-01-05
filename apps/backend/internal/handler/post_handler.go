package handler

import (
	"strconv"

	"sakura-blog/internal/model"
	"sakura-blog/internal/service"
	"sakura-blog/internal/utils"

	"github.com/gin-gonic/gin"
)

type PostHandler struct {
	service *service.PostService
}

func NewPostHandler() *PostHandler {
	return &PostHandler{service: service.NewPostService()}
}

// Create 创建文章
func (h *PostHandler) Create(c *gin.Context) {
	var req model.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误: "+err.Error())
		return
	}

	post, err := h.service.Create(&req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, post.ToResponse())
}

// Update 更新文章
func (h *PostHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	var req model.UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	post, err := h.service.Update(uint(id), &req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, post.ToResponse())
}

// Delete 删除文章
func (h *PostHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "文章删除成功", nil)
}

// GetByID 根据ID获取文章
func (h *PostHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	post, err := h.service.GetByID(uint(id))
	if err != nil {
		utils.NotFound(c, "文章不存在")
		return
	}

	// 增加浏览次数
	_ = h.service.IncrementViewCount(uint(id))

	utils.Success(c, post.ToResponse())
}

// GetBySlug 根据Slug获取文章
func (h *PostHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		utils.BadRequest(c, "无效的文章Slug")
		return
	}

	post, err := h.service.GetBySlug(slug)
	if err != nil {
		utils.NotFound(c, "文章不存在")
		return
	}

	// 增加浏览次数
	_ = h.service.IncrementViewCount(post.ID)

	utils.Success(c, post.ToResponse())
}

// List 获取文章列表
func (h *PostHandler) List(c *gin.Context) {
	var query model.PostQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	// 设置默认值
	if query.Page <= 0 {
		query.Page = 1
	}
	if query.PageSize <= 0 {
		query.PageSize = 10
	}
	if query.PageSize > 100 {
		query.PageSize = 100
	}
	if query.OrderBy == "" {
		query.OrderBy = "created_at"
	}
	if query.Order == "" {
		query.Order = "desc"
	}

	result, err := h.service.List(&query)
	if err != nil {
		utils.InternalError(c, "获取文章列表失败")
		return
	}

	utils.Success(c, result)
}
