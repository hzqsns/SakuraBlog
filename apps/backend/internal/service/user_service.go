package service

import (
	"errors"

	"sakura-blog/internal/model"
	"sakura-blog/internal/repository"
	"sakura-blog/internal/utils"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService() *UserService {
	return &UserService{repo: repository.NewUserRepository()}
}

// Register 用户注册
func (s *UserService) Register(req *model.RegisterRequest) (*model.User, error) {
	// 检查用户名是否已存在
	if s.repo.ExistsByUsername(req.Username) {
		return nil, errors.New("用户名已存在")
	}

	// 检查邮箱是否已存在
	if s.repo.ExistsByEmail(req.Email) {
		return nil, errors.New("邮箱已被注册")
	}

	// 加密密码
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("密码加密失败")
	}

	// 创建用户
	user := &model.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
		Nickname: req.Nickname,
		Role:     "user", // 默认角色
	}

	// 如果昵称为空，使用用户名
	if user.Nickname == "" {
		user.Nickname = user.Username
	}

	if err := s.repo.Create(user); err != nil {
		return nil, errors.New("注册失败")
	}

	return user, nil
}

// Login 用户登录
func (s *UserService) Login(req *model.LoginRequest) (*model.User, string, error) {
	// 查找用户（支持用户名或邮箱登录）
	user, err := s.repo.FindByUsername(req.Username)
	if err != nil {
		// 尝试用邮箱查找
		user, err = s.repo.FindByEmail(req.Username)
		if err != nil {
			return nil, "", errors.New("用户名或密码错误")
		}
	}

	// 验证密码
	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, "", errors.New("用户名或密码错误")
	}

	// 生成JWT token
	token, err := utils.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		return nil, "", errors.New("生成token失败")
	}

	return user, token, nil
}

// GetUserByID 根据ID获取用户
func (s *UserService) GetUserByID(id uint) (*model.User, error) {
	return s.repo.FindByID(id)
}

// UpdateProfile 更新用户信息
func (s *UserService) UpdateProfile(id uint, req *model.UpdateProfileRequest) (*model.User, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("用户不存在")
	}

	// 更新字段
	if req.Nickname != "" {
		user.Nickname = req.Nickname
	}
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}
	if req.Bio != "" {
		user.Bio = req.Bio
	}

	if err := s.repo.Update(user); err != nil {
		return nil, errors.New("更新失败")
	}

	return user, nil
}

// ChangePassword 修改密码
func (s *UserService) ChangePassword(id uint, req *model.ChangePasswordRequest) error {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("用户不存在")
	}

	// 验证旧密码
	if !utils.CheckPassword(req.OldPassword, user.Password) {
		return errors.New("原密码错误")
	}

	// 加密新密码
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return errors.New("密码加密失败")
	}

	// 更新密码
	return s.repo.UpdateFields(id, map[string]interface{}{"password": hashedPassword})
}







