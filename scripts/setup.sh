#!/bin/bash

# Sakura Blog 项目初始化脚本
# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Sakura Blog 项目初始化脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 Go 是否安装
echo -e "${YELLOW}[1/5] 检查 Go 环境...${NC}"
if command -v go &> /dev/null; then
    GO_VERSION=$(go version)
    echo -e "${GREEN}✓ Go 已安装: $GO_VERSION${NC}"
else
    echo -e "${RED}✗ Go 未安装，请先安装 Go: https://go.dev/dl/${NC}"
    exit 1
fi

# 检查 PostgreSQL 是否安装
echo -e "${YELLOW}[2/5] 检查 PostgreSQL 环境...${NC}"
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✓ PostgreSQL 已安装: $PSQL_VERSION${NC}"
else
    echo -e "${RED}✗ PostgreSQL 未安装${NC}"
    echo -e "${YELLOW}请安装 PostgreSQL: brew install postgresql 或下载安装包${NC}"
    exit 1
fi

# 检查 pnpm 是否安装
echo -e "${YELLOW}[3/5] 检查 pnpm 环境...${NC}"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓ pnpm 已安装: v$PNPM_VERSION${NC}"
else
    echo -e "${YELLOW}pnpm 未安装，正在安装...${NC}"
    npm install -g pnpm
fi

# 安装依赖
echo -e "${YELLOW}[4/5] 安装项目依赖...${NC}"
cd "$(dirname "$0")/.."

echo "安装前端依赖..."
pnpm install

echo "安装 Go 依赖..."
cd apps/backend
export GOPROXY=https://goproxy.cn,direct
go mod tidy
cd ../..

echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 创建数据库
echo -e "${YELLOW}[5/5] 配置数据库...${NC}"
echo -e "${YELLOW}请输入 PostgreSQL 密码来创建数据库（如果数据库已存在会提示错误，可忽略）:${NC}"
psql -U postgres -c "CREATE DATABASE sakura_blog;" 2>/dev/null

# 复制配置文件
if [ ! -f "apps/backend/.env" ]; then
    if [ -f "apps/backend/config.env" ]; then
        cp apps/backend/config.env apps/backend/.env
        echo -e "${GREEN}✓ 已创建 .env 配置文件${NC}"
        echo -e "${YELLOW}请编辑 apps/backend/.env 文件，修改数据库密码等配置${NC}"
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   初始化完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "启动命令："
echo -e "  ${BLUE}pnpm run dev${NC}          - 同时启动前后端（需安装 concurrently）"
echo -e "  ${BLUE}pnpm run dev:frontend${NC} - 仅启动前端"
echo -e "  ${BLUE}pnpm run dev:backend${NC}  - 仅启动后端"
echo ""
echo -e "${YELLOW}注意：首次启动前请确保：${NC}"
echo -e "  1. 已修改 apps/backend/.env 中的数据库密码"
echo -e "  2. PostgreSQL 服务已启动"
echo ""




