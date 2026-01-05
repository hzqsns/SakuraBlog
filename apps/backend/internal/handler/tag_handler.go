package handler

import (
	"strconv"

	"sakura-blog/internal/model"
	"sakura-blog/internal/service"
	"sakura-blog/internal/utils"

	"github.com/gin-gonic/gin"
)

type TagHandler struct {
	service *service.TagService
}

func NewTagHandler() *TagHandler {
	return &TagHandler{service: service.NewTagService()}
}

// Create 创建标签
// @Summary 创建标签
// @Tags 标签
// @Accept json
// @Produce json
// @Security Bearer
// @Param body body model.CreateTagRequest true "标签信息"
// @Success 200 {object} utils.Response
// @Router /api/tags [post]
func (h *TagHandler) Create(c *gin.Context) {
	var req model.CreateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误: "+err.Error())
		return
	}

	tag, err := h.service.Create(&req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, tag)
}

// Update 更新标签
// @Summary 更新标签
// @Tags 标签
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path int true "标签ID"
// @Param body body model.UpdateTagRequest true "更新信息"
// @Success 200 {object} utils.Response
// @Router /api/tags/{id} [put]
func (h *TagHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的标签ID")
		return
	}

	var req model.UpdateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	tag, err := h.service.Update(uint(id), &req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, tag)
}

// Delete 删除标签
// @Summary 删除标签
// @Tags 标签
// @Produce json
// @Security Bearer
// @Param id path int true "标签ID"
// @Success 200 {object} utils.Response
// @Router /api/tags/{id} [delete]
func (h *TagHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的标签ID")
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "标签删除成功", nil)
}

// GetByID 根据ID获取标签
// @Summary 根据ID获取标签
// @Tags 标签
// @Produce json
// @Param id path int true "标签ID"
// @Success 200 {object} utils.Response
// @Router /api/tags/{id} [get]
func (h *TagHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的标签ID")
		return
	}

	tag, err := h.service.GetByID(uint(id))
	if err != nil {
		utils.NotFound(c, "标签不存在")
		return
	}

	utils.Success(c, tag)
}

// List 获取所有标签
// @Summary 获取所有标签
// @Tags 标签
// @Produce json
// @Success 200 {object} utils.Response
// @Router /api/tags [get]
func (h *TagHandler) List(c *gin.Context) {
	tags, err := h.service.ListWithPostCount()
	if err != nil {
		utils.InternalError(c, "获取标签列表失败")
		return
	}

	utils.Success(c, tags)
}







