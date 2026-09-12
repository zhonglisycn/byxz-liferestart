/**
 * 多体系平衡标定：
 *  1) 把 炼体/魔法/科技 三套阶梯的门槛与寿命按修仙的经济体系重新标定（原来太便宜，人人封顶）
 *  2) 收紧"入门"来源：入门事件权重压到 1，授予体系的词条稀有度提到 4（抽取权重最低）
 *  3) 收紧体系结局：只写 req.path 的结局补上 pathLevel 门槛（不然低级修士也拿高 rank 结局）
 * 用法：node tools/tune-paths.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const R = process.cwd()
const C = path.join(R, 'src/common/core/content')

/* ---------- 1) 阶梯重标定（写回 engine.js） ---------- */
const NEW_LADDERS = {
  body: [[0, 0], [40, 15], [150, 25], [450, 45], [1000, 80], [2600, 150],
    [6000, 250], [13000, 450], [25000, 750], [45000, 1200], [90000, 2000]],
  magic: [[0, 0], [40, 15], [150, 30], [450, 55], [1000, 100], [2600, 180],
    [6000, 300], [13000, 520], [25000, 850], [45000, 1350], [90000, 2200]],
  tech: [[0, 0], [50, 10], [180, 18], [520, 30], [1100, 55], [2800, 95],
    [6500, 165], [14000, 290], [26000, 480], [48000, 780], [95000, 1500]]
}
const RATE = [0, 0.9, 0.85, 0.8, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15]
const ATTR = { body: [0, 1, 1, 2, 3, 4, 6, 9, 13, 18, 26], magic: [0, 0, 1, 2, 3, 5, 7, 10, 14, 19, 27], tech: [0, 1, 1, 2, 3, 5, 7, 10, 15, 20, 28] }

function buildLadder(key, names) {
  const rows = NEW_LADDERS[key]
  return rows.map((r, i) =>
    `  { name: '${names[i]}', threshold: ${r[0]}, life: ${r[1]}, attr: ${ATTR[key][i]}, rate: ${RATE[i]} }`)
}

const NAMES = {
  body: ['凡躯', '淬皮', '淬肉', '淬筋', '易骨', '换血', '洗髓', '金刚之躯', '龙象之力', '不灭金身', '肉身成圣'],
  magic: ['凡人', '学徒', '见习法师', '初级法师', '中级法师', '高级法师', '大法师', '魔导师', '大魔导师', '法圣', '法神'],
  tech: ['蒙昧', '学徒', '技术员', '工程师', '高级工程师', '研究员', '首席科学家', '学科奠基人', '国家之光', '文明灯塔', '机械飞升']
}

let eng = fs.readFileSync(path.join(R, 'src/common/core/engine.js'), 'utf8')
for (const key of ['BODY', 'MAGIC', 'TECH']) {
  const lower = key.toLowerCase()
  const re = new RegExp('const LADDER_' + key + ' = \\[[\\s\\S]*?\\n\\]')
  const body = 'const LADDER_' + key + ' = [\n' + buildLadder(lower, NAMES[lower]).join(',\n') + '\n]'
  if (!re.test(eng)) { console.log('!! 没找到 LADDER_' + key); continue }
  eng = eng.replace(re, body)
}
fs.writeFileSync(path.join(R, 'src/common/core/engine.js'), eng)
console.log('已重标定 炼体/魔法/科技 三套阶梯（门槛与寿命对齐修仙经济）')

/* ---------- 2)(3) 收紧入门与结局 ---------- */
function tunePkg(file, pathKey) {
  const p = path.join(C, file)
  const src = fs.readFileSync(p, 'utf8')
  const mod = {}
  // 用正则做"保守"改写：不动数据内容，只调 weight / rarity / 补 pathLevel
  let out = src

  // 入门事件（带 eff.enterPath 的）权重压到 1
  out = out.replace(/(-?\{[^\n]*?enterPath[^\n]*?\})/g, (m) => {
    return m.replace(/weight:\s*\d+/, 'weight: 1')
  })
  // 授予体系的词条：稀有度提到 4（抽取权重最低）
  out = out.replace(/(\{[^\n]*?"?name"?:[^\n]*?enterPath[^\n]*?\})/g, (m) => {
    return m.replace(/rarity:\s*\d/, 'rarity: 4')
  })
  // 只写 req.path 的结局：补 pathLevel 门槛
  out = out.replace(/req:\s*\{\s*path:\s*'(\w+)'\s*\}/g, (m, k) => `req: { path: '${k}', pathLevel: 5 }`)

  fs.writeFileSync(p, out)
  console.log('已收紧 ' + file)
}

for (const f of ['path_body.js', 'path_magic.js', 'path_tech.js', 'path_cultivate2.js']) {
  tunePkg(f)
}
console.log('完成：入门更难、体系结局需要境界门槛')
