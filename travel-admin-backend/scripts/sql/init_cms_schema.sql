-- 内容运营 CMS 表结构
-- 执行顺序：init_admin_schema.sql -> init_cms_schema.sql -> init_cms_seed.sql

SET NAMES utf8mb4;

-- 城市
CREATE TABLE IF NOT EXISTS `cms_city` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `display_no` varchar(16) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `summary` varchar(512) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cms_city_name` (`name`, `deleted_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 轮播图
CREATE TABLE IF NOT EXISTS `cms_banner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `image_url` varchar(512) NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_banner_city` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 景点
CREATE TABLE IF NOT EXISTS `cms_scenic` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint NOT NULL,
  `title` varchar(128) NOT NULL,
  `summary` varchar(512) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `gallery_images` text,
  `tags` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price_label` varchar(64) DEFAULT NULL,
  `booking_channel` text,
  `opening_hours` varchar(255) DEFAULT NULL,
  `checkin_points` text,
  `notice` text,
  `home_recommended` tinyint NOT NULL DEFAULT 0,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_scenic_city` (`city_id`),
  KEY `idx_cms_scenic_recommend` (`home_recommended`, `publish_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 住宿
CREATE TABLE IF NOT EXISTS `cms_hotel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint NOT NULL,
  `title` varchar(128) NOT NULL,
  `summary` varchar(512) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `gallery_images` text,
  `tags` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price_label` varchar(64) DEFAULT NULL,
  `scenic_drive_time` varchar(128) DEFAULT NULL,
  `room_types` text,
  `facilities` text,
  `notice` text,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_hotel_city` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 租车
CREATE TABLE IF NOT EXISTS `cms_car_rental` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint NOT NULL,
  `title` varchar(128) NOT NULL,
  `summary` varchar(512) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `gallery_images` text,
  `tags` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price_label` varchar(64) DEFAULT NULL,
  `notice` text,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_car_city` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文创商品
CREATE TABLE IF NOT EXISTS `cms_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint DEFAULT NULL,
  `title` varchar(128) NOT NULL,
  `summary` varchar(512) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `gallery_images` text,
  `price` decimal(10,2) DEFAULT NULL,
  `external_link` varchar(512) DEFAULT NULL,
  `home_recommended` tinyint NOT NULL DEFAULT 0,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_product_city` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 讲解员
CREATE TABLE IF NOT EXISTS `cms_guide` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `years_experience` int DEFAULT NULL,
  `intro` text,
  `quote_text` varchar(255) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 案例/截图（XHS / WECHAT / OTHER）
CREATE TABLE IF NOT EXISTS `cms_media_case` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint DEFAULT NULL,
  `case_type` varchar(32) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `gallery_images` text,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_case_type` (`case_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 行程提醒
CREATE TABLE IF NOT EXISTS `cms_trip_reminder` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint DEFAULT NULL,
  `title` varchar(128) NOT NULL,
  `weather_hint` varchar(128) DEFAULT NULL,
  `content` text,
  `sort_order` int NOT NULL DEFAULT 0,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `deleted_flag` tinyint NOT NULL DEFAULT 0,
  `created_by_admin_user_id` bigint DEFAULT NULL,
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 公司简介（单条，id=1）
CREATE TABLE IF NOT EXISTS `cms_about_company` (
  `id` bigint NOT NULL DEFAULT 1,
  `title` varchar(128) DEFAULT NULL,
  `logo_url` varchar(512) DEFAULT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `long_text` text,
  `contact_phone` varchar(32) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 在线咨询配置（单条，id=1）
CREATE TABLE IF NOT EXISTS `cms_consultation_config` (
  `id` bigint NOT NULL DEFAULT 1,
  `button_text` varchar(64) DEFAULT '在线咨询',
  `contact_phone` varchar(32) DEFAULT NULL,
  `qrcode_image_url` varchar(512) DEFAULT NULL,
  `enabled` tinyint NOT NULL DEFAULT 1,
  `publish_status` varchar(32) NOT NULL DEFAULT 'DRAFT',
  `updated_by_admin_user_id` bigint DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by_admin_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 内容审核日志
CREATE TABLE IF NOT EXISTS `cms_approval_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content_type` varchar(64) NOT NULL,
  `content_id` bigint NOT NULL,
  `action` varchar(32) NOT NULL,
  `from_status` varchar(32) DEFAULT NULL,
  `to_status` varchar(32) DEFAULT NULL,
  `comment` varchar(512) DEFAULT NULL,
  `operator_admin_user_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cms_approval_content` (`content_type`, `content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
