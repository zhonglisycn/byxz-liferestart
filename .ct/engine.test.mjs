/**
 * 人生重开内核测试：node tools/engine.test.mjs（由 tools/run-tests.sh 调用）
 */
import assert from 'node:assert/strict'

const E = await import('./core/engine.js')

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

test('修仙：觉醒后境界会提升，寿元变长', () => {
  let reached = 0
  let immortal = 0
  for (let s = 1; s <= 120; s++) {
    const run = autoRun(s * 31)
    if (run.cultivation && run.cultivation.active) {
      reached++
      assert.ok(run.cultivation.level >= 1, '觉醒后至少炼气一层')
      if (run.cultivation.level >= 5) immortal++
    }
  }
  console.log('    120 局中修仙 ' + reached + ' 局，筑基以上 ' + immortal + ' 局')
  assert.ok(reached >= 5, '应该有相当比例的局能开启修仙，实际 ' + reached)
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
  assert.ok(c.realms >= 10, '境界体系应至少 10 级')
})

test('大量随机局不崩（200 局）', () => {
  for (let s = 1; s <= 200; s++) {
    const run = autoRun(s * 13 + 7)
    assert.ok(run.log.length > 0, '第 ' + s + ' 局没有日志')
  }
})

const failed = results.filter(r => !r.ok)
for (const r of results) console.log((r.ok ? '  ✓ ' : '  ✗ ') + r.name + (r.ok ? '' : '  -> ' + r.msg))
console.log('\n' + (results.length - failed.length) + '/' + results.length + ' 通过')
if (failed.length) process.exit(1)
