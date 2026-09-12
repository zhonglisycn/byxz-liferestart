#!/usr/bin/env bash
# 一键构建：内容校验 → 内核测试 → 页面静态检查 → 编译 → 输出 .bin
set -e
cd "$(dirname "$0")/.."

NAME="人生重开修仙_byxz"

echo "=== 1/5 内容结构校验 ==="
node tools/validate-content.mjs

echo ""
echo "=== 2/5 内核测试 ==="
bash tools/run-tests.sh

echo ""
echo "=== 3/5 页面静态检查 ==="
node tools/check-ux.mjs
node tools/fix-text-style.mjs

echo ""
echo "=== 4/5 编译（--enable-jsc 生成字节码）==="
npx aiot build --enable-jsc

echo ""
echo "=== 5/5 输出 .bin ==="
RPK=$(ls dist/*.rpk | head -1)
cp "$RPK" "dist/$NAME.bin"
ls -la "dist/$NAME.bin"
echo ""
echo "完成：dist/$NAME.bin"
