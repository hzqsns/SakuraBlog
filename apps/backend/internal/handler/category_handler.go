package handler

import (
	"strconv"

	"sakura-blog/internal/model"
	"sakura-blog/internal/service"
	"sakura-blog/internal/utils"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler() *CategoryHandler {
	return &CategoryHandler{service: service.NewCategoryService()}
}

// Create 创建分类
// @Summary 创建分类
// @Tags 分类
// @Accept json
// @Produce json
// @Security Bearer
// @Param body body model.CreateCategoryRequest true "分类信息"
// @Success 200 {object} utils.Response
// @Router /api/categories [post]
func (h *CategoryHandler) Create(c *gin.Context) {
	var req model.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误: "+err.Error())
		return
	}

	category, err := h.service.Create(&req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, category)
}

// Update 更新分类
// @Summary 更新分类
// @Tags 分类
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path int true "分类ID"
// @Param body body model.UpdateCategoryRequest true "更新信息"
// @Success 200 {object} utils.Response
// @Router /api/categories/{id} [put]
func (h *CategoryHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的分类ID")
		return
	}

	var req model.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	category, err := h.service.Update(uint(id), &req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, category)
}

// Delete 删除分类
// @Summary 删除分类
// @Tags 分类
// @Produce json
// @Security Bearer
// @Param id path int true "分类ID"
// @Success 200 {object} utils.Response
// @Router /api/categories/{id} [delete]
func (h *CategoryHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的分类ID")
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "分类删除成功", nil)
}

// GetByID 根据ID获取分类
// @Summary 根据ID获取分类
// @Tags 分类
// @Produce json
// @Param id path int true "分类ID"
// @Success 200 {object} utils.Response
// @Router /api/categories/{id} [get]
func (h *CategoryHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的分类ID")
		return
	}

	category, err := h.service.GetByID(uint(id))
	if err != nil {
		utils.NotFound(c, "分类不存在")
		return
	}

	utils.Success(c, category)
}

// List 获取所有分类
// @Summary 获取所有分类
// @Tags 分类
// @Produce json
// @Success 200 {object} utils.Response
// @Router /api/categories [get]
func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.service.ListWithPostCount()
	if err != nil {
		utils.InternalError(c, "获取分类列表失败")
		return
	}

	utils.Success(c, categories)
}







