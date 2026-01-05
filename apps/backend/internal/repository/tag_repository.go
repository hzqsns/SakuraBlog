package repository

import (
	"sakura-blog/internal/database"
	"sakura-blog/internal/model"

	"gorm.io/gorm"
)

type TagRepository struct {
	db *gorm.DB
}

func NewTagRepository() *TagRepository {
	return &TagRepository{db: database.GetDB()}
}

func (r *TagRepository) Create(tag *model.Tag) error {
	return r.db.Create(tag).Error
}

func (r *TagRepository) FindByID(id uint) (*model.Tag, error) {
	var tag model.Tag
	err := r.db.First(&tag, id).Error
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *TagRepository) FindBySlug(slug string) (*model.Tag, error) {
	var tag model.Tag
	err := r.db.Where("slug = ?", slug).First(&tag).Error
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *TagRepository) FindByName(name string) (*model.Tag, error) {
	var tag model.Tag
	err := r.db.Where("name = ?", name).First(&tag).Error
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *TagRepository) FindByIDs(ids []uint) ([]model.Tag, error) {
	var tags []model.Tag
	err := r.db.Where("id IN ?", ids).Find(&tags).Error
	return tags, err
}

func (r *TagRepository) FindOrCreateByNames(names []string) ([]model.Tag, error) {
	var tags []model.Tag
	for _, name := range names {
		var tag model.Tag
		err := r.db.Where("name = ?", name).First(&tag).Error
		if err == gorm.ErrRecordNotFound {
			// 创建新标签
			tag = model.Tag{
				Name: name,
				Slug: name, // 简化处理，可以用utils.GenerateSlug
			}
			if err := r.db.Create(&tag).Error; err != nil {
				return nil, err
			}
		} else if err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}
	return tags, nil
}

func (r *TagRepository) Update(tag *model.Tag) error {
	return r.db.Save(tag).Error
}

func (r *TagRepository) Delete(id uint) error {
	return r.db.Delete(&model.Tag{}, id).Error
}

func (r *TagRepository) List() ([]model.Tag, error) {
	var tags []model.Tag
	err := r.db.Find(&tags).Error
	return tags, err
}

func (r *TagRepository) ListWithPostCount() ([]model.Tag, error) {
	var tags []model.Tag
	err := r.db.Find(&tags).Error
	if err != nil {
		return nil, err
	}

	// 获取每个标签的文章数量
	for i := range tags {
		var count int64
		r.db.Table("post_tags").
			Joins("JOIN posts ON posts.id = post_tags.post_id").
			Where("post_tags.tag_id = ? AND posts.status = ? AND posts.deleted_at IS NULL", tags[i].ID, "published").
			Count(&count)
		tags[i].PostCount = int(count)
	}

	return tags, nil
}

func (r *TagRepository) ExistsByName(name string) bool {
	var count int64
	r.db.Model(&model.Tag{}).Where("name = ?", name).Count(&count)
	return count > 0
}

func (r *TagRepository) ExistsBySlug(slug string) bool {
	var count int64
	r.db.Model(&model.Tag{}).Where("slug = ?", slug).Count(&count)
	return count > 0
}







