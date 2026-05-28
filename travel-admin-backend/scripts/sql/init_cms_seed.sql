-- CMS 权限与演示数据
SET NAMES utf8mb4;

INSERT INTO `admin_permission` (`permission_code`, `permission_name`, `description`) VALUES
('cms:view', '查看内容运营', '可查看 CMS 内容'),
('cms:create', '创建内容', '可创建 CMS 内容'),
('cms:update', '编辑内容', '可编辑 CMS 内容'),
('cms:delete', '删除内容', '可删除 CMS 内容'),
('cms:submit', '提交审核', '可提交内容审核'),
('cms:approve', '审核内容', '可通过/下架内容'),
('cms:batch', '批量操作', '可批量操作 CMS')
ON DUPLICATE KEY UPDATE `permission_name` = VALUES(`permission_name`);

INSERT INTO `admin_role_permission` (`admin_role_id`, `admin_permission_id`)
SELECT r.id, p.id FROM admin_role r, admin_permission p
WHERE r.role_code = 'SUPER_ADMIN' AND p.permission_code LIKE 'cms:%'
ON DUPLICATE KEY UPDATE `admin_role_id` = VALUES(`admin_role_id`);

INSERT INTO `admin_role_permission` (`admin_role_id`, `admin_permission_id`)
SELECT r.id, p.id FROM admin_role r, admin_permission p
WHERE r.role_code = 'SENIOR_ADMIN' AND p.permission_code IN ('cms:view','cms:create','cms:update','cms:delete','cms:submit','cms:approve','cms:batch')
ON DUPLICATE KEY UPDATE `admin_role_id` = VALUES(`admin_role_id`);

INSERT INTO `admin_role_permission` (`admin_role_id`, `admin_permission_id`)
SELECT r.id, p.id FROM admin_role r, admin_permission p
WHERE r.role_code = 'SALES' AND p.permission_code IN ('cms:view','cms:create','cms:update','cms:delete','cms:submit','cms:batch')
ON DUPLICATE KEY UPDATE `admin_role_id` = VALUES(`admin_role_id`);

INSERT INTO `cms_city` (`name`, `display_no`, `summary`, `sort_order`, `publish_status`, `created_by_admin_user_id`) VALUES
('北京', '01', '首都文化之旅', 1, 'PUBLISHED', 1),
('西安', '02', '千年古都之旅', 2, 'PUBLISHED', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `cms_about_company` (`id`, `title`, `long_text`, `contact_phone`, `address`, `publish_status`) VALUES
(1, '关于我们', '我们致力于为您提供最地道的国风文旅体验。', '400-000-0000', '北京市朝阳区示例路1号', 'PUBLISHED')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `cms_consultation_config` (`id`, `button_text`, `contact_phone`, `enabled`, `publish_status`) VALUES
(1, '在线咨询', '400-000-0000', 1, 'PUBLISHED')
ON DUPLICATE KEY UPDATE `button_text` = VALUES(`button_text`);
