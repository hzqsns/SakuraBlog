package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"sakura-blog/internal/config"
	"sakura-blog/internal/database"
	"sakura-blog/internal/model"

	"github.com/joho/godotenv"
)

// FrontMatter 文章前置元数据
type FrontMatter struct {
	Title       string
	Date        string
	Tags        []string
	Category    string
	Excerpt     string
	CoverImage  string
	Author      string
}

func main() {
	// 加载配置
	if err := godotenv.Load(); err != nil {
		if err := godotenv.Load("config.env"); err != nil {
			log.Println("No config file found, using environment variables")
		}
	}

	cfg := config.Load()

	// 连接数据库
	if err := database.Init(&cfg.Database); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 自动迁移
	if err := database.AutoMigrate(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// 初始化种子数据
	database.Seed()

	// 文章目录路径 - 相对于后端目录
	paperDir := "../sakura-frontend/src/paper"

	// 检查目录是否存在
	if _, err := os.Stat(paperDir); os.IsNotExist(err) {
		log.Fatalf("Paper directory not found: %s", paperDir)
	}

	log.Println("Starting article migration...")
	log.Printf("Scanning directory: %s", paperDir)

	// 遍历所有 Markdown 文件
	var totalCount, successCount, skipCount int

	err := filepath.Walk(paperDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// 跳过目录和非 Markdown 文件
		if info.IsDir() || !strings.HasSuffix(strings.ToLower(info.Name()), ".md") {
			return nil
		}

		// 跳过 README 文件
		if strings.ToLower(info.Name()) == "readme.md" {
			return nil
		}

		totalCount++

		// 获取分类（目录名）
		relPath, _ := filepath.Rel(paperDir, path)
		parts := strings.Split(relPath, string(os.PathSeparator))
		categoryName := "未分类"
		if len(parts) > 1 {
			categoryName = parts[0]
		}

		// 读取文件
		content, err := os.ReadFile(path)
		if err != nil {
			log.Printf("Failed to read file %s: %v", path, err)
			return nil
		}

		// 解析文章
		frontMatter, body := parseFrontMatter(string(content))

		// 获取标题
		title := frontMatter.Title
		if title == "" {
			// 从文件名获取标题
			title = strings.TrimSuffix(info.Name(), ".md")
		}

		// 生成 slug
		slug := generateSlug(relPath)

		// 检查是否已存在
		var existingPost model.Post
		if err := database.GetDB().Where("slug = ?", slug).First(&existingPost).Error; err == nil {
			log.Printf("Skipping (already exists): %s", title)
			skipCount++
			return nil
		}

		// 获取或创建分类
		categoryID := getOrCreateCategory(categoryName)

		// 计算字数和阅读时间
		wordCount := utf8.RuneCountInString(body)
		readingTime := fmt.Sprintf("%d分钟", max(1, wordCount/300))

		// 生成摘要
		excerpt := frontMatter.Excerpt
		if excerpt == "" {
			excerpt = generateExcerpt(body, 200)
		}

		// 解析发布日期
		var publishDate *time.Time
		if frontMatter.Date != "" {
			if t, err := time.Parse("2006-01-02", frontMatter.Date); err == nil {
				publishDate = &t
			}
		}
		if publishDate == nil {
			// 使用文件修改时间
			t := info.ModTime()
			publishDate = &t
		}

		// 创建文章
		post := model.Post{
			Title:       title,
			Slug:        slug,
			Content:     body,
			Excerpt:     excerpt,
			CoverImage:  frontMatter.CoverImage,
			Status:      model.PostStatusPublished,
			PublishDate: publishDate,
			CategoryID:  categoryID,
			WordCount:   wordCount,
			ReadingTime: readingTime,
		}

		if err := database.GetDB().Create(&post).Error; err != nil {
			log.Printf("Failed to create post %s: %v", title, err)
			return nil
		}

		// 处理标签
		if len(frontMatter.Tags) > 0 {
			var tags []model.Tag
			for _, tagName := range frontMatter.Tags {
				tag := getOrCreateTag(tagName)
				tags = append(tags, tag)
			}
			database.GetDB().Model(&post).Association("Tags").Replace(tags)
		}

		log.Printf("✓ Imported: %s (Category: %s)", title, categoryName)
		successCount++

		return nil
	})

	if err != nil {
		log.Fatalf("Failed to walk directory: %v", err)
	}

	log.Println("========================================")
	log.Printf("Migration completed!")
	log.Printf("Total files: %d", totalCount)
	log.Printf("Imported: %d", successCount)
	log.Printf("Skipped: %d", skipCount)
	log.Println("========================================")
}

// parseFrontMatter 解析 YAML front matter
func parseFrontMatter(content string) (FrontMatter, string) {
	fm := FrontMatter{}

	// 检查是否有 front matter
	if !strings.HasPrefix(content, "---") {
		return fm, content
	}

	// 找到结束标记
	endIndex := strings.Index(content[3:], "---")
	if endIndex == -1 {
		return fm, content
	}

	frontMatterStr := content[3 : endIndex+3]
	body := strings.TrimSpace(content[endIndex+6:])

	// 简单解析 YAML
	scanner := bufio.NewScanner(strings.NewReader(frontMatterStr))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		// 解析 key: value
		colonIndex := strings.Index(line, ":")
		if colonIndex == -1 {
			continue
		}

		key := strings.TrimSpace(line[:colonIndex])
		value := strings.TrimSpace(line[colonIndex+1:])

		// 移除引号
		value = strings.Trim(value, "\"'")

		switch strings.ToLower(key) {
		case "title":
			fm.Title = value
		case "date", "publishdate", "publish_date":
			fm.Date = value
		case "excerpt", "description", "summary":
			fm.Excerpt = value
		case "cover", "coverimage", "cover_image", "image":
			fm.CoverImage = value
		case "author":
			fm.Author = value
		case "category", "categories":
			fm.Category = value
		case "tags":
			// 解析标签列表
			if strings.HasPrefix(value, "[") {
				// [tag1, tag2] 格式
				value = strings.Trim(value, "[]")
				parts := strings.Split(value, ",")
				for _, p := range parts {
					tag := strings.TrimSpace(strings.Trim(p, "\"'"))
					if tag != "" {
						fm.Tags = append(fm.Tags, tag)
					}
				}
			} else if value != "" {
				fm.Tags = append(fm.Tags, value)
			}
		}
	}

	return fm, body
}

// generateSlug 生成 slug
func generateSlug(relPath string) string {
	// 移除扩展名
	slug := strings.TrimSuffix(relPath, ".md")

	// 替换路径分隔符
	slug = strings.ReplaceAll(slug, string(os.PathSeparator), "-")
	slug = strings.ReplaceAll(slug, "/", "-")

	// 转小写
	slug = strings.ToLower(slug)

	// 替换空格和特殊字符
	reg := regexp.MustCompile(`[^a-z0-9\p{Han}-]+`)
	slug = reg.ReplaceAllString(slug, "-")

	// 移除连续的连字符
	reg = regexp.MustCompile(`-+`)
	slug = reg.ReplaceAllString(slug, "-")

	// 移除开头和结尾的连字符
	slug = strings.Trim(slug, "-")

	return slug
}

// generateExcerpt 生成摘要
func generateExcerpt(content string, maxLen int) string {
	// 移除 Markdown 语法
	content = regexp.MustCompile(`#+ `).ReplaceAllString(content, "")
	content = regexp.MustCompile(`\*+`).ReplaceAllString(content, "")
	content = regexp.MustCompile("`+").ReplaceAllString(content, "")
	content = regexp.MustCompile(`\[([^\]]+)\]\([^)]+\)`).ReplaceAllString(content, "$1")
	content = strings.ReplaceAll(content, "\n", " ")
	content = strings.TrimSpace(content)

	runes := []rune(content)
	if len(runes) <= maxLen {
		return content
	}
	return string(runes[:maxLen]) + "..."
}

// getOrCreateCategory 获取或创建分类
func getOrCreateCategory(name string) uint {
	var category model.Category
	err := database.GetDB().Where("name = ?", name).First(&category).Error
	if err != nil {
		// 创建新分类
		category = model.Category{
			Name: name,
			Slug: strings.ToLower(strings.ReplaceAll(name, " ", "-")),
		}
		database.GetDB().Create(&category)
	}
	return category.ID
}

// getOrCreateTag 获取或创建标签
func getOrCreateTag(name string) model.Tag {
	var tag model.Tag
	err := database.GetDB().Where("name = ?", name).First(&tag).Error
	if err != nil {
		// 创建新标签
		tag = model.Tag{
			Name: name,
			Slug: strings.ToLower(strings.ReplaceAll(name, " ", "-")),
		}
		database.GetDB().Create(&tag)
	}
	return tag
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}




