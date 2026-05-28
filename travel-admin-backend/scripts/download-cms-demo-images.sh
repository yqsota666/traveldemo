#!/usr/bin/env bash
# 下载内容运营演示图片到 uploads/cms/（使用 picsum 占位图，稳定可访问）
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)/uploads/cms"
mkdir -p "$DIR"

download() {
  local name="$1"
  local seed="$2"
  local w="${3:-800}"
  local h="${4:-600}"
  if [[ ! -f "$DIR/$name" ]]; then
    echo ">>> $name"
    curl -fsSL "https://picsum.photos/seed/${seed}/${w}/${h}.jpg" -o "$DIR/$name"
  else
    echo ">>> skip $name (exists)"
  fi
}

download beijing-city.jpg travel-bj-city 800 500
download xian-city.jpg travel-xa-city 800 500
download banner-beijing-1.jpg travel-banner-bj1 1200 600
download banner-beijing-2.jpg travel-banner-bj2 1200 600
download banner-xian-1.jpg travel-banner-xa1 1200 600
download scenic-forbidden.jpg travel-scenic-1 600 400
download scenic-greatwall.jpg travel-scenic-2 600 400
download scenic-terracotta.jpg travel-scenic-3 600 400
download scenic-wildgoose.jpg travel-scenic-4 600 400
download hotel-1.jpg travel-hotel-1 600 400
download hotel-2.jpg travel-hotel-2 600 400
download car-rental-1.jpg travel-car-1 600 400
download product-1.jpg travel-product-1 600 400
download product-2.jpg travel-product-2 600 400
download product-3.jpg travel-product-3 600 400
download guide-1.jpg travel-guide-1 200 200
download guide-2.jpg travel-guide-2 200 200
download case-xhs.jpg travel-case-xhs 600 400
download case-wechat.jpg travel-case-wx 600 400
download about-cover.jpg travel-about 800 500
download consult-qrcode.jpg travel-qr 300 300

echo "[OK] 图片已保存到 $DIR ($(ls -1 "$DIR" | wc -l) 个文件)"
