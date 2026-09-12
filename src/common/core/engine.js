/**
 * 《人生重开 · 修仙》内核（多体系版）
 *
 * 一次"人生"= 抽天赋（词条）→ 分配属性 → 逐年前进 → 有机会踏入某条修炼体系
 * （修仙 / 炼体 / 魔法 / 科技）→ 突破境界、遭遇劫难 → 死亡结算。
 *
 * 四条体系共用一套机制，只有"资源名 / 特殊属性名 / 境界阶梯 / 失败与劫难的说法"不同：
 *   · 修仙：修为 / 道心 / 天劫       / 走火入魔
 *   · 炼体：气血 / 铁骨 / 雷劫淬体   / 筋骨寸断
 *   · 魔法：魔力 / 灵性 / 元素暴动   / 魔力反噬
 *   · 科技：知识 / 严谨 / 学术刁难   / 实验事故
 *
 * 纯 JS，不依赖任何系统接口，可直接在 Node 里单测；整局状态可 JSON 序列化。
 * 内容 schema 见 docs/内容规范.md
 *
 * 内容池不在本文件 import——用前先 setContent() 注入（页面注入的是 app.ux 装配的
 * 全局唯一那份，Node 里注入 content/index.js 的 buildContent()）。
 */

/* ------------------------------------------------------------------ */
/* 四条体系的境界阶梯                                                  */
/* ------------------------------------------------------------------ */

const LADDER_CULTIVATE = [
  { name: '凡体', threshold: 0, life: 0, attr: 0, rate: 0 },
  { name: '炼气一层', threshold: 20, life: 10, attr: 0, rate: 0.9 },
  { name: '炼气三层', threshold: 70, life: 10, attr: 1, rate: 0.85 },
  { name: '炼气六层', threshold: 160, life: 20, attr: 1, rate: 0.8 },
  { name: '炼气九层', threshold: 300, life: 30, attr: 2, rate: 0.75 },
  { name: '筑基初期', threshold: 600, life: 50, attr: 3, rate: 0.65 },
  { name: '筑基中期', threshold: 1100, life: 70, attr: 4, rate: 0.6 },
  { name: '筑基后期', threshold: 1900, life: 90, attr: 5, rate: 0.55 },
  { name: '金丹期', threshold: 3200, life: 140, attr: 7, rate: 0.45 },
  { name: '金丹圆满', threshold: 5200, life: 180, attr: 9, rate: 0.4 },
  { name: '元婴期', threshold: 8500, life: 280, attr: 12, rate: 0.32 },
  { name: '化神期', threshold: 14000, life: 420, attr: 16, rate: 0.25 },
  { name: '炼虚期', threshold: 22000, life: 630, attr: 20, rate: 0.2 },
  { name: '合体期', threshold: 34000, life: 910, attr: 25, rate: 0.15 },
  { name: '大乘期', threshold: 52000, life: 1260, attr: 30, rate: 0.1 },
  { name: '渡劫期', threshold: 78000, life: 1750, attr: 36, rate: 0.07 },
  { name: '仙人', threshold: 120000, life: 3500, attr: 50, rate: 0 }
]

const LADDER_BODY = [
  { name: '凡躯', threshold: 0, life: 0, attr: 0, rate: 0 },
  { name: '淬皮', threshold: 60, life: 15, attr: 1, rate: 0.9 },
  { name: '淬肉', threshold: 230, life: 25, attr: 1, rate: 0.85 },
  { name: '淬筋', threshold: 700, life: 45, attr: 2, rate: 0.8 },
  { name: '易骨', threshold: 1550, life: 80, attr: 3, rate: 0.75 },
  { name: '换血', threshold: 4030, life: 150, attr: 4, rate: 0.65 },
  { name: '洗髓', threshold: 9300, life: 250, attr: 6, rate: 0.55 },
  { name: '金刚之躯', threshold: 20150, life: 450, attr: 9, rate: 0.45 },
  { name: '龙象之力', threshold: 38750, life: 750, attr: 13, rate: 0.35 },
  { name: '不灭金身', threshold: 69750, life: 1200, attr: 18, rate: 0.25 },
  { name: '肉身成圣', threshold: 139500, life: 2000, attr: 26, rate: 0.15 }
]

const LADDER_MAGIC = [
  { name: '凡人', threshold: 0, life: 0, attr: 0, rate: 0 },
  { name: '学徒', threshold: 60, life: 15, attr: 0, rate: 0.9 },
  { name: '见习法师', threshold: 230, life: 30, attr: 1, rate: 0.85 },
  { name: '初级法师', threshold: 700, life: 55, attr: 2, rate: 0.8 },
  { name: '中级法师', threshold: 1550, life: 100, attr: 3, rate: 0.75 },
  { name: '高级法师', threshold: 4030, life: 180, attr: 5, rate: 0.65 },
  { name: '大法师', threshold: 9300, life: 300, attr: 7, rate: 0.55 },
  { name: '魔导师', threshold: 20150, life: 520, attr: 10, rate: 0.45 },
  { name: '大魔导师', threshold: 38750, life: 850, attr: 14, rate: 0.35 },
  { name: '法圣', threshold: 69750, life: 1350, attr: 19, rate: 0.25 },
  { name: '法神', threshold: 139500, life: 2200, attr: 27, rate: 0.15 }
]

const LADDER_TECH = [
  { name: '蒙昧', threshold: 0, life: 0, attr: 0, rate: 0 },
  { name: '学徒', threshold: 80, life: 10, attr: 1, rate: 0.9 },
  { name: '技术员', threshold: 280, life: 18, attr: 1, rate: 0.85 },
  { name: '工程师', threshold: 810, life: 30, attr: 2, rate: 0.8 },
  { name: '高级工程师', threshold: 1700, life: 55, attr: 3, rate: 0.75 },
  { name: '研究员', threshold: 4340, life: 95, attr: 5, rate: 0.65 },
  { name: '首席科学家', threshold: 10080, life: 165, attr: 7, rate: 0.55 },
  { name: '学科奠基人', threshold: 21700, life: 290, attr: 10, rate: 0.45 },
  { name: '国家之光', threshold: 40300, life: 480, attr: 15, rate: 0.35 },
  { name: '文明灯塔', threshold: 74400, life: 780, attr: 20, rate: 0.25 },
  { name: '机械飞升', threshold: 147250, life: 1500, attr: 28, rate: 0.15 }
]

export const PATHS = {
  cultivate: { key: 'cultivate', name: '修仙', root: '灵根', res: '修为', sp: '道心', trial: '天劫', fail: '走火入魔', ladder: LADDER_CULTIVATE },
  body: { key: 'body', name: '炼体', root: '体魄天赋', res: '气血', sp: '铁骨', trial: '雷劫淬体', fail: '筋骨寸断', ladder: LADDER_BODY },
  magic: { key: 'magic', name: '魔法', root: '魔力天赋', res: '魔力', sp: '灵性', trial: '元素暴动', fail: '魔力反噬', ladder: LADDER_MAGIC },
  tech: { key: 'tech', name: '科技', root: '科研天赋', res: '知识', sp: '严谨', trial: '学术刁难', fail: '实验事故', ladder: LADDER_TECH }
}

export const PATH_LIST = [PATHS.cultivate, PATHS.body, PATHS.magic, PATHS.tech]

/** 向后兼容：REALMS 指修仙的阶梯 */
export const REALMS = LADDER_CULTIVATE

export const RARITY_NAME = ['', '凡品', '灵品', '仙品', '神品']

/* ------------------------------------------------------------------ */
/* 随机数（可复现、可序列化）                                           */
/* ------------------------------------------------------------------ */

export function rnd(run) {
  let a = (run.rngA | 0) + 0x6D2B79F5 | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  run.rngA = a
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function pickWeighted(list, run) {
  let total = 0
  for (let i = 0; i < list.length; i++) total += list[i].weight
  if (total <= 0) return null
  let r = rnd(run) * total
  for (let i = 0; i < list.length; i++) {
    r -= list[i].weight
    if (r <= 0) return list[i]
  }
  return list[list.length - 1]
}

/* ------------------------------------------------------------------ */
/* 内容池（由 app.ux 装配一次，页面注入同一份引用）                     */
/* ------------------------------------------------------------------ */

// 内容不在这里 import：一旦 import，每个页面的字节码都会内联一份完整内容，
// 换页时反复解析构造，手环上会因此内存耗尽重启。改由 app.ux 用
// content/index.js 的 buildContent() 装配全局唯一的一份，页面在 onInit 里
// setContent(this.$app.$def.CONTENT) 注入引用——本函数只存引用，不复制内容。
const EMPTY = []

let ALL_TALENTS = EMPTY
let ALL_ITEMS = EMPTY
let ALL_ENDINGS = EMPTY
let ALL_ACHIEVEMENTS = EMPTY
let ALL_EVENTS = EMPTY
let TALENT_MAP = {}
let ITEM_MAP = {}
let CONTENT_READY = false

/** 注入内容池。必须是全局唯一的那一份（见 app.ux）。 */
export function setContent(c) {
  if (!c || CONTENT_READY) return CONTENT_READY
  ALL_TALENTS = c.talents || EMPTY
  ALL_ITEMS = c.items || EMPTY
  ALL_ENDINGS = c.endings || EMPTY
  ALL_ACHIEVEMENTS = c.achievements || EMPTY
  ALL_EVENTS = c.events || EMPTY
  TALENT_MAP = {}
  ITEM_MAP = {}
  for (let i = 0; i < ALL_TALENTS.length; i++) TALENT_MAP[ALL_TALENTS[i].id] = ALL_TALENTS[i]
  for (let i = 0; i < ALL_ITEMS.length; i++) ITEM_MAP[ALL_ITEMS[i].id] = ALL_ITEMS[i]
  CONTENT_READY = true
  return true
}

/** 内容是否已注入（页面可据此显示"载入中"） */
export function contentReady() { return CONTENT_READY }

export function talentById(id) { return TALENT_MAP[id] || null }
export function itemById(id) { return ITEM_MAP[id] || null }

/* ------------------------------------------------------------------ */
/* 开局                                                                */
/* ------------------------------------------------------------------ */

export const ATTRS = ['iq', 'eq', 'hp', 'luck']
export const ATTR_NAME = { iq: '智力', eq: '情商', hp: '体质', luck: '幸运' }
export const TOTAL_POINTS = 20

export function newRun(seed) {
  const s = seed || Math.floor(Math.random() * 1e9)
  return {
    seed: s,
    rngA: (s >>> 0) || 12345,
    age: 0,
    attrs: { iq: 0, eq: 0, hp: 0, luck: 0 },
    baseHp: 5,
    talents: [],
    items: [],
    flags: {},
    bonus: { lifespan: 0, progressRate: 0, breakthrough: 0, luckRate: 0 },
    path: null,          // 主修体系 { kind, level, progress, sp, fail }
    path2: null,         // 双修的第二体系
    log: [],
    seq: 0,              // 日志序号（只增不减，界面用它当行 id）
    alive: true,
    death: '',
    ending: null,
    started: false
  }
}

/** 兼容旧存档：把 run.cultivation 迁移成 run.path */
export function normalizeRun(run) {
  if (!run) return run
  if (run.cultivation && !run.path) {
    run.path = {
      kind: 'cultivate',
      level: run.cultivation.level || 1,
      progress: run.cultivation.progress || 0,
      sp: run.cultivation.daoHeart || 5,
      fail: run.cultivation.fail || 0
    }
    delete run.cultivation
  }
  if (run.path2 === undefined) run.path2 = null
  if (run.baseHp === undefined) run.baseHp = 5
  // 旧存档的日志没有 seq：补一次（只在首条缺 seq 时才扫，平时是 O(1)）
  if (run.log && run.log.length && run.log[0].seq === undefined) {
    for (let i = 0; i < run.log.length; i++) run.log[i].seq = i + 1
  }
  if (run.seq === undefined) run.seq = run.log ? run.log.length : 0
  return run
}

export function drawTalents(run, n) {
  const pool = ALL_TALENTS.map(t => ({ t: t, weight: Math.max(1, 6 - t.rarity * 1.4) }))
  const out = []
  const used = {}
  let guard = 0
  while (out.length < n && guard < 4000) {
    guard++
    const p = pickWeighted(pool, run)
    if (!p || used[p.t.id]) continue
    used[p.t.id] = true
    out.push(p.t)
  }
  return out
}

/* ------------------------------------------------------------------ */
/* 体系                                                                */
/* ------------------------------------------------------------------ */

export function findPath(run, kind) {
  if (run.path && run.path.kind === kind) return run.path
  if (run.path2 && run.path2.kind === kind) return run.path2
  return null
}

export function pathDef(kind) { return PATHS[kind] || PATHS.cultivate }

function makePath(kind) {
  return { kind: kind, level: 1, progress: 0, sp: 5, fail: 0 }
}

/** 踏入某条体系。已有主修时，需要"双修"天赋才能开第二条 */
export function enterPath(run, kind, slot) {
  if (!PATHS[kind]) return false
  if (findPath(run, kind)) return false
  const d = pathDef(kind)
  if (!run.path) {
    if (run.flags.noPathOff) return false
    run.path = makePath(kind)
    run.bonus.lifespan += d.ladder[1].life
    addLog(run, 'path', '踏入' + d.name,
      '你觉醒了' + d.root + '，自此走上' + d.name + '之路。', [])
    return true
  }
  if (!run.flags.dualPath || run.path2) return false
  run.path2 = makePath(kind)
  run.bonus.lifespan += d.ladder[1].life
  addLog(run, 'path', '双修 · ' + d.name,
    '你已走在' + pathDef(run.path.kind).name + '之路上，却又硬开一条——' + d.name + '之门为你敞开。', [])
  return true
}

/** 向后兼容：修仙觉醒 */
export function awaken(run) {
  return enterPath(run, 'cultivate', run.path ? 2 : 1)
}

export function rootName(r) {
  const m = { single: '单灵根', dual: '双灵根', triple: '三灵根', pseudo: '伪灵根', heaven: '天灵根' }
  return m[r] || '五行灵根'
}

function realmOf(p) {
  if (!p) return null
  const d = pathDef(p.kind)
  return d.ladder[Math.min(p.level, d.ladder.length - 1)].name
}

export function realmName(run) {
  return realmOf(run.path) || '凡体'
}

export function pathName(run) {
  return run.path ? pathDef(run.path.kind).name : '凡人'
}

/** 界面用：把主修/双修概括成一行 */
export function pathText(run) {
  if (!run.path) return '凡人'
  const d = pathDef(run.path.kind)
  let s = d.name + '·' + realmOf(run.path)
  // 双修时不再挤资源数值，一行才放得下
  if (run.path2) {
    s += ' ｜ ' + pathDef(run.path2.kind).name + '·' + realmOf(run.path2)
  } else {
    s += ' ' + d.res + Math.round(run.path.progress)
  }
  return s
}

/** 界面用：某条体系的完整状态 */
export function pathStat(run, kind) {
  const p = findPath(run, kind)
  if (!p) return null
  const d = pathDef(kind)
  return { def: d, level: p.level, name: realmOf(p), progress: Math.round(p.progress), sp: p.sp }
}

/* ------------------------------------------------------------------ */
/* 效果应用                                                            */
/* ------------------------------------------------------------------ */

function applyEff(run, eff) {
  if (!eff) return []
  const changes = []
  for (let i = 0; i < ATTRS.length; i++) {
    const k = ATTRS[i]
    if (typeof eff[k] === 'number' && eff[k] !== 0) {
      run.attrs[k] = Math.max(0, run.attrs[k] + eff[k])
      changes.push(ATTR_NAME[k] + (eff[k] > 0 ? '+' : '') + eff[k])
    }
  }
  if (typeof eff.lifespan === 'number') run.bonus.lifespan += eff.lifespan
  if (typeof eff.progressRate === 'number') run.bonus.progressRate += eff.progressRate
  if (typeof eff.breakthrough === 'number') run.bonus.breakthrough += eff.breakthrough
  if (typeof eff.luckRate === 'number') run.bonus.luckRate += eff.luckRate
  if (eff.flag) run.flags[eff.flag] = true
  if (eff.dualPath) run.flags.dualPath = true
  if (eff.item && !hasItem(run, eff.item)) {
    run.items.push(eff.item)
    const it = ITEM_MAP[eff.item]
    if (it) changes.push('获得' + it.kind + '「' + it.name + '」')
  }
  // 特殊属性（道心/铁骨/灵性/严谨）
  if (eff.daoHeart || eff.sp) {
    const v = eff.daoHeart || eff.sp
    const p = run.path || run.path2
    if (p) p.sp = Math.max(0, p.sp + v)
  }
  if (eff.progress) addProgress(run, eff.progress)

  // 踏入体系
  if (eff.spiritRoot) enterPath(run, 'cultivate', run.path ? 2 : 1)
  if (eff.enterPath) enterPath(run, eff.enterPath, run.path ? 2 : 1)

  if (eff.pathUp || eff.realmUp) tryBreakthrough(run, true)
  if (eff.tribulation) trial(run)

  // 大难不死（每 80 年一次）
  if (run.attrs.hp <= 0 && !eff.die) {
    const lastSaved = run.flags.savedAge === undefined ? -999 : run.flags.savedAge
    if (run.age - lastSaved >= 80) {
      const chance = 0.72 + run.attrs.luck * 0.03
      if (rnd(run) < chance) {
        run.attrs.hp = 2
        run.flags.savedAge = run.age
        changes.push('大难不死')
        addLog(run, 'danger', '大难不死', '你在鬼门关前走了一遭，硬是撑了过来。', ['体质回2'])
      }
    }
  }
  if (eff.die) kill(run, eff.die)
  else if (eff.dieChance && rnd(run) < eff.dieChance) kill(run, '意外身亡')
  return changes
}

export function hasItem(run, id) { return run.items.indexOf(id) >= 0 }
export function hasFlag(run, f) { return !!run.flags[f] }

export function chooseTalents(run, ids) {
  run.talents = []
  for (let i = 0; i < ids.length; i++) {
    const t = TALENT_MAP[ids[i]]
    if (!t) continue
    run.talents.push(t.id)
    applyEff(run, t.eff)
  }
}

export function alloc(run, attrs) {
  let sum = 0
  for (let i = 0; i < ATTRS.length; i++) {
    const v = attrs[ATTRS[i]] | 0
    if (v < 0 || v > TOTAL_POINTS) return false
    sum += v
  }
  if (sum !== TOTAL_POINTS) return false
  for (let i = 0; i < ATTRS.length; i++) run.attrs[ATTRS[i]] = attrs[ATTRS[i]] | 0
  run.baseHp = run.attrs.hp
  run.started = true
  return true
}

/* ------------------------------------------------------------------ */
/* 资源 / 突破 / 劫难                                                  */
/* ------------------------------------------------------------------ */

// 一次人生可能长达数千年（修仙顶阶），日志若无上限会涨到两千多条，常驻内存和
// 结算 JSON 都跟着膨胀。只保留最近 MAX_LOG_KEEP 条；每条带一个只增不减的 seq，
// 界面拿 seq 当行 id，删旧条目时已有行的 id 不会整体错位（避免整屏重建）。
const MAX_LOG_KEEP = 300

function addLog(run, kind, title, text, changes) {
  run.seq = (run.seq || 0) + 1
  run.log.push({ seq: run.seq, age: run.age, kind: kind, title: title, text: text, changes: changes || [] })
  if (run.log.length > MAX_LOG_KEEP) run.log.splice(0, run.log.length - MAX_LOG_KEEP)
}

/** 主修体系的资源增长（吃智力 / 特殊属性 / 物品加成） */
export function addProgress(run, delta) {
  if (!run.path) return
  const c = run.path
  const rate = 1 + run.bonus.progressRate + run.attrs.iq * 0.03 + c.sp * 0.02
  c.progress += delta * rate
}

export function tryBreakthrough(run) {
  return tryPathBreakthrough(run, run.path)
}

function tryPathBreakthrough(run, p) {
  if (!p) return false
  const d = pathDef(p.kind)
  const next = p.level + 1
  if (next >= d.ladder.length) return false
  const need = d.ladder[next].threshold
  if (p.progress < need) return false

  const base = d.ladder[next].rate
  const chance = Math.max(0.03, Math.min(0.98,
    base + run.bonus.breakthrough + run.attrs.luck * 0.01 + p.sp * 0.01))
  if (rnd(run) < chance) {
    p.progress -= need
    if (p.progress < 0) p.progress = 0
    p.level = next
    run.bonus.lifespan += d.ladder[next].life
    const a = d.ladder[next].attr
    if (a) {
      // 各体系侧重不同：炼体长体质，魔法/科技长智力，修仙两边都长
      if (p.kind === 'body') run.attrs.hp += a
      else if (p.kind === 'magic' || p.kind === 'tech') run.attrs.iq += a
      else { run.attrs.iq += Math.floor(a / 2); run.attrs.hp += Math.ceil(a / 2) }
    }
    addLog(run, 'path', '破境 · ' + d.name + '·' + d.ladder[next].name,
      '积累圆满，你成功突破至「' + d.ladder[next].name + '」。', [])
    return true
  }
  p.fail++
  p.sp = Math.max(0, p.sp - 1)
  if (rnd(run) < 0.25) {
    run.attrs.hp = Math.max(0, run.attrs.hp - 2)
    run.flags.survived_deviation = true
    addLog(run, 'path', '突破失败', '冲击「' + d.ladder[next].name + '」失败，' + d.fail + '，你伤得不轻。', ['体质-2'])
    if (run.attrs.hp <= 0) kill(run, d.fail)
  } else {
    addLog(run, 'path', '突破失败', '冲击「' + d.ladder[next].name + '」失败，你稳住心神，改日再战。', [])
  }
  return false
}

/** 劫难：天劫 / 雷劫淬体 / 元素暴动 / 学术刁难 */
function trial(run) {
  const p = run.path
  if (!p) return
  const d = pathDef(p.kind)
  const power = 0.5 + run.attrs.hp * 0.02 + p.sp * 0.01 + run.bonus.breakthrough
  if (rnd(run) < power) {
    run.flags.tribulation_survivor = true
    run.flags.tribulation_count = (run.flags.tribulation_count || 0) + 1
    if (run.flags.tribulation_count >= 3) run.flags.tribulation_x3 = true
    addLog(run, 'trial', '渡过' + d.trial, '劫难散去，你稳稳站住，气息更胜往昔。', [])
    p.sp += 2
    addProgress(run, 60)
  } else {
    run.attrs.hp = Math.max(0, run.attrs.hp - 3)
    addLog(run, 'trial', d.trial + '受创', '你在' + d.trial + '中重伤，几乎没能挺过来。', ['体质-3'])
    if (run.attrs.hp <= 0) kill(run, '殒于' + d.trial)
  }
}

/* ------------------------------------------------------------------ */
/* 事件                                                                */
/* ------------------------------------------------------------------ */

function matchReq(run, req) {
  if (!req) return true
  for (let i = 0; i < ATTRS.length; i++) {
    const k = ATTRS[i]
    if (typeof req[k] === 'number' && run.attrs[k] < req[k]) return false
  }
  if (req.lt) for (const k in req.lt) if (run.attrs[k] >= req.lt[k]) return false
  if (req.flags) for (let i = 0; i < req.flags.length; i++) if (!run.flags[req.flags[i]]) return false
  if (req.notFlags) for (let i = 0; i < req.notFlags.length; i++) if (run.flags[req.notFlags[i]]) return false
  if (req.items) for (let i = 0; i < req.items.length; i++) if (!hasItem(run, req.items[i])) return false
  if (req.talents) for (let i = 0; i < req.talents.length; i++) if (run.talents.indexOf(req.talents[i]) < 0) return false

  // 体系条件
  if (req.path) {
    const p = findPath(run, req.path)
    if (!p) return false
    if (typeof req.pathLevel === 'number' && p.level < req.pathLevel) return false
  }
  if (req.noPath && (run.path || run.path2)) return false
  if (req.dualPath && !run.flags.dualPath) return false

  // 向后兼容：修仙专用的写法
  if (req.cultivation && !findPath(run, 'cultivate')) return false
  if (req.noCultivation && findPath(run, 'cultivate')) return false
  if (typeof req.realm === 'number') {
    const p = findPath(run, 'cultivate') || run.path
    if (!p || p.level < req.realm) return false
  }
  if (typeof req.ageMin === 'number' && run.age < req.ageMin) return false
  return true
}

export function candidates(run) {
  const out = []
  for (let i = 0; i < ALL_EVENTS.length; i++) {
    const e = ALL_EVENTS[i]
    if (run.age < e.age[0] || run.age > e.age[1]) continue
    if (e.once !== false && hasFlag(run, 'ev_' + e.id)) continue
    if (!matchReq(run, e.req)) continue
    let w = e.weight || 10
    if (e.kind === 'life' && run.bonus.luckRate) {
      const positive = (e.eff && (e.eff.luck > 0 || e.eff.iq > 0 || e.eff.item))
      if (positive) w = w * (1 + run.bonus.luckRate)
    }
    out.push({ e: e, weight: w })
  }
  return out
}

export function lifespan(run) {
  return 60 + run.attrs.hp * 2 + run.attrs.luck + run.bonus.lifespan
}

function kill(run, reason) {
  if (!run.alive) return
  run.alive = false
  run.death = reason || '寿终'
}

export function step(run) {
  normalizeRun(run)
  if (!run.alive) return null
  run.age++
  const before = run.log.length

  // 1) 资源自然增长
  if (run.path) addProgress(run, 4 + run.attrs.hp * 0.1)

  // 2) 抽事件
  const pool = candidates(run)
  const chosen = pickWeighted(pool, run) || null
  let ev = null
  if (chosen) {
    ev = chosen.e
    if (ev.once !== false) run.flags['ev_' + ev.id] = true
    const changes = applyEff(run, ev.eff)
    addLog(run, ev.kind === 'cultivate' ? 'path' : (ev.kind || 'life'), ev.title || '日常', ev.text, changes)
  } else {
    addLog(run, 'life', '平淡', '这一年平平淡淡，没有什么值得记住的事。', [])
  }

  // 3) 资源够了自动尝试突破（主修 + 双修）
  const autoUp = (p) => {
    if (!p) return
    const d = pathDef(p.kind)
    if (p.level + 1 < d.ladder.length && p.progress >= d.ladder[p.level + 1].threshold) {
      if (!ev || !ev.eff || !(ev.eff.realmUp || ev.eff.pathUp)) tryPathBreakthrough(run, p)
    }
  }
  autoUp(run.path)
  autoUp(run.path2)

  // 4) 体质自然恢复
  if (run.age % 10 === 0) {
    const cap = run.baseHp * 2 + 10
    if (run.attrs.hp < cap) run.attrs.hp++
  }

  // 5) 死亡判定
  if (run.alive) {
    if (run.attrs.hp <= 0) kill(run, '体魄衰败')
    else if (run.age >= lifespan(run)) kill(run, run.age > 200 ? '寿元耗尽' : '寿终正寝')
  }
  return run.log.length > before ? run.log[run.log.length - 1] : null
}

/* ------------------------------------------------------------------ */
/* 结算                                                                */
/* ------------------------------------------------------------------ */

export function score(run) {
  let s = run.age
  s += run.attrs.iq * 3 + run.attrs.eq * 3 + run.attrs.hp * 3 + run.attrs.luck * 3
  if (run.path) s += run.path.level * 120
  if (run.path2) s += run.path2.level * 80
  s += run.items.length * 20
  s += run.talents.length * 10
  return Math.round(s)
}

export function rankOf(run) {
  const s = score(run)
  if (s >= 3000) return { rank: 5, name: '传说' }
  if (s >= 1800) return { rank: 4, name: '史诗' }
  if (s >= 1000) return { rank: 3, name: '稀有' }
  if (s >= 500) return { rank: 2, name: '优秀' }
  return { rank: 1, name: '平凡' }
}

export function resolveEnding(run) {
  let best = null
  for (let i = 0; i < ALL_ENDINGS.length; i++) {
    const d = ALL_ENDINGS[i]
    if (!matchReq(run, d.req)) continue
    if (d.ageMax && run.age > d.ageMax) continue
    if (!best || (d.rank || 1) > (best.rank || 1)) best = d
  }
  return best || { id: 'D000', name: '无名一生', desc: '如浮萍一般，来过，又走了。', rank: 1 }
}

export function unlockedAchievements(run) {
  const out = []
  for (let i = 0; i < ALL_ACHIEVEMENTS.length; i++) {
    const a = ALL_ACHIEVEMENTS[i]
    if (matchReq(run, a.req)) out.push(a.id)
  }
  return out
}

export function summary(run) {
  normalizeRun(run)
  if (run.alive) kill(run, '主动结束')
  const d = resolveEnding(run)
  run.ending = d
  const extras = []
  if (run.path) {
    const d2 = pathDef(run.path.kind)
    const top = d2.ladder[d2.ladder.length - 1].name
    extras.push(realmName(run) === top ? ('已至' + top) : ('止步于' + realmName(run)))
  }
  if (run.path2) extras.push('双修 · ' + pathDef(run.path2.kind).name)
  return {
    age: run.age,
    realm: realmName(run),
    pathName: pathName(run),
    ending: d,
    rank: rankOf(run),
    score: score(run),
    achievements: unlockedAchievements(run),
    talents: run.talents.slice(),
    items: run.items.slice(),
    extras: extras
  }
}

export function codex() {
  return {
    talents: ALL_TALENTS,
    items: ALL_ITEMS,
    endings: ALL_ENDINGS,
    achievements: ALL_ACHIEVEMENTS,
    paths: PATH_LIST
  }
}

export function counts() {
  return {
    talents: ALL_TALENTS.length,
    events: ALL_EVENTS.length,
    items: ALL_ITEMS.length,
    endings: ALL_ENDINGS.length,
    achievements: ALL_ACHIEVEMENTS.length,
    paths: PATH_LIST.length
  }
}
