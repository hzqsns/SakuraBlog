package utils

import (
	"regexp"
	"strings"
	"time"
)

// GenerateSlug 根据标题生成slug
func GenerateSlug(title string) string {
	// 转小写
	slug := strings.ToLower(title)

	// 替换空格为连字符
	slug = strings.ReplaceAll(slug, " ", "-")

	// 移除非字母数字和连字符的字符（保留中文）
	reg := regexp.MustCompile(`[^\p{L}\p{N}-]+`)
	slug = reg.ReplaceAllString(slug, "")

	// 移除连续的连字符
	reg = regexp.MustCompile(`-+`)
	slug = reg.ReplaceAllString(slug, "-")

	// 移除开头和结尾的连字符
	slug = strings.Trim(slug, "-")

	// 如果slug为空或太短，添加时间戳
	if len(slug) < 3 {
		slug = slug + "-" + time.Now().Format("20060102150405")
	}

	return slug
}

// GenerateUniqueSlug 生成唯一的slug（带时间戳）
func GenerateUniqueSlug(title string) string {
	baseSlug := GenerateSlug(title)
	timestamp := time.Now().Format("0102150405")
	return baseSlug + "-" + timestamp
}







