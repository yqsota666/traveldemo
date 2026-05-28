#!/usr/bin/env bash
# 全链路内容读取测试
set -uo pipefail

ADMIN_BASE="http://127.0.0.1:8091"
TRAVEL_BASE="http://127.0.0.1:8080"
TOKEN="travel-internal-cms-token"
PASS=0
FAIL=0

ok() { echo "[PASS] $*"; PASS=$((PASS+1)); }
fail() { echo "[FAIL] $*"; FAIL=$((FAIL+1)); }

check_http() {
  local name="$1"
  local url="$2"
  local expect_code="${3:-200}"
  local extra_header="${4:-}"
  local resp_file="/tmp/resp-$$-${RANDOM}.json"
  local cmd=(curl -s -o "$resp_file" -w "%{http_code}" "$url")
  if [[ -n "$extra_header" ]]; then
    cmd+=(-H "$extra_header")
  fi
  local code
  code=$("${cmd[@]}" 2>/dev/null || echo "000")
  local body
  body=$(cat "$resp_file" 2>/dev/null || echo "")
  rm -f "$resp_file"
  if [[ "$code" == "$expect_code" ]]; then
    if echo "$body" | grep -q '"status":200'; then
      ok "$name (HTTP $code, status=200)"
      return 0
    elif [[ "$expect_code" != "200" ]]; then
      ok "$name (HTTP $code)"
      return 0
    else
      fail "$name HTTP $code but status!=200: $(echo "$body" | head -c 120)"
      return 1
    fi
  else
    fail "$name expected HTTP $expect_code got $code: $(echo "$body" | head -c 120)"
    return 1
  fi
}

echo "========== 1. 端口与健康 =========="
for port in 3306 8091 8080 5174; do
  if ss -tln | grep -q ":$port "; then
    ok "端口 $port 监听中"
  else
    fail "端口 $port 未监听"
  fi
done

echo ""
echo "========== 2. Admin 内部只读 API (8091) =========="
check_http "internal cities" "$ADMIN_BASE/api/internal/cms/cities?page=1&pageSize=10" 200 "X-Internal-Token: $TOKEN"
check_http "internal cities by-name 北京" "$ADMIN_BASE/api/internal/cms/cities/by-name?name=%E5%8C%97%E4%BA%AC" 200 "X-Internal-Token: $TOKEN"
check_http "internal banners" "$ADMIN_BASE/api/internal/cms/banners" 200 "X-Internal-Token: $TOKEN"
check_http "internal scenics" "$ADMIN_BASE/api/internal/cms/scenics" 200 "X-Internal-Token: $TOKEN"
check_http "internal hotels" "$ADMIN_BASE/api/internal/cms/hotels" 200 "X-Internal-Token: $TOKEN"
check_http "internal car-rentals" "$ADMIN_BASE/api/internal/cms/car-rentals" 200 "X-Internal-Token: $TOKEN"
check_http "internal products" "$ADMIN_BASE/api/internal/cms/products" 200 "X-Internal-Token: $TOKEN"
check_http "internal guides" "$ADMIN_BASE/api/internal/cms/guides" 200 "X-Internal-Token: $TOKEN"
check_http "internal cases XHS" "$ADMIN_BASE/api/internal/cms/cases?caseType=XHS" 200 "X-Internal-Token: $TOKEN"
check_http "internal trip-reminders" "$ADMIN_BASE/api/internal/cms/trip-reminders" 200 "X-Internal-Token: $TOKEN"
check_http "internal about" "$ADMIN_BASE/api/internal/cms/about/company" 200 "X-Internal-Token: $TOKEN"
check_http "internal consultation" "$ADMIN_BASE/api/internal/cms/consultation" 200 "X-Internal-Token: $TOKEN"

echo ""
echo "========== 3. 内部 API 安全（无 token 应 401） =========="
code=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_BASE/api/internal/cms/cities")
if [[ "$code" == "401" ]]; then ok "internal 无 token 返回 401"; else fail "internal 无 token 期望 401 实际 $code"; fi

echo ""
echo "========== 4. Travel C 端内容 API (8080) =========="
check_http "travel cities" "$TRAVEL_BASE/api/travel/content/cities"
check_http "travel cities v1 alias" "$TRAVEL_BASE/v1/api/travel/content/cities"
check_http "travel banners" "$TRAVEL_BASE/api/travel/content/banners"
check_http "travel scenics recommended" "$TRAVEL_BASE/api/travel/content/scenics?recommended=true"
check_http "travel hotels cityId=1" "$TRAVEL_BASE/api/travel/content/hotels?cityId=1"
check_http "travel products" "$TRAVEL_BASE/api/travel/content/products?cityId=1"
check_http "travel guides" "$TRAVEL_BASE/api/travel/content/guides"
check_http "travel cases" "$TRAVEL_BASE/api/travel/content/cases?caseType=WECHAT"
check_http "travel trip-reminders" "$TRAVEL_BASE/api/travel/content/trip-reminders"
check_http "travel about" "$TRAVEL_BASE/api/travel/content/about/company"
check_http "travel consultation" "$TRAVEL_BASE/api/travel/content/consultation"
check_http "travel city by name" "$TRAVEL_BASE/api/travel/content/cities/by-name?name=%E8%A5%BF%E5%AE%89"

echo ""
echo "========== 5. 链路一致性（admin internal vs travel） =========="
curl -s -H "X-Internal-Token: $TOKEN" "$ADMIN_BASE/api/internal/cms/cities?page=1&pageSize=2" > /tmp/admin_cities.json
curl -s "$TRAVEL_BASE/api/travel/content/cities?page=1&pageSize=2" > /tmp/travel_cities.json
admin_names=$(python3 -c "import json;d=json.load(open('/tmp/admin_cities.json'));print(','.join([r['name'] for r in d['result']['records']]))" 2>/dev/null || echo "")
travel_names=$(python3 -c "import json;d=json.load(open('/tmp/travel_cities.json'));print(','.join([r['name'] for r in d['result']['records']]))" 2>/dev/null || echo "")
if [[ "$admin_names" == "$travel_names" && -n "$admin_names" ]]; then
  ok "城市列表一致: $admin_names"
else
  fail "城市列表不一致 admin=[$admin_names] travel=[$travel_names]"
fi

echo ""
echo "========== 6. 管理后台登录与 CMS 管理 API =========="
login_resp=$(curl -s -X POST "$ADMIN_BASE/api/admin/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"123456"}')
token=$(python3 -c "import json;d=json.load(open(0));print(d.get('result',{}).get('accessToken',''))" <<< "$login_resp" 2>/dev/null || echo "")
if [[ -n "$token" ]]; then
  ok "管理后台 superadmin 登录成功"
  code=$(curl -s -o /tmp/cms_admin.json -w "%{http_code}" \
    -H "Authorization: Bearer $token" \
    "$ADMIN_BASE/api/admin/v1/cms/cities?page=1&pageSize=5")
  if [[ "$code" == "200" ]]; then ok "管理端 CMS cities 列表"; else fail "管理端 CMS cities HTTP $code"; fi
else
  fail "管理后台登录失败: $(echo "$login_resp" | head -c 150)"
fi

echo ""
echo "========== 7. Travel 认证接口 =========="
code=$(curl -s -o /dev/null -w "%{http_code}" "$TRAVEL_BASE/api/test/ping")
if [[ "$code" == "200" ]]; then ok "travel auth ping (HTTP 200)"; else fail "travel auth ping HTTP $code"; fi

echo ""
echo "========== 汇总 =========="
echo "通过: $PASS  失败: $FAIL"
if [[ "$FAIL" -eq 0 ]]; then
  echo "全链路测试通过"
  exit 0
else
  echo "存在失败项，请检查上方日志"
  exit 1
fi
