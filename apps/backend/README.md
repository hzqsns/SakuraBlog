# Sakura Blog Backend

基于 Go + Gin + PostgreSQL 的博客后端 API 服务。

## 技术栈

- **Go 1.21+** - 编程语言
- **Gin** - Web 框架
- **GORM** - ORM 框架
- **PostgreSQL** - 数据库
- **JWT** - 身份认证

## 项目结构

```
backend/
├── cmd/
│   └── server/
│       └── main.go          # 入口文件
├── internal/
│   ├── config/              # 配置
│   ├── database/            # 数据库连接
│   ├── handler/             # HTTP 处理器
│   ├── middleware/          # 中间件
│   ├── model/               # 数据模型
│   ├── repository/          # 数据访问层
│   ├── service/             # 业务逻辑层
│   └── utils/               # 工具函数
├── migrations/              # 数据库迁移
├── go.mod
├── Makefile
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
# 确保已安装 Go 1.21+
go version

# 下载依赖
go mod download
go mod tidy
```

### 2. 配置数据库

确保 PostgreSQL 已安装并运行，然后创建数据库：

```bash
# 登录 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE sakura_blog;

# 退出
\q
```

### 3. 配置环境变量

创建 `.env` 文件：

```bash
make env
```

或手动创建 `.env` 文件：

```env
PORT=8080
GIN_MODE=debug

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sakura_blog

JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE_HOURS=72

CORS_ORIGINS=http://localhost:5173
```

### 4. 运行服务

```bash
# 直接运行
make start

# 或构建后运行
make run

# 开发模式（需要安装 air）
make dev
```

服务将在 `http://localhost:8080` 启动。

## API 文档

### 认证

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | ❌ |
| POST | /api/auth/login | 用户登录 | ❌ |

### 用户

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/user/profile | 获取当前用户信息 | ✅ |
| PUT | /api/user/profile | 更新用户信息 | ✅ |
| PUT | /api/user/password | 修改密码 | ✅ |

### 文章

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/posts | 获取文章列表 | ❌ |
| GET | /api/posts/:id | 获取文章详情 | ❌ |
| GET | /api/posts/slug/:slug | 根据slug获取文章 | ❌ |
| POST | /api/posts | 创建文章 | ✅ |
| PUT | /api/posts/:id | 更新文章 | ✅ |
| DELETE | /api/posts/:id | 删除文章 | ✅ |
| GET | /api/posts/my | 获取我的文章 | ✅ |

### 分类

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/categories | 获取分类列表 | ❌ |
| GET | /api/categories/:id | 获取分类详情 | ❌ |
| POST | /api/categories | 创建分类 | ✅ Admin |
| PUT | /api/categories/:id | 更新分类 | ✅ Admin |
| DELETE | /api/categories/:id | 删除分类 | ✅ Admin |

### 标签

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/tags | 获取标签列表 | ❌ |
| GET | /api/tags/:id | 获取标签详情 | ❌ |
| POST | /api/tags | 创建标签 | ✅ Admin |
| PUT | /api/tags/:id | 更新标签 | ✅ Admin |
| DELETE | /api/tags/:id | 删除标签 | ✅ Admin |

## 请求示例

### 注册

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "123456",
    "nickname": "管理员"
  }'
```

### 登录

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

### 创建文章

```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "我的第一篇文章",
    "content": "文章内容...",
    "status": "published",
    "category_id": 1,
    "tag_names": ["Go", "博客"]
  }'
```

## 开发

### 代码格式化

```bash
make fmt
```

### 运行测试

```bash
make test
```

## License

MIT







