/**
 * 内容结构校验：node tools/validate-content.mjs
 *
 * 保证多名内容作者的产出格式一致、id 不冲突、条件/效果键合法。
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const C = path.join(ROOT, 'src/common/core/content')

const ATTRS = ['iq', 'eq', 'hp', 'luck']
const EFF_KEYS = new Set([...ATTRS, 'lifespan', 'progressRate', 'breakthrough', 'luckRate',
  'flag', 'item', 'spiritRoot', 'forbidCultivation', 'daoHeart', 'dieChance',
  'progress', 'realmUp', 'tribulation', 'die',
  'enterPath', 'pathUp', 'sp', 'dualPath'])
const REQ_KEYS = new Set([...ATTRS, 'lt', 'flags', 'notFlags', 'items', 'talents',
  'cultivation', 'noCultivation', 'realm', 'ageMin',
  'path', 'pathLevel', 'noPath', 'dualPath'])
const PATH_KEYS = new Set(['cultivate', 'body', 'magic', 'tech'])
const ROOTS = new Set(['single', 'dual', 'triple', 'pseudo', 'heaven'])
const ITEM_KINDS = new Set(['法宝', '丹药', '灵物', '功法'])

const errors = []
const warns = []
const ids = new Map()      // id -> file
const itemIds = new Set()
const talentIds = new Set()

function err(file, id, msg) { errors.push(`${file} [${id || '?'}] ${msg}`) }
function warn(file, id, msg) { warns.push(`${file} [${id || '?'}] ${msg}`) }

function checkEff(file, id, eff) {
  if (!eff) return
  if (typeof eff !== 'object') return err(file, id, 'eff 必须是对象')
  for (const k in eff) {
    if (!EFF_KEYS.has(k)) err(file, id, '未知的 eff 键: ' + k)
    if (ATTRS.indexOf(k) >= 0 && typeof eff[k] !== 'number') err(file, id, k + ' 必须是数字')
    if (k === 'spiritRoot' && !ROOTS.has(eff[k])) err(file, id, 'spiritRoot 取值非法: ' + eff[k])
    if (k === 'enterPath' && !PATH_KEYS.has(eff[k])) err(file, id, 'enterPath 取值非法: ' + eff[k])
    if (k === 'dieChance' && (eff[k] < 0 || eff[k] > 1)) err(file, id, 'dieChance 应在 0~1')
  }
}

function checkReq(file, id, req) {
  if (!req) return
  for (const k in req) {
    if (!REQ_KEYS.has(k)) err(file, id, '未知的 req 键: ' + k)
  }
  if (req.path !== undefined && !PATH_KEYS.has(req.path)) err(file, id, 'req.path 取值非法: ' + req.path)
  const arrs = ['flags', 'notFlags', 'items', 'talents']
  for (const k of arrs) {
    if (req[k] !== undefined && !Array.isArray(req[k])) err(file, id, 'req.' + k + ' 必须是数组')
  }
}

function checkId(file, id, prefix) {
  if (!id || typeof id !== 'string') return err(file, id, 'id 缺失')
  if (id[0] !== prefix) return err(file, id, `id 应以 ${prefix} 开头`)
  if (ids.has(id)) return err(file, id, 'id 与 ' + ids.get(id) + ' 重复')
  ids.set(id, file)
}

async function load(name) {
  const p = path.join(C, name)
  if (!fs.existsSync(p)) { err(name, '-', '文件不存在'); return [] }
  const mod = await import('file://' + p.replace(/\\/g, '/'))
  const arr = mod.default || mod[Object.keys(mod)[0]]
  if (!Array.isArray(arr)) { err(name, '-', '没有导出数组'); return [] }
  return arr
}

const talents = await load('talents.js')
const PKGS = [
  { file: 'path_body.js', name: '炼体', evPrefix: 'B' },
  { file: 'path_magic.js', name: '魔法', evPrefix: 'M' },
  { file: 'path_tech.js', name: '科技', evPrefix: 'H' },
  { file: 'path_cultivate2.js', name: '修仙·加料', evPrefix: 'C' },
  { file: 'talents_life.js', name: '词条·生活', evPrefix: 'Y', talentsOnly: true },
  { file: 'talents_paths2.js', name: '词条·体系', evPrefix: 'Y', talentsOnly: true },
  { file: 'talents_special.js', name: '词条·特殊', evPrefix: 'Y', talentsOnly: true },
  { file: 'events_talent.js', name: '词条联动事件', evPrefix: 'V' }
]
const life = await load('events_life.js')
const cult = await load('events_cultivation.js')
const extra = await load('events_extra.js')
const items = await load('items.js')
const endings = await load('endings.js')
const achs = await load('achievements.js')

// ---- 天赋 ----
for (const t of talents) {
  checkId('talents.js', t.id, 'T')
  if (!t.name || t.name.length > 8) err('talents.js', t.id, 'name 缺失或过长')
  if (!t.desc || t.desc.length > 20) err('talents.js', t.id, 'desc 缺失或过长')
  if (!(t.rarity >= 1 && t.rarity <= 4)) err('talents.js', t.id, 'rarity 应为 1~4')
  if (!t.tag) err('talents.js', t.id, 'tag 缺失')
  checkEff('talents.js', t.id, t.eff)
  talentIds.add(t.id)
}

// ---- 物品 ----
for (const it of items) {
  checkId('items.js', it.id, 'I')
  if (!it.name) err('items.js', it.id, 'name 缺失')
  if (!ITEM_KINDS.has(it.kind)) err('items.js', it.id, 'kind 非法: ' + it.kind)
  if (!(it.rarity >= 1 && it.rarity <= 4)) err('items.js', it.id, 'rarity 应为 1~4')
  if (!it.desc || it.desc.length > 24) err('items.js', it.id, 'desc 缺失或过长')
  checkEff('items.js', it.id, it.eff)
  itemIds.add(it.id)
}

// ---- 事件 ----
function checkEvents(file, arr, isCult, prefix) {
  const ageBuckets = {}
  for (const e of arr) {
    checkId(file, e.id, prefix || (isCult ? 'C' : 'E'))
    if (!e.title || e.title.length > 8) err(file, e.id, 'title 缺失或过长')
    if (!e.text) err(file, e.id, 'text 缺失')
    else if (e.text.length > 80) err(file, e.id, 'text 过长(' + e.text.length + ')')
    if (!Array.isArray(e.age) || e.age.length !== 2) err(file, e.id, 'age 必须是 [min,max]')
    else if (e.age[0] > e.age[1]) err(file, e.id, 'age 区间反了')
    if (typeof e.weight !== 'number' || e.weight <= 0) err(file, e.id, 'weight 必须是正数')
    if (e.kind && ['life', 'item', 'danger', 'cultivate'].indexOf(e.kind) < 0) err(file, e.id, 'kind 非法')
    checkReq(file, e.id, e.req)
    checkEff(file, e.id, e.eff)
    if (isCult) {
      const hasGate = e.req && (e.req.cultivation || typeof e.req.realm === 'number')
      if (!hasGate && (e.weight || 10) > 3) err(file, e.id, '修仙事件应带 req.cultivation 或 req.realm（或把 weight 降到 ≤3）')
    }
    if (e.req && e.req.items) for (const i of e.req.items) if (!itemIds.has(i)) warn(file, e.id, 'req.items 引用了尚未定义的物品 ' + i)
    if (e.req && e.req.talents) for (const t of e.req.talents) if (!talentIds.has(t)) warn(file, e.id, 'req.talents 引用了尚未定义的天赋 ' + t)
    if (e.eff && e.eff.item && !itemIds.has(e.eff.item)) warn(file, e.id, 'eff.item 引用了尚未定义的物品 ' + e.eff.item)
    if (Array.isArray(e.age)) {
      const b = Math.floor(e.age[0] / 20)
      ageBuckets[b] = (ageBuckets[b] || 0) + 1
    }
  }
  return ageBuckets
}
const lifeBuckets = checkEvents('events_life.js', life, false)
const cultBuckets = checkEvents('events_cultivation.js', cult, true)
checkEvents('events_extra.js', extra, false, 'X')

// ---- 结局 / 成就 ----
for (const d of endings) {
  checkId('endings.js', d.id, 'D')
  if (!d.name) err('endings.js', d.id, 'name 缺失')
  if (!d.desc) err('endings.js', d.id, 'desc 缺失')
  if (!(d.rank >= 1 && d.rank <= 5)) err('endings.js', d.id, 'rank 应为 1~5')
  checkReq('endings.js', d.id, d.req)
}
for (const a of achs) {
  checkId('achievements.js', a.id, 'A')
  if (!a.name) err('achievements.js', a.id, 'name 缺失')
  if (!a.desc) err('achievements.js', a.id, 'desc 缺失')
  checkReq('achievements.js', a.id, 'req' in a ? undefined : undefined)
  if (!a.req) err('achievements.js', a.id, 'req 缺失（成就必须有达成条件）')
  checkReq('achievements.js', a.id, a.req)
}

// ---- 体系内容包 ----
const pkgStats = []
for (const pk of PKGS) {
  const mod = await import('file://' + path.join(C, pk.file).replace(/\\/g, '/'))
  const ev = mod.EVENTS || []
  const tl = mod.TALENTS || []
  const it = mod.ITEMS || []
  const en = mod.ENDINGS || []
  const ac = mod.ACHIEVEMENTS || []
  if (!pk.talentsOnly) {
    if (!Array.isArray(ev)) err(pk.file, '-', '没有导出 EVENTS 数组')
    checkEvents(pk.file, ev, false, pk.evPrefix)
  }
  for (const x of tl) {
    checkId(pk.file, x.id, 'T')
    if (!x.name || !x.desc) err(pk.file, x.id, 'name/desc 缺失')
    if (!x.tag) err(pk.file, x.id, 'tag 缺失')
    if (!(x.rarity >= 1 && x.rarity <= 4)) err(pk.file, x.id, 'rarity 应为 1~4')
    if (!x.eff || typeof x.eff !== 'object' || Object.keys(x.eff).length === 0) err(pk.file, x.id, 'eff 缺失或为空')
    checkEff(pk.file, x.id, x.eff)
  }
  for (const x of it) {
    checkId(pk.file, x.id, 'I')
    if (!ITEM_KINDS.has(x.kind)) err(pk.file, x.id, 'kind 非法: ' + x.kind)
    checkEff(pk.file, x.id, x.eff)
  }
  for (const x of en) {
    checkId(pk.file, x.id, 'D')
    if (!(x.rank >= 1 && x.rank <= 5)) err(pk.file, x.id, 'rank 应为 1~5')
    checkReq(pk.file, x.id, x.req)
  }
  for (const x of ac) {
    checkId(pk.file, x.id, 'A')
    if (!x.req) err(pk.file, x.id, 'req 缺失')
    checkReq(pk.file, x.id, x.req)
  }
  pkgStats.push(pk.name + (pk.talentsOnly ? ' 词条' : ' 事件' + ev.length + ' 词条') + tl.length + ' 物品' + it.length + ' 结局' + en.length + ' 成就' + ac.length)
}

// ---- 汇总 ----
const n = (a) => a.length
console.log('内容统计：')
console.log(`  天赋词条 ${n(talents)}  (目标 ≥120)`)
console.log(`  人生事件 ${n(life)}  (目标 ≥260)`)
console.log(`  修仙事件 ${n(cult)}  (目标 ≥130)`)
console.log(`  补充事件 ${n(extra)}  (成就 flag 用)`)
console.log(`  物品     ${n(items)}  (目标 ≥80)`)
console.log(`  结局     ${n(endings)}  (目标 ≥60)`)
console.log(`  成就     ${n(achs)}  (目标 ≥50)`)
console.log('  人生事件年龄段分布:', JSON.stringify(lifeBuckets))
console.log('  体系内容包:')
for (const s of pkgStats) console.log('    · ' + s)

if (errors.length) {
  console.log('\n发现 ' + errors.length + ' 个问题（只列前 40 条）：')
  for (const e of errors.slice(0, 40)) console.log('  ✗ ' + e)
  process.exit(1)
}
console.log('\n✓ 内容结构校验通过')
