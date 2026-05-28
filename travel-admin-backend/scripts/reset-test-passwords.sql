-- 重置测试账号密码为 123456（Spring BCrypt $2a$）
-- mysql -uroot -p travel_demo < reset-test-passwords.sql

SET NAMES utf8mb4;

UPDATE admin_user SET password_hash='$2a$10$huFz0zwNwGljr/eH/isave/XKXOfKwS4Bcp3blLvybcPdodVctX7u', updated_at=NOW() WHERE username='superadmin';
UPDATE admin_user SET password_hash='$2a$10$C3mPHz/jwLcptpZG.9m6M.JiWsbnoi0ltp.35oHCrp2GjzSVb3r3y', updated_at=NOW() WHERE username='director01';
UPDATE admin_user SET password_hash='$2a$10$qsN97moWomS6WJ7488zxc.v/4Cr6/FK9dSVdU1Kcnk4Da/mGV.zlK', updated_at=NOW() WHERE username='sales01';
UPDATE admin_user SET password_hash='$2a$10$qsN97moWomS6WJ7488zxc.v/4Cr6/FK9dSVdU1Kcnk4Da/mGV.zlK', updated_at=NOW() WHERE username='sales02';
