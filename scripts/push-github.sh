#!/usr/bin/env bash
# 使用 HTTPS + PAT 推送（勿将 token 写入仓库或聊天）。
# 用法：export GITHUB_TOKEN='ghp_你的新令牌' 后执行本脚本。
set -euo pipefail

: "${GITHUB_TOKEN:?请先设置环境变量 GITHUB_TOKEN}"
GITHUB_USER="${GITHUB_USER:-yqsota666}"
REPO="${GITHUB_REPO:-yqsota666/traveldemo}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REMOTE="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${REPO}.git"

git push "$REMOTE" main
git push "$REMOTE" login-auth

echo "[OK] 已推送 main 与 login-auth"
