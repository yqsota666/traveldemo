-- 内容运营完整演示数据（均已上架 PUBLISHED，含图片路径 /uploads/cms/*）
-- 先执行: bash scripts/download-cms-demo-images.sh
-- 再执行: mysql -uroot -proot travel_demo < scripts/sql/init_cms_demo_content.sql

SET NAMES utf8mb4;

-- 城市封面
UPDATE `cms_city` SET
  `cover_image` = '/uploads/cms/beijing-city.jpg',
  `summary` = '故宫、长城、胡同文化，感受千年帝都风韵',
  `publish_status` = 'PUBLISHED',
  `approved_at` = NOW(),
  `approved_by_admin_user_id` = 1
WHERE `id` = 1 AND `name` = '北京';

UPDATE `cms_city` SET
  `cover_image` = '/uploads/cms/xian-city.jpg',
  `summary` = '兵马俑、大雁塔、古城墙，探寻十三朝古都',
  `publish_status` = 'PUBLISHED',
  `approved_at` = NOW(),
  `approved_by_admin_user_id` = 1
WHERE `id` = 2 AND `name` = '西安';

-- 轮播图
INSERT INTO `cms_banner` (`city_id`, `title`, `image_url`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, '北京·故宫秋色', '/uploads/cms/banner-beijing-1.jpg', 1, 'PUBLISHED', 1, NOW(), 1),
(1, '北京·长城日出', '/uploads/cms/banner-beijing-2.jpg', 2, 'PUBLISHED', 1, NOW(), 1),
(2, '西安·古城夜色', '/uploads/cms/banner-xian-1.jpg', 1, 'PUBLISHED', 1, NOW(), 1);

-- 景点（含首页推荐）
INSERT INTO `cms_scenic` (`city_id`, `title`, `summary`, `cover_image`, `gallery_images`, `tags`, `address`, `price_label`, `booking_channel`, `opening_hours`, `checkin_points`, `notice`, `home_recommended`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, '故宫博物院', '世界文化遗产，明清两代皇宫', '/uploads/cms/scenic-forbidden.jpg',
 '["/uploads/cms/scenic-forbidden.jpg","/uploads/cms/banner-beijing-1.jpg"]',
 '5A景区,必打卡', '北京市东城区景山前街4号', '门票约60元起', '故宫博物院官方小程序/官网预约购票', '08:30-17:00（周一闭馆，以官方公告为准）', '午门、太和殿、角楼、神武门', '请提前预约，携带身份证件', 1, 1, 'PUBLISHED', 1, NOW(), 1),
(1, '八达岭长城', '不到长城非好汉', '/uploads/cms/scenic-greatwall.jpg',
 '["/uploads/cms/scenic-greatwall.jpg"]',
 '5A景区,世界遗产', '北京市延庆区', '门票约40元起', '八达岭长城官方平台/现场窗口', '08:00-17:00（季节调整以官方公告为准）', '北八楼、好汉碑、关城入口', '建议穿舒适运动鞋', 1, 2, 'PUBLISHED', 1, NOW(), 1),
(2, '秦始皇兵马俑', '世界第八大奇迹', '/uploads/cms/scenic-terracotta.jpg',
 '["/uploads/cms/scenic-terracotta.jpg"]',
 '5A景区,历史', '西安市临潼区', '门票约120元起', '秦始皇帝陵博物院官方渠道预约', '08:30-18:00（以景区公告为准）', '一号坑、铜车马展厅、三号坑', '建议请讲解员', 1, 1, 'PUBLISHED', 1, NOW(), 1),
(2, '大雁塔', '唐代佛教建筑艺术瑰宝', '/uploads/cms/scenic-wildgoose.jpg',
 '["/uploads/cms/scenic-wildgoose.jpg"]',
 '4A景区,夜景', '西安市雁塔区', '免费入园（登塔另收费）', '大慈恩寺/大雁塔官方渠道购票', '09:00-17:30（以景区公告为准）', '大雁塔北广场、音乐喷泉、大慈恩寺', '夜间音乐喷泉值得一看', 0, 2, 'PUBLISHED', 1, NOW(), 1);

-- 住宿
INSERT INTO `cms_hotel` (`city_id`, `title`, `summary`, `cover_image`, `gallery_images`, `tags`, `address`, `price_label`, `scenic_drive_time`, `room_types`, `facilities`, `notice`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, '胡同精品客栈', '步行可达南锣鼓巷，体验老北京生活', '/uploads/cms/hotel-1.jpg',
 '["/uploads/cms/hotel-1.jpg"]', '精品,四合院', '北京市东城区', '约¥580/晚起', '距故宫约15分钟车程', '庭院大床房、亲子套房、精品双床房', '早餐、接送机、洗衣、行李寄存、门票代订', '含早餐，可代订门票', 1, 'PUBLISHED', 1, NOW(), 1),
(2, '城墙观景酒店', '俯瞰古城墙，交通便捷', '/uploads/cms/hotel-2.jpg',
 '["/uploads/cms/hotel-2.jpg"]', '观景,亲子', '西安市碑林区', '约¥420/晚起', '距大雁塔约20分钟车程', '城墙景观房、家庭房、商务双床房', '早餐、免费接站、健身房、儿童用品、行李寄存', '提供免费接站（需预约）', 2, 'PUBLISHED', 1, NOW(), 1);

-- 租车
INSERT INTO `cms_car_rental` (`city_id`, `title`, `summary`, `cover_image`, `gallery_images`, `tags`, `address`, `price_label`, `notice`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, '商务七座包车', '机场接送、一日游专线，司机熟悉景点路线', '/uploads/cms/car-rental-1.jpg',
 '["/uploads/cms/car-rental-1.jpg"]', '包车,七座', '北京市区上门接送', '约¥800/天起', '含司机，油费另计', 1, 'PUBLISHED', 1, NOW(), 1),
(2, '古城休闲自驾', '新能源轿车，适合城墙周边自由行', '/uploads/cms/car-rental-1.jpg',
 '["/uploads/cms/car-rental-1.jpg"]', '自驾,新能源', '西安北站租车点', '约¥260/天起', '需持有效驾照', 2, 'PUBLISHED', 1, NOW(), 1);

-- 文创商品
INSERT INTO `cms_product` (`city_id`, `title`, `summary`, `cover_image`, `gallery_images`, `price`, `external_link`, `home_recommended`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(NULL, '国风手账本', '宣纸内页，刺绣封面，旅行记录首选', '/uploads/cms/product-1.jpg',
 '["/uploads/cms/product-1.jpg"]', 68.00, NULL, 1, 1, 'PUBLISHED', 1, NOW(), 1),
(1, '故宫文创书签套装', '经典纹样，礼盒装', '/uploads/cms/product-2.jpg',
 '["/uploads/cms/product-2.jpg"]', 128.00, NULL, 1, 2, 'PUBLISHED', 1, NOW(), 1),
(2, '兵马俑纪念摆件', '工艺复原，适合伴手礼', '/uploads/cms/product-3.jpg',
 '["/uploads/cms/product-3.jpg"]', 198.00, NULL, 0, 3, 'PUBLISHED', 1, NOW(), 1);

-- 讲解员
INSERT INTO `cms_guide` (`city_id`, `name`, `avatar_url`, `years_experience`, `intro`, `quote_text`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, '李老师', '/uploads/cms/guide-1.jpg', 12, '国家高级导游，擅长明清历史与建筑讲解。', '走进故宫，每一砖一瓦都有故事。', 1, 'PUBLISHED', 1, NOW(), 1),
(2, '王老师', '/uploads/cms/guide-2.jpg', 8, '陕西历史博物馆特约讲解，兵马俑深度游专家。', '让历史在脚下复活。', 2, 'PUBLISHED', 1, NOW(), 1);

-- 案例截图
INSERT INTO `cms_media_case` (`city_id`, `case_type`, `title`, `cover_image`, `gallery_images`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, 'XHS', '小红书·北京攻略爆款笔记', '/uploads/cms/case-xhs.jpg',
 '["/uploads/cms/case-xhs.jpg"]', 1, 'PUBLISHED', 1, NOW(), 1),
(2, 'WECHAT', '微信群·西安深度游分享', '/uploads/cms/case-wechat.jpg',
 '["/uploads/cms/case-wechat.jpg"]', 1, 'PUBLISHED', 1, NOW(), 1);

-- 行程提醒
INSERT INTO `cms_trip_reminder` (`city_id`, `title`, `weather_hint`, `content`, `sort_order`, `publish_status`, `created_by_admin_user_id`, `approved_at`, `approved_by_admin_user_id`)
VALUES
(1, '北京出行提醒', '晴 18~28℃', '① 故宫需提前1-7天预约\n② 长城风大，备一件外套\n③ 地铁出行优先，避开早晚高峰', 1, 'PUBLISHED', 1, NOW(), 1),
(2, '西安出行提醒', '多云 15~26℃', '① 兵马俑建议错峰（下午场）\n② 城墙骑行注意防晒\n③ 回民街美食适量，备肠胃药', 2, 'PUBLISHED', 1, NOW(), 1),
(NULL, '通用证件提醒', NULL, '请携带身份证原件；儿童出示户口本或出生证明。', 3, 'PUBLISHED', 1, NOW(), 1);

-- 关于我们 / 咨询（配图）
UPDATE `cms_about_company` SET
  `title` = '关于我们',
  `logo_url` = '/uploads/cms/about-cover.jpg',
  `cover_image` = '/uploads/cms/about-cover.jpg',
  `long_text` = '我们致力于为您提供最地道的国风文旅体验。从行程规划、精品住宿到专属讲解，一站式定制您的文化之旅。十年深耕北京、西安等经典目的地，已服务超过 10 万旅客。',
  `contact_phone` = '400-888-6688',
  `address` = '北京市朝阳区国风文旅大厦 8 层',
  `publish_status` = 'PUBLISHED',
  `approved_at` = NOW(),
  `approved_by_admin_user_id` = 1
WHERE `id` = 1;

UPDATE `cms_consultation_config` SET
  `button_text` = '在线咨询',
  `contact_phone` = '400-888-6688',
  `qrcode_image_url` = '/uploads/cms/consult-qrcode.jpg',
  `enabled` = 1,
  `publish_status` = 'PUBLISHED',
  `approved_at` = NOW(),
  `approved_by_admin_user_id` = 1
WHERE `id` = 1;
