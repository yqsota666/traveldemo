-- 开通销售顾问02 + 3 笔归属订单（便于前台验证工作台/订单列表隔离）
-- 用法: mysql -uroot -proot travel_demo < travel-admin-backend/scripts/seed-sales02-demo.sql

SET NAMES utf8mb4;

-- 销售顾问02（密码与 sales01 相同，执行 reset-test-passwords.sql 后为 123456）
INSERT INTO `admin_user` (`id`, `username`, `password_hash`, `real_name`, `phone`, `status`, `created_at`, `updated_at`)
VALUES (4, 'sales02', '$2a$10$qsN97moWomS6WJ7488zxc.v/4Cr6/FK9dSVdU1Kcnk4Da/mGV.zlK', '销售顾问02', '13800000003', 'ENABLED', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `real_name` = VALUES(`real_name`),
  `phone` = VALUES(`phone`),
  `status` = 'ENABLED',
  `updated_at` = NOW();

INSERT INTO `admin_user_role` (`admin_user_id`, `admin_role_id`, `created_at`)
VALUES (4, 3, NOW())
ON DUPLICATE KEY UPDATE `admin_role_id` = VALUES(`admin_role_id`);

-- 客户归属（工作台「客户归属」卡片）
INSERT INTO `sales_customer_binding` (`sales_admin_user_id`, `customer_name`, `customer_phone`, `assigned_by_admin_user_id`, `created_at`)
VALUES
(4, '王先生', '13900000011', 4, NOW()),
(4, '赵女士', '13900000012', 4, NOW());

-- 3 笔旅游订单，均归属 sales02（sales_admin_user_id = 4）
INSERT INTO `travel_order` (`order_no`, `customer_name`, `customer_phone`, `destination_city`, `travel_date`, `traveler_count`, `total_amount`, `order_status`, `sales_admin_user_id`, `created_by_admin_user_id`, `deleted_flag`, `created_at`, `updated_at`)
VALUES
('TRAVEL20260520003', '王先生', '13900000011', '上海', '2026-08-10', 2, 6880.00, 'PENDING', 4, 4, 0, NOW(), NOW()),
('TRAVEL20260520004', '赵女士', '13900000012', '成都', '2026-09-01', 3, 8520.00, 'CONFIRMED', 4, 4, 0, NOW(), NOW()),
('TRAVEL20260520005', '周先生', '13900000013', '杭州', '2026-10-15', 1, 3680.00, 'PENDING', 4, 4, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `sales_admin_user_id` = 4,
  `created_by_admin_user_id` = 4,
  `updated_at` = NOW();
