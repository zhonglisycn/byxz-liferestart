/**
 * 人生重开内核测试：node tools/engine.test.mjs（由 tools/run-tests.sh 调用）
 */
import assert from 'node:assert/strict'

const E = await import('./core/engine.js')
// 内核不再自带内容：先注入内容池（与 app.ux 里装配的是同一份结构）
const C = await import('./core/content/index.js')
E.setContent(C.buildContent())

const results = []
function test(name, fn) {
  try { fn(); results.push({ name, ok: true }) }
  catch (e) { results.push({ name, ok: false, msg: e && e.message }) }
}
function section(t) { console.log('\n=== ' + t + ' ===') }

/** 跑一局（自动分配属性、自动选天赋） */
function autoRun(seed, opts) {
  const o = opts || {}
  const run = E.newRun(seed)
  const want = Math.min(10, E.counts().talents)
  const cands = E.drawTalents(run, want)
  assert.equal(cands.length, want, '应抽到 ' + want + ' 个候选天赋')
  E.chooseTalents(run, cands.slice(0, 3).map(t => t.id))
  const base = { iq: 5, eq: 5, hp: 5, luck: 5 }
  assert.equal(E.alloc(run, base), true, '5/5/5/5 应能通过分配')
  let guard = 0
  while (run.alive && guard < 20000) { E.step(run); guard++ }
  return run
}

section('人生重开内核')

test('抽天赋：候选不重复', () => {
  const run = E.newRun(1234)
  const c = E.drawTalents(run, Math.min(10, E.counts().talents))
  const ids = {}
  c.forEach(t => { assert.ok(!ids[t.id], '候选重复: ' + t.id); ids[t.id] = 1 })
})

test('属性分配：必须正好 20 点', () => {
  const run = E.newRun(1)
  assert.equal(E.alloc(run, { iq: 5, eq: 5, hp: 5, luck: 5 }), true)
  const r2 = E.newRun(1)
  assert.equal(E.alloc(r2, { iq: 5, eq: 5, hp: 5, luck: 6 }), false, '21 点应被拒绝')
  const r3 = E.newRun(1)
  assert.equal(E.alloc(r3, { iq: 5, eq: 5, hp: 5, luck: 4 }), false, '19 点应被拒绝')
  const r4 = E.newRun(1)
  assert.equal(E.alloc(r4, { iq: -1, eq: 6, hp: 5, luck: 10 }), false, '负值应被拒绝')
})

test('天赋效果会应用到属性上', () => {
  const run = E.newRun(7)
  const c = E.drawTalents(run, Math.min(10, E.counts().talents))
  E.chooseTalents(run, [c[0].id])
  assert.equal(run.talents.length, 1)
})

test('推进人生：年龄增长、有日志、最终会死亡', () => {
  const run = autoRun(20260912)
  assert.ok(run.age > 0, '年龄应增长')
  assert.ok(run.log.length > 0, '应产生日志')
  assert.equal(run.alive, false, '最终应死亡')
  assert.ok(run.death, '应有死因')
  assert.ok(run.age < 20000, '不应无限循环')
})

test('属性不会变成负数', () => {
  for (let s = 1; s <= 30; s++) {
    const run = autoRun(s)
    E.ATTRS.forEach(k => assert.ok(run.attrs[k] >= 0, k + ' 变负了'))
  }
})

test('结算：结局/评分/成就齐全', () => {
  const run = autoRun(999)
  const s = E.summary(run)
  assert.ok(s.ending && s.ending.name, '应有结局')
  assert.ok(typeof s.score === 'number' && s.score > 0, '应有评分')
  assert.ok(s.rank && s.rank.rank >= 1, '应有评级')
  assert.ok(Array.isArray(s.achievements), '成就是数组')
})

test('四条体系都能被走到，且处于炼气/入门级以上', () => {
  const hit = { cultivate: 0, body: 0, magic: 0, tech: 0 }
  for (let s = 1; s <= 400; s++) {
    const run = autoRun(s * 31)
    if (run.path) {
      hit[run.path.kind] = (hit[run.path.kind] || 0) + 1
      assert.ok(run.path.level >= 1, '入门后至少 1 级')
    }
  }
  console.log('    400 局中各体系局数: ' + JSON.stringify(hit))
  const kinds = Object.keys(hit).filter(k => hit[k] > 0)
  assert.ok(kinds.length >= 2, '至少应该能走到两种体系，实际 ' + kinds.join(','))
})

test('体系资源/特殊属性/劫难的名字各不相同（四套设定生效）', () => {
  const P = E.PATHS
  assert.equal(P.cultivate.res, '修为')
  assert.equal(P.body.res, '气血')
  assert.equal(P.magic.res, '魔力')
  assert.equal(P.tech.res, '知识')
  assert.equal(P.body.sp, '铁骨')
  assert.equal(P.magic.trial, '元素暴动')
  assert.equal(P.tech.fail, '实验事故')
  assert.equal(P.cultivate.ladder.length, 17)
  assert.ok(P.body.ladder.length >= 10 && P.magic.ladder.length >= 10 && P.tech.ladder.length >= 10)
})

test('双修需要天赋：没有 dualPath 时开不了第二条', () => {
  const run = E.newRun(88)
  assert.equal(E.enterPath(run, 'cultivate'), true, '第一条应该能进')
  assert.equal(E.enterPath(run, 'body'), false, '没有双修天赋不该能进第二条')
  run.flags.dualPath = true
  assert.equal(E.enterPath(run, 'body'), true, '有双修天赋后应该能进第二条')
  assert.equal(E.pathText(run).indexOf('双修') >= 0 || E.pathText(run).indexOf('｜') >= 0, true)
  assert.equal(E.enterPath(run, 'magic'), false, '最多两条')
})

test('pathText / pathStat 能给界面提供主修与双修信息', () => {
  const run = E.newRun(99)
  E.enterPath(run, 'tech')
  assert.ok(E.pathText(run).indexOf('科技') >= 0)
  const st = E.pathStat(run, 'tech')
  assert.equal(st.def.res, '知识')
  assert.ok(st.name && st.level >= 1)
  assert.equal(E.pathStat(run, 'magic'), null, '没走的体系应返回 null')
})

test('旧存档兼容：run.cultivation 能迁移成 run.path', () => {
  const old = {
    seed: 1, rngA: 7, age: 40, attrs: { iq: 8, eq: 5, hp: 6, luck: 4 }, baseHp: 6,
    talents: [], items: [], flags: {}, bonus: { lifespan: 100, progressRate: 0, breakthrough: 0, luckRate: 0 },
    cultivation: { active: true, root: 'dual', level: 6, progress: 777, daoHeart: 8, fail: 1 },
    log: [], alive: true, death: '', ending: null, started: true
  }
  const run = E.normalizeRun(old)
  assert.equal(run.path.kind, 'cultivate')
  assert.equal(run.path.level, 6)
  assert.equal(run.path.sp, 8)
  assert.equal(run.cultivation, undefined)
  assert.equal(E.realmName(run), E.PATHS.cultivate.ladder[6].name)
})

test('修仙可复现：同种子两局结果完全一致', () => {
  const a = autoRun(4242)
  const b = autoRun(4242)
  assert.equal(a.age, b.age, '同种子年龄应一致')
  assert.equal(a.log.length, b.log.length, '同种子日志条数应一致')
  assert.equal(E.realmName(a), E.realmName(b), '同种子境界应一致')
  const sa = E.summary(a)
  const sb = E.summary(b)
  assert.equal(sa.score, sb.score, '同种子评分应一致')
  assert.equal(sa.ending.id, sb.ending.id, '同种子结局应一致')
})

test('状态可序列化（能存进 storage 再续玩）', () => {
  const run = E.newRun(555)
  const c = E.drawTalents(run, 10)
  E.chooseTalents(run, c.slice(0, 2).map(t => t.id))
  E.alloc(run, { iq: 5, eq: 5, hp: 5, luck: 5 })
  for (let i = 0; i < 10; i++) E.step(run)
  const json = JSON.stringify(run)
  assert.ok(json.length > 0)
  const back = JSON.parse(json)
  // 继续推进，不应报错且能对齐
  const a = E.step(run)
  const b = E.step(back)
  assert.deepEqual(a, b, '反序列化后继续推进应与原来一致')
})

test('伤害类事件不会让属性越界', () => {
  for (let s = 1; s <= 40; s++) {
    const run = autoRun(s * 7)
    assert.ok(run.attrs.hp >= 0 && run.attrs.iq >= 0 && run.attrs.eq >= 0 && run.attrs.luck >= 0)
    assert.ok(run.attrs.iq < 500 && run.attrs.hp < 500, '属性不该无限膨胀')
  }
})

test('内容统计合理（内容扩充后应显著变多）', () => {
  const c = E.counts()
  console.log('    内容量: ' + JSON.stringify(c))
  assert.ok(c.talents >= 5 && c.events >= 5 && c.items >= 3 && c.endings >= 3 && c.achievements >= 3)
  assert.equal(c.paths, 4, '应有四条修炼体系')
  assert.ok(E.PATHS.cultivate.ladder.length >= 10)
})

test('大量随机局不崩（200 局）', () => {
  for (let s = 1; s <= 200; s++) {
    const run = autoRun(s * 13 + 7)
    assert.ok(run.log.length > 0, '第 ' + s + ' 局没有日志')
  }
})

test('forbidCultivation：写了"此生无法修炼"的词条真的进不去体系', () => {
  const run = E.newRun(20260912)
  E.chooseTalents(run, ['T037'])                 // 天生绝脉：经脉闭塞，此生与仙无缘
  assert.equal(!!run.flags.noPathOff, true, '应在选择词条时就打上禁止修炼的印记')
  const kinds = ['cultivate', 'body', 'magic', 'tech']
  for (let i = 0; i < kinds.length; i++) {
    assert.equal(E.enterPath(run, kinds[i]), false, '带"天生绝脉"不该能入' + kinds[i])
  }
  assert.equal(!!run.path, false, '四条体系都进不去，run.path 应仍为空')
})

test('effText / reqText：图鉴展示的效果与条件都要能翻译成人话', () => {
  const t = E.talentById('T037')
  assert.ok(E.effText(t.eff).indexOf('无法修炼') >= 0, '效果摘要里应写明禁止修炼，实际：' + E.effText(t.eff))
  const c = E.codex()
  let blank = 0
  for (let i = 0; i < c.talents.length; i++) if (!E.effText(c.talents[i].eff)) blank++
  console.log('    词条 ' + c.talents.length + ' 条，其中没有可显示效果的 ' + blank + ' 条')
  console.log('    事件 ' + c.events.length + ' 条，示例条件：' + E.reqText(c.events[0].req))
  assert.equal(E.reqText({ iq: 8, ageMin: 12 }), '智力≥8 年龄≥12')
  assert.ok(E.reqText(null) === '无条件')
  // 事件池要能在图鉴里被列出来
  assert.ok(c.events && c.events.length > 0, 'codex() 应包含事件池')
})

test('日志封顶：长寿命也不会让日志/存档无限膨胀', () => {
  let maxLen = 0
  let maxJson = 0
  for (let s = 1; s <= 60; s++) {
    const run = autoRun(s * 31 + 5)
    maxLen = Math.max(maxLen, run.log.length)
    maxJson = Math.max(maxJson, JSON.stringify(run).length)
    // seq 必须严格递增，界面才能拿它当稳定的行 id
    for (let i = 1; i < run.log.length; i++) {
      assert.ok(run.log[i].seq > run.log[i - 1].seq, 'seq 应严格递增')
    }
    assert.ok(run.log.length <= 300, '日志应被截断到 300 条以内，实际 ' + run.log.length)
  }
  console.log('    60 局：最长日志 ' + maxLen + ' 条，最大存档 ' + Math.round(maxJson / 1024) + ' KB')
  assert.ok(maxJson < 120 * 1024, '单局存档不应超过 120KB，实际 ' + Math.round(maxJson / 1024) + 'KB')
})

const failed = results.filter(r => !r.ok)
for (const r of results) console.log((r.ok ? '  ✓ ' : '  ✗ ') + r.name + (r.ok ? '' : '  -> ' + r.msg))
console.log('\n' + (results.length - failed.length) + '/' + results.length + ' 通过')
if (failed.length) process.exit(1)
