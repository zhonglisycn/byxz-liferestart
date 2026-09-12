/**
 * 《人生重开 · 修仙》内核
 *
 * 纯 JS，不依赖任何系统接口，可直接在 Node 里单测。
 * 一次"人生"= 抽天赋（词条）→ 分配属性 → 逐年前进（事件/修仙/突破/死亡）→ 结算。
 *
 * 数据结构约定见 docs/内容规范.md
 */

import { TALENTS } from './content/talents.js'
import { EVENTS_LIFE } from './content/events_life.js'
import { EVENTS_CULTIVATION } from './content/events_cultivation.js'
import { ITEMS } from './content/items.js'
import { ENDINGS } from './content/endings.js'
import { ACHIEVEMENTS } from './content/achievements.js'

/* ------------------------------------------------------------------ */
/* 境界体系                                                            */
/* ------------------------------------------------------------------ */

/** 境界：名称 / 修为门槛 / 寿命加成 / 属性加成 / 突破基础成功率 */
export const REALMS = [
  { name: '凡体', threshold: 0, life: 0, attr: 0, rate: 0 },
  { name: '炼气一层', threshold: 10, life: 20, attr: 0, rate: 0.9 },
  { name: '炼气三层', threshold: 30, life: 40, attr: 1, rate: 0.85 },
  { name: '炼气六层', threshold: 60, life: 60, attr: 1, rate: 0.8 },
  { name: '炼气九层', threshold: 100, life: 80, attr: 2, rate: 0.75 },
  { name: '筑基初期', threshold: 160, life: 150, attr: 3, rate: 0.65 },
  { name: '筑基中期', threshold: 240, life: 200, attr: 4, rate: 0.6 },
  { name: '筑基后期', threshold: 340, life: 260, attr: 5, rate: 0.55 },
  { name: '金丹期', threshold: 480, life: 400, attr: 7, rate: 0.45 },
  { name: '金丹圆满', threshold: 660, life: 500, attr: 9, rate: 0.4 },
  { name: '元婴期', threshold: 900, life: 800, attr: 12, rate: 0.32 },
  { name: '化神期', threshold: 1200, life: 1200, attr: 16, rate: 0.25 },
  { name: '炼虚期', threshold: 1600, life: 1800, attr: 20, rate: 0.2 },
  { name: '合体期', threshold: 2100, life: 2600, attr: 25, rate: 0.15 },
  { name: '大乘期', threshold: 2700, life: 3600, attr: 30, rate: 0.1 },
  { name: '渡劫期', threshold: 3400, life: 5000, attr: 36, rate: 0.07 },
  { name: '仙人', threshold: 4200, life: 9999, attr: 50, rate: 0 }
]

export const RARITY_NAME = ['', '凡品', '灵品', '仙品', '神品']

export function realmName(run) {
  const c = run.cultivation
  if (!c || !c.active) return '凡体'
  return REALMS[Math.min(c.level, REALMS.length - 1)].name
}

/* ------------------------------------------------------------------ */
/* 随机数（可复现）                                                     */
/* ------------------------------------------------------------------ */

/** 用 run.rngA 作为状态的可序列化随机数（这样整局人生能存进 storage） */
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
/* 查询表                                                              */
/* ------------------------------------------------------------------ */

const TALENT_MAP = {}
const ITEM_MAP = {}
for (let i = 0; i < TALENTS.length; i++) TALENT_MAP[TALENTS[i].id] = TALENTS[i]
for (let i = 0; i < ITEMS.length; i++) ITEM_MAP[ITEMS[i].id] = ITEMS[i]

export function talentById(id) { return TALENT_MAP[id] || null }
export function itemById(id) { return ITEM_MAP[id] || null }
export const ALL_EVENTS = EVENTS_LIFE.concat(EVENTS_CULTIVATION)

/* ------------------------------------------------------------------ */
/* 开局                                                                */
/* ------------------------------------------------------------------ */

export const ATTRS = ['iq', 'eq', 'hp', 'luck']
export const ATTR_NAME = { iq: '智力', eq: '情商', hp: '体质', luck: '幸运' }
export const TOTAL_POINTS = 20

export function newRun(seed) {
  return {
    seed: seed || Math.floor(Math.random() * 1e9),
    rngA: ((seed || Math.floor(Math.random() * 1e9)) >>> 0) || 12345,
    age: 0,
    attrs: { iq: 0, eq: 0, hp: 0, luck: 0 },
    talents: [],
    items: [],
    flags: {},
    bonus: { lifespan: 0, progressRate: 0, breakthrough: 0, luckRate: 0 },
    cultivation: null,
    log: [],
    alive: true,
    death: '',
    ending: null,
    started: false
  }
}

/** 抽 n 个候选天赋（按稀有度加权，不重复） */
export function drawTalents(run, n) {
  const pool = []
  for (let i = 0; i < TALENTS.length; i++) {
    const t = TALENTS[i]
    pool.push({ t: t, weight: Math.max(1, 6 - t.rarity * 1.4) })
  }
  const out = []
  const used = {}
  let guard = 0
  while (out.length < n && guard < 2000) {
    guard++
    const p = pickWeighted(pool, run)
    if (!p || used[p.t.id]) continue
    used[p.t.id] = true
    out.push(p.t)
  }
  return out
}

function applyEff(run, eff, opts) {
  if (!eff) return []
  const changes = []
  for (let i = 0; i < ATTRS.length; i++) {
    const k = ATTRS[i]
    if (typeof eff[k] === 'number' && eff[k] !== 0) {
      run.attrs[k] = Math.max(0, run.attrs[k] + eff[k])
      changes.push(ATTR_NAME[k] + (eff[k] > 0 ? '+' : '') + eff[k])
    }
  }
  if (typeof eff.lifespan === 'number') { run.bonus.lifespan += eff.lifespan }
  if (typeof eff.progressRate === 'number') { run.bonus.progressRate += eff.progressRate }
  if (typeof eff.breakthrough === 'number') { run.bonus.breakthrough += eff.breakthrough }
  if (typeof eff.luckRate === 'number') { run.bonus.luckRate += eff.luckRate }
  if (eff.flag) run.flags[eff.flag] = true
  if (eff.item && !hasItem(run, eff.item)) {
    run.items.push(eff.item)
    const it = ITEM_MAP[eff.item]
    if (it) changes.push('获得' + it.kind + '「' + it.name + '」')
  }
  if (eff.daoHeart && run.cultivation) run.cultivation.daoHeart = Math.max(0, run.cultivation.daoHeart + eff.daoHeart)
  if (eff.progress) addProgress(run, eff.progress)
  if (eff.spiritRoot) awaken(run, eff.spiritRoot)
  if (eff.forbidCultivation) run.flags.noCultivation = true
  if (eff.realmUp) tryBreakthrough(run, true)
  if (eff.tribulation) tribulation(run)
  // 大难不死：体质被打空时，按幸运给一次活命机会（一生一次）
  if (run.attrs.hp <= 0 && !run.flags.saved_once && !eff.die) {
    const chance = 0.35 + run.attrs.luck * 0.03
    if (rnd(run) < chance) {
      run.attrs.hp = 1
      run.flags.saved_once = true
      changes.push('大难不死')
      addLog(run, 'danger', '大难不死', '你在鬼门关前走了一遭，硬是撑了过来。', ['体质回1'])
    }
  }
  if (eff.die) kill(run, eff.die)
  else if (eff.dieChance && rnd(run) < eff.dieChance) kill(run, '意外身亡')
  return changes
}

export function hasItem(run, id) { return run.items.indexOf(id) >= 0 }
export function hasFlag(run, f) { return !!run.flags[f] }

/** 选定天赋（3 个），应用初始效果 */
export function chooseTalents(run, ids) {
  run.talents = []
  for (let i = 0; i < ids.length; i++) {
    const t = TALENT_MAP[ids[i]]
    if (!t) continue
    run.talents.push(t.id)
    applyEff(run, t.eff)
  }
}

/** 属性分配：必须正好 20 点、每项 0..20 */
export function alloc(run, attrs) {
  let sum = 0
  for (let i = 0; i < ATTRS.length; i++) {
    const v = attrs[ATTRS[i]] | 0
    if (v < 0 || v > TOTAL_POINTS) return false
    sum += v
  }
  if (sum !== TOTAL_POINTS) return false
  for (let i = 0; i < ATTRS.length; i++) run.attrs[ATTRS[i]] = attrs[ATTRS[i]] | 0
  run.started = true
  return true
}

/* ------------------------------------------------------------------ */
/* 修仙                                                                */
/* ------------------------------------------------------------------ */

export function awaken(run, root) {
  if (run.cultivation || run.flags.noCultivation) return
  run.cultivation = {
    active: true,
    root: root || 'dual',
    level: 1,          // 直接进炼气一层
    progress: 0,
    daoHeart: 5,
    fail: 0
  }
  run.bonus.lifespan += REALMS[1].life
  addLog(run, '修仙', '灵根觉醒', '你体内灵根苏醒（' + rootName(root) + '），自此踏上修仙之路。', [])
}

export function rootName(r) {
  const m = { single: '单灵根', dual: '双灵根', triple: '三灵根', pseudo: '伪灵根', heaven: '天灵根' }
  return m[r] || '五行灵根'
}

/** 每年的修为增长 */
export function addProgress(run, delta) {
  if (!run.cultivation || !run.cultivation.active) return
  const c = run.cultivation
  const rate = 1 + run.bonus.progressRate + run.attrs.iq * 0.03 + c.daoHeart * 0.02
  c.progress += delta * rate
}

function realmLifeBonus(level) { return REALMS[Math.min(level, REALMS.length - 1)].life }

/** 尝试突破；auto=true 表示"修为够了自动尝试" */
export function tryBreakthrough(run, auto) {
  const c = run.cultivation
  if (!c || !c.active) return false
  const next = c.level + 1
  if (next >= REALMS.length) return false
  const need = REALMS[next].threshold
  if (c.progress < need) return false
  const base = REALMS[next].rate
  const chance = Math.max(0.03, Math.min(0.98, base + run.bonus.breakthrough + run.attrs.luck * 0.01 + c.daoHeart * 0.01))
  if (rnd(run) < chance) {
    c.level = next
    run.bonus.lifespan += realmLifeBonus(next)
    const a = REALMS[next].attr
    if (a) {
      run.attrs.iq += a
      run.attrs.hp += a
    }
    addLog(run, '突破', '破境 · ' + REALMS[next].name, '修为圆满，你成功突破至「' + REALMS[next].name + '」，寿元大增。', [])
    return true
  }
  c.fail++
  c.daoHeart = Math.max(0, c.daoHeart - 1)
  if (rnd(run) < 0.25) {
    run.attrs.hp = Math.max(0, run.attrs.hp - 2)
    addLog(run, '突破', '突破失败', '冲击「' + REALMS[next].name + '」失败，气机逆冲，你受了不轻的伤。', ['体质-2'])
    if (run.attrs.hp <= 0) kill(run, '走火入魔')
  } else {
    addLog(run, '突破', '突破失败', '冲击「' + REALMS[next].name + '」失败，你稳住心神，改日再战。', [])
  }
  return false
}

function tribulation(run) {
  const c = run.cultivation
  if (!c || !c.active) return
  const power = 0.5 + run.attrs.hp * 0.02 + c.daoHeart * 0.01 + run.bonus.breakthrough
  if (rnd(run) < power) {
    addLog(run, '天劫', '渡过天劫', '雷云散去，你屹立劫下，气息更胜往昔。', [])
    c.daoHeart += 2
    addProgress(run, 60)
  } else {
    run.attrs.hp = Math.max(0, run.attrs.hp - 3)
    addLog(run, '天劫', '天劫受创', '天雷加身，你重伤垂危。', ['体质-3'])
    if (run.attrs.hp <= 0) kill(run, '殒于天劫')
  }
}

/* ------------------------------------------------------------------ */
/* 事件                                                                */
/* ------------------------------------------------------------------ */

function addLog(run, kind, title, text, changes) {
  run.log.push({ age: run.age, kind: kind, title: title, text: text, changes: changes || [] })
}

function matchReq(run, req) {
  if (!req) return true
  for (let i = 0; i < ATTRS.length; i++) {
    const k = ATTRS[i]
    if (typeof req[k] === 'number' && run.attrs[k] < req[k]) return false
  }
  if (req.lt) {
    for (const k in req.lt) if (run.attrs[k] >= req.lt[k]) return false
  }
  if (req.flags) for (let i = 0; i < req.flags.length; i++) if (!run.flags[req.flags[i]]) return false
  if (req.notFlags) for (let i = 0; i < req.notFlags.length; i++) if (run.flags[req.notFlags[i]]) return false
  if (req.items) for (let i = 0; i < req.items.length; i++) if (!hasItem(run, req.items[i])) return false
  if (req.talents) for (let i = 0; i < req.talents.length; i++) if (run.talents.indexOf(req.talents[i]) < 0) return false
  if (req.cultivation && !(run.cultivation && run.cultivation.active)) return false
  if (req.noCultivation && run.cultivation && run.cultivation.active) return false
  if (typeof req.realm === 'number') {
    const lv = run.cultivation && run.cultivation.active ? run.cultivation.level : 0
    if (lv < req.realm) return false
  }
  if (typeof req.ageMin === 'number' && run.age < req.ageMin) return false
  return true
}

/** 取当前年龄可用的事件池 */
export function candidates(run) {
  const out = []
  for (let i = 0; i < ALL_EVENTS.length; i++) {
    const e = ALL_EVENTS[i]
    if (run.age < e.age[0] || run.age > e.age[1]) continue
    if (e.once !== false && hasFlag(run, 'ev_' + e.id)) continue
    if (!matchReq(run, e.req)) continue
    let w = e.weight || 10
    if (e.kind === 'life' && run.bonus.luckRate) {
      // 幸运加成只影响"好事"权重（这里近似为：正向事件加权）
      const positive = (e.eff && (e.eff.luck > 0 || e.eff.iq > 0 || e.eff.item))
      if (positive) w = w * (1 + run.bonus.luckRate)
    }
    out.push({ e: e, weight: w })
  }
  return out
}

/** 寿命：基础 60 + 体质/幸运 + 天赋加成 + 境界加成 */
export function lifespan(run) {
  return 60 + run.attrs.hp * 2 + run.attrs.luck + run.bonus.lifespan
}

function kill(run, reason) {
  if (!run.alive) return
  run.alive = false
  run.death = reason || '寿终'
}

/** 推进一年：返回这一年发生的事（写入 run.log） */
export function step(run) {
  if (!run.alive) return null
  run.age++
  const before = run.log.length

  // 1) 修为自然增长
  if (run.cultivation && run.cultivation.active) addProgress(run, 4 + run.attrs.hp * 0.1)

  // 2) 抽事件
  const pool = candidates(run)
  const chosen = pickWeighted(pool, run) || null
  let ev = null
  if (chosen) {
    ev = chosen.e
    if (ev.once !== false) run.flags['ev_' + ev.id] = true
    const changes = applyEff(run, ev.eff)
    addLog(run, ev.kind || 'life', ev.title || '日常', ev.text, changes)
  } else {
    addLog(run, 'life', '平淡', '这一年平平淡淡，没有什么值得记住的事。', [])
  }

  // 3) 修为够了自动尝试突破
  const c = run.cultivation
  if (c && c.active && c.level + 1 < REALMS.length && c.progress >= REALMS[c.level + 1].threshold) {
    if (!ev || !ev.eff || !ev.eff.realmUp) tryBreakthrough(run, true)
  }

  // 4) 死亡判定
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
  const c = run.cultivation
  const realmLv = c && c.active ? c.level : 0
  let s = run.age * 1
  s += run.attrs.iq * 3 + run.attrs.eq * 3 + run.attrs.hp * 3 + run.attrs.luck * 3
  s += realmLv * 120
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

/** 匹配结局：按 rank 从高到低取第一个满足条件的 */
export function resolveEnding(run) {
  let best = null
  for (let i = 0; i < ENDINGS.length; i++) {
    const d = ENDINGS[i]
    if (!matchReq(run, d.req)) continue
    if (d.ageMax && run.age > d.ageMax) continue
    if (!best || (d.rank || 1) > (best.rank || 1)) best = d
  }
  return best || { id: 'D000', name: '无名一生', desc: '如浮萍一般，来过，又走了。', rank: 1 }
}

export function unlockedAchievements(run) {
  const out = []
  for (let i = 0; i < ACHIEVEMENTS.length; i++) {
    const a = ACHIEVEMENTS[i]
    if (matchReq(run, a.req)) out.push(a.id)
  }
  return out
}

export function summary(run) {
  if (run.alive) kill(run, '主动结束')
  const d = resolveEnding(run)
  run.ending = d
  const extras = []
  if (run.cultivation && run.cultivation.active) extras.push(/仙人/.test(realmName(run)) ? '飞升成仙' : '止步于' + realmName(run))
  return {
    age: run.age,
    realm: realmName(run),
    ending: d,
    rank: rankOf(run),
    score: score(run),
    achievements: unlockedAchievements(run),
    talents: run.talents.slice(),
    items: run.items.slice(),
    extras: extras
  }
}

/** 图鉴用：全部词条/物品/结局/成就的清单 */
export function codex() {
  return {
    talents: TALENTS,
    items: ITEMS,
    endings: ENDINGS,
    achievements: ACHIEVEMENTS
  }
}

export function counts() {
  return {
    talents: TALENTS.length,
    events: ALL_EVENTS.length,
    items: ITEMS.length,
    endings: ENDINGS.length,
    achievements: ACHIEVEMENTS.length,
    realms: REALMS.length
  }
}
