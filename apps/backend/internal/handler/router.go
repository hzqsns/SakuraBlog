package handler

import (
	"sakura-blog/internal/config"
	"sakura-blog/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	// 设置Gin模式
	gin.SetMode(cfg.Server.Mode)

	r := gin.Default()

	// 中间件
	r.Use(middleware.CORSMiddleware(cfg.CORS.Origins))

	// 初始化handlers
	postHandler := NewPostHandler()
	categoryHandler := NewCategoryHandler()
	tagHandler := NewTagHandler()

	// API路由组
	api := r.Group("/api")
	{
		// 健康检查
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok", "message": "Sakura Blog API is running"})
		})

		// 文章路由 - 无需认证
		posts := api.Group("/posts")
		{
			posts.GET("", postHandler.List)
			posts.GET("/:id", postHandler.GetByID)
			posts.GET("/slug/:slug", postHandler.GetBySlug)
			posts.POST("", postHandler.Create)
			posts.PUT("/:id", postHandler.Update)
			posts.DELETE("/:id", postHandler.Delete)
		}

		// 分类路由 - 无需认证
		categories := api.Group("/categories")
		{
			categories.GET("", categoryHandler.List)
			categories.GET("/:id", categoryHandler.GetByID)
			categories.POST("", categoryHandler.Create)
			categories.PUT("/:id", categoryHandler.Update)
			categories.DELETE("/:id", categoryHandler.Delete)
		}

		// 标签路由 - 无需认证
		tags := api.Group("/tags")
		{
			tags.GET("", tagHandler.List)
			tags.GET("/:id", tagHandler.GetByID)
			tags.POST("", tagHandler.Create)
			tags.PUT("/:id", tagHandler.Update)
			tags.DELETE("/:id", tagHandler.Delete)
		}

		// 后台管理路由
		admin := api.Group("/admin")
		{
			// 统计信息
			admin.GET("/stats", func(c *gin.Context) {
				c.JSON(200, gin.H{
					"posts":      0,
					"categories": 0,
					"tags":       0,
				})
			})
		}
	}

	return r
}
