package handler

import (
	"sakura-blog/internal/middleware"
	"sakura-blog/internal/model"
	"sakura-blog/internal/service"
	"sakura-blog/internal/utils"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler() *UserHandler {
	return &UserHandler{service: service.NewUserService()}
}

// Register 用户注册
// @Summary 用户注册
// @Tags 认证
// @Accept json
// @Produce json
// @Param body body model.RegisterRequest true "注册信息"
// @Success 200 {object} utils.Response
// @Router /api/auth/register [post]
func (h *UserHandler) Register(c *gin.Context) {
	var req model.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误: "+err.Error())
		return
	}

	user, err := h.service.Register(&req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	// 生成token
	token, err := utils.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		utils.InternalError(c, "生成token失败")
		return
	}

	utils.Success(c, gin.H{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Login 用户登录
// @Summary 用户登录
// @Tags 认证
// @Accept json
// @Produce json
// @Param body body model.LoginRequest true "登录信息"
// @Success 200 {object} utils.Response
// @Router /api/auth/login [post]
func (h *UserHandler) Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	user, token, err := h.service.Login(&req)
	if err != nil {
		utils.Unauthorized(c, err.Error())
		return
	}

	utils.Success(c, gin.H{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// GetProfile 获取当前用户信息
// @Summary 获取当前用户信息
// @Tags 用户
// @Produce json
// @Security Bearer
// @Success 200 {object} utils.Response
// @Router /api/user/profile [get]
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := middleware.GetCurrentUserID(c)
	if userID == 0 {
		utils.Unauthorized(c, "请先登录")
		return
	}

	user, err := h.service.GetUserByID(userID)
	if err != nil {
		utils.NotFound(c, "用户不存在")
		return
	}

	utils.Success(c, user.ToResponse())
}

// UpdateProfile 更新用户信息
// @Summary 更新用户信息
// @Tags 用户
// @Accept json
// @Produce json
// @Security Bearer
// @Param body body model.UpdateProfileRequest true "更新信息"
// @Success 200 {object} utils.Response
// @Router /api/user/profile [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := middleware.GetCurrentUserID(c)
	if userID == 0 {
		utils.Unauthorized(c, "请先登录")
		return
	}

	var req model.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	user, err := h.service.UpdateProfile(userID, &req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.Success(c, user.ToResponse())
}

// ChangePassword 修改密码
// @Summary 修改密码
// @Tags 用户
// @Accept json
// @Produce json
// @Security Bearer
// @Param body body model.ChangePasswordRequest true "密码信息"
// @Success 200 {object} utils.Response
// @Router /api/user/password [put]
func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID := middleware.GetCurrentUserID(c)
	if userID == 0 {
		utils.Unauthorized(c, "请先登录")
		return
	}

	var req model.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	if err := h.service.ChangePassword(userID, &req); err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "密码修改成功", nil)
}







