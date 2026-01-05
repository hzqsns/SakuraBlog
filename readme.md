# Sakura Blog 🌸

一个基于 React + Go + PostgreSQL 的前后端分离博客系统。

## 技术栈

- **前端**: React 18 + TypeScript + Vite + TailwindCSS
- **后端**: Go + Gin + GORM
- **数据库**: PostgreSQL

## 项目结构

```
SakuraBlog/
├── apps/
│   ├── sakura-frontend/    # React 前端
│   └── backend/            # Go 后端
├── scripts/                # 启动脚本
├── package.json            # 项目配置
└── readme.md
```

## 快速开始

### 1. 环境要求

- Node.js 18+
- pnpm
- Go 1.21+
- PostgreSQL 15+

### 2. 创建数据库

使用 PostgreSQL 客户端（如 pgAdmin 或命令行）创建数据库：

```sql
CREATE DATABASE sakura_blog;
```

### 3. 配置后端

编辑 `apps/backend/config.env` 文件，修改数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=你的数据库用户名
DB_PASSWORD=你的数据库密码
DB_NAME=sakura_blog
```

### 4. 安装依赖

```bash
# 在项目根目录执行
pnpm install

# 安装 Go 依赖
cd apps/backend
go mod tidy
cd ../..
```

### 5. 启动项目

**方式一：同时启动前后端**

```bash
pnpm run dev
```

**方式二：分别启动**

```bash
# 终端 1 - 启动后端
pnpm run dev:backend

# 终端 2 - 启动前端
pnpm run dev:frontend
```

**方式三：使用脚本启动**

```bash
./scripts/start.sh
```

### 6. 访问项目

- 前端: http://localhost:5173
- 后端 API: http://localhost:8080/api
- 健康检查: http://localhost:8080/api/health

## 可用命令

| 命令 | 描述 |
|------|------|
| `pnpm run dev` | 同时启动前后端 |
| `pnpm run dev:frontend` | 仅启动前端 |
| `pnpm run dev:backend` | 仅启动后端 |
| `pnpm run build:frontend` | 构建前端 |
| `pnpm run build:backend` | 构建后端 |

## API 文档

### 认证

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |

### 用户

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/user/profile | 获取当前用户信息 | ✅ |
| PUT | /api/user/profile | 更新用户信息 | ✅ |
| PUT | /api/user/password | 修改密码 | ✅ |

### 文章

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/posts | 文章列表 | ❌ |
| GET | /api/posts/:id | 文章详情 | ❌ |
| GET | /api/posts/slug/:slug | 根据slug获取文章 | ❌ |
| POST | /api/posts | 创建文章 | ✅ |
| PUT | /api/posts/:id | 更新文章 | ✅ |
| DELETE | /api/posts/:id | 删除文章 | ✅ |
| GET | /api/posts/my | 获取我的文章 | ✅ |

### 分类和标签

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/categories | 分类列表 |
| GET | /api/tags | 标签列表 |

## 注意事项

1. 首次启动后端时会自动创建数据库表和默认数据
2. 第一个注册的用户默认是普通用户，如需管理员权限请手动修改数据库中的 `role` 字段为 `admin`
3. JWT Token 有效期默认为 72 小时

## License

MIT




