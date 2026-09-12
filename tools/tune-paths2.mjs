/**
 * 平衡标定（修正版：**一个文件只写一次**，上版逐数组写会把前面几个数组截断掉）
 *  1) 授予体系的事件：weight=1，并加幸运门槛（炼体/魔法/科技 luck 6，修仙 luck 7）
 *  2) 授予体系的词条：rarity=3（灵品；太稀会根本抽不到，太常见又人人都修炼）
 *  3) 过于宽松的高 rank 结局：抬高单属性门槛
 * 用法：node tools/tune-paths2.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const C = path.join(process.cwd(), 'src/common/core/content')
const ATTR_KEYS = ['iq', 'eq', 'hp', 'luck']

async function load(file) {
  return await import('file://' + path.join(C, file).replace(/\\/g, '/'))
}

function arrText(name, arr) {
  return 'export const ' + name + ' = [\n' +
    arr.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]\n'
}

/** 把多个数组一次性写进一个文件 */
function writeFile(file, parts) {
  const body = parts.map(p => arrText(p[0], p[1])).join('\n')
  fs.writeFileSync(path.join(C, file), body)
}

const stats = { gated: 0, weighted: 0, rarity: 0, tightened: 0 }

/** 处理"入门"类事件：降权重 + 加幸运门槛 */
function gateEvents(arr, luck) {
  return arr.map(e => {
    const enters = e.eff && (e.eff.enterPath || e.eff.spiritRoot)
    if (!enters) return e
    const req = Object.assign({}, e.req || {})
    if (req.luck === undefined) { req.luck = luck; stats.gated++ }
    if (e.weight !== 1) stats.weighted++
    return Object.assign({}, e, { weight: 1, req: req })
  })
}

/** 处理"授予体系"的词条：稀有度设成灵品 */
function rankTalents(arr) {
  return arr.map(t => {
    const enters = t.eff && (t.eff.enterPath || t.eff.spiritRoot)
    if (!enters) return t
    if (t.rarity !== 3) stats.rarity++
    return Object.assign({}, t, { rarity: 3 })
  })
}

// ---- 四个体系包 ----
const PKGS = [
  ['path_body.js', 6], ['path_magic.js', 6], ['path_tech.js', 6], ['path_cultivate2.js', 7]
]
for (const [file, luck] of PKGS) {
  const mod = await load(file)
  writeFile(file, [
    ['EVENTS', gateEvents(mod.EVENTS, luck)],
    ['TALENTS', rankTalents(mod.TALENTS)],
    ['ITEMS', mod.ITEMS],
    ['ENDINGS', mod.ENDINGS],
    ['ACHIEVEMENTS', mod.ACHIEVEMENTS]
  ])
  console.log('已标定 ' + file)
}

// ---- 已有的修仙来源 ----
{
  const mod = await load('events_cultivation.js')
  writeFile('events_cultivation.js', [['EVENTS_CULTIVATION', gateEvents(mod.EVENTS_CULTIVATION, 7)]])
  const mod2 = await load('events_life.js')
  writeFile('events_life.js', [['EVENTS_LIFE', gateEvents(mod2.EVENTS_LIFE, 7)]])
  console.log('已标定 events_cultivation.js / events_life.js')
}

// ---- 宽松的高 rank 结局 ----
{
  const mod = await load('endings.js')
  const arr = mod.ENDINGS.map(d => {
    const r = d.req || {}
    const keys = Object.keys(r)
    const numOnly = keys.filter(k => ATTR_KEYS.indexOf(k) >= 0)
    if ((d.rank || 1) >= 3 && keys.length === 1 && numOnly.length === 1 && r[numOnly[0]] < 14) {
      stats.tightened++
      const req = {}
      req[numOnly[0]] = Math.min(18, r[numOnly[0]] + 4)
      return Object.assign({}, d, { req: req })
    }
    return d
  })
  writeFile('endings.js', [['ENDINGS', arr]])
  console.log('已收紧 endings.js')
}

console.log('入门事件加幸运门槛 ' + stats.gated + ' 条 / 权重归 1 ' + stats.weighted +
  ' 条 / 体系词条降为灵品 ' + stats.rarity + ' 条 / 收紧结局 ' + stats.tightened + ' 个')
