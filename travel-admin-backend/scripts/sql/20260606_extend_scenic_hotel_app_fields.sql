-- 扩展景点/酒店 APP 展示字段
-- 已有数据库执行一次即可；新库初始化已在 init_cms_schema.sql 中包含这些字段。

SET NAMES utf8mb4;

DELIMITER //

CREATE PROCEDURE add_column_if_missing(
  IN table_name_param varchar(64),
  IN column_name_param varchar(64),
  IN column_definition_param text
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_param
      AND COLUMN_NAME = column_name_param
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE `', table_name_param, '` ADD COLUMN `', column_name_param, '` ', column_definition_param);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//

DELIMITER ;

CALL add_column_if_missing('cms_scenic', 'booking_channel', 'text AFTER `price_label`');
CALL add_column_if_missing('cms_scenic', 'opening_hours', 'varchar(255) DEFAULT NULL AFTER `booking_channel`');
CALL add_column_if_missing('cms_scenic', 'checkin_points', 'text AFTER `opening_hours`');

CALL add_column_if_missing('cms_hotel', 'scenic_drive_time', 'varchar(128) DEFAULT NULL AFTER `price_label`');
CALL add_column_if_missing('cms_hotel', 'room_types', 'text AFTER `scenic_drive_time`');
CALL add_column_if_missing('cms_hotel', 'facilities', 'text AFTER `room_types`');

DROP PROCEDURE add_column_if_missing;
