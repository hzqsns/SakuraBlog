#!/bin/bash

# Sakura Blog 启动脚本
# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Sakura Blog 启动中...${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

cd "$(dirname "$0")/.."

# 检查 .env 文件
if [ ! -f "apps/backend/.env" ]; then
    if [ -f "apps/backend/config.env" ]; then
        cp apps/backend/config.env apps/backend/.env
        echo -e "${YELLOW}已自动创建 .env 文件，请检查数据库配置${NC}"
    else
        echo -e "${YELLOW}警告：未找到 .env 配置文件${NC}"
    fi
fi

# 启动后端
echo -e "${GREEN}启动后端服务...${NC}"
cd apps/backend
export GOPROXY=https://goproxy.cn,direct

# 后台启动后端
go run ./cmd/server &
BACKEND_PID=$!

cd ../..

# 等待后端启动
sleep 2

# 启动前端
echo -e "${GREEN}启动前端服务...${NC}"
cd apps/sakura-frontend
pnpm dev &
FRONTEND_PID=$!

cd ../..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   服务已启动！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  前端: ${BLUE}http://localhost:5173${NC}"
echo -e "  后端: ${BLUE}http://localhost:8080${NC}"
echo -e "  API:  ${BLUE}http://localhost:8080/api${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
echo ""

# 捕获退出信号
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# 等待子进程
wait




