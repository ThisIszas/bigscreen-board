#!/usr/bin/env bash
# ============================================================
# @zl/bigscreen-board 发布脚本(构建 + 版本 + 发布 + 验证一条龙)
#
# 用法:
#   ./release.sh [patch|minor|major] [选项...]
#
# 选项:
#   --registry <url>  发布目标源(默认取环境变量 NPM_REGISTRY, 再默认官方源)
#   --access <mode>   包访问级别 public|restricted(默认 public)
#   --tag <name>      dist-tag(默认 latest)
#   --no-build        跳过构建(默认自动构建)
#   --dry-run         演练模式: 只构建+检查, 不递增版本、不发布
#   --force           跳过 git 工作区检查
#
# 示例:
#   ./release.sh patch                            # 官方源, 版本 +0.0.1
#   ./release.sh minor --tag beta                 # 发布 beta tag
#   ./release.sh patch --registry https://npm.your-company.com/ --access restricted
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

# 保证 node/npm 可用(优先 nvm, 找不到就取任意已装版本)
if ! command -v npm >/dev/null 2>&1; then
  for v in "$HOME/.nvm/versions/node"/*/bin; do
    if [[ -x "$v/npm" ]]; then export PATH="$v:$PATH"; break; fi
  done
fi

LEVEL="${1:-patch}"
shift || true
REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org/}"
ACCESS="public"
TAG="latest"
DO_BUILD=1
DRY_RUN=0
FORCE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --registry) REGISTRY="$2"; shift 2 ;;
    --access)   ACCESS="$2";   shift 2 ;;
    --tag)      TAG="$2";      shift 2 ;;
    --no-build) DO_BUILD=0;    shift ;;
    --dry-run)  DRY_RUN=1;     shift ;;
    --force)    FORCE=1;       shift ;;
    *) echo "未知参数: $1" >&2; exit 1 ;;
  esac
done

case "$LEVEL" in
  patch|minor|major) ;;
  *) echo "版本级别必须是 patch|minor|major" >&2; exit 1 ;;
esac

# 1. git 工作区检查(有未提交/未暂存改动则中止)
if [[ "$FORCE" -eq 0 ]]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "!! 工作区有未提交改动, 发布前请先 commit; 或加 --force 跳过。" >&2
    exit 1
  fi
fi

# 2. 构建 lib(通过 npm run build, 自动使用本地 node_modules)
if [[ "$DO_BUILD" -eq 1 ]]; then
  echo "==> 构建 lib..."
  npm run build
fi

# 3. 版本递增(自动打 git tag + commit)
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "[dry-run] 跳过: npm version $LEVEL"
  echo "[dry-run] 跳过: npm publish --registry $REGISTRY --access $ACCESS --tag $TAG"
  echo ""
  echo "=============================================="
  echo "  ✅ 演练完成(未发布)。正式发布请去掉 --dry-run"
  echo "=============================================="
  exit 0
fi
echo "==> 版本递增: $LEVEL"
npm version "$LEVEL" -m "chore(release): v%s"

# 4. 发布
echo "==> 发布到 $REGISTRY (access=$ACCESS, tag=$TAG)"
npm publish --registry "$REGISTRY" --access "$ACCESS" --tag "$TAG"

# 5. 验证
NEW_VERSION="$(node -p "require('./package.json').version")"
echo ""
echo "=============================================="
echo "  ✅ @zl/bigscreen-board@$NEW_VERSION 发布成功"
echo "=============================================="
npm view "@zl/bigscreen-board@$NEW_VERSION" version dist-tags --registry "$REGISTRY" 2>/dev/null || true