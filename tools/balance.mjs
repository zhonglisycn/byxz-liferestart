/**
 * 平衡统计：跑 N 局，看年龄/修仙率/境界/结局/成就的分布
 * 用法：node tools/balance.mjs [局数]
 */
const E = await import('./core/engine.js')
// 内核不再自带内容：先注入内容池（与 app.ux 里装配的是同一份结构）
const C = await import('./core/content/index.js')
E.setContent(C.buildContent())

const N = parseInt(process.argv[2] || '300', 10)

const allocations = [
  { iq: 5, eq: 5, hp: 5, luck: 5 },
  { iq: 8, eq: 4, hp: 6, luck: 2 },
  { iq: 4, eq: 4, hp: 4, luck: 8 },
  { iq: 10, eq: 3, hp: 5, luck: 2 },
  { iq: 3, eq: 3, hp: 10, luck: 4 }
]

const stats = {
  ages: [], cult: 0, realm: {}, endings: {}, ach: 0, items: 0, talents: 0,
  died: {}, scores: []
}

for (let i = 0; i < N; i++) {
  const run = E.newRun(i * 977 + 13)
  const want = Math.min(3, E.counts().talents)
  const cands = E.drawTalents(run, Math.max(want, 6))
  E.chooseTalents(run, cands.slice(0, want).map(t => t.id))
  E.alloc(run, allocations[i % allocations.length])
  let guard = 0
  while (run.alive && guard < 40000) { E.step(run); guard++ }
  const s = E.summary(run)
  stats.ages.push(s.age)
  stats.scores.push(s.score)
  if (run.path) {
    stats.cult++
    stats.paths = stats.paths || {}
    stats.paths[run.path.kind] = (stats.paths[run.path.kind] || 0) + 1
    const r = E.realmName(run)
    const key = run.path.kind + '·' + r
    stats.realm[key] = (stats.realm[key] || 0) + 1
  }
  if (run.path2) stats.dual = (stats.dual || 0) + 1

  stats.endings[s.ending.name] = (stats.endings[s.ending.name] || 0) + 1
  stats.died[run.death] = (stats.died[run.death] || 0) + 1
  stats.ach += s.achievements.length
  stats.items += run.items.length
  stats.talents += run.talents.length
}

const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0
const pct = n => (100 * n / N).toFixed(1) + '%'
function top(obj, k) {
  return Object.keys(obj).sort((a, b) => obj[b] - obj[a]).slice(0, k)
    .map(x => x + ' ×' + obj[x]).join('  ')
}

console.log('局数 ' + N)
const sorted = stats.ages.slice().sort((a, b) => a - b)
const med = sorted[Math.floor(sorted.length / 2)] || 0
const p90 = sorted[Math.floor(sorted.length * 0.9)] || 0
console.log('享年 中位数 ' + med + ' 岁 / 平均 ' + avg(stats.ages) + ' 岁 / 前10% ' + p90 + ' 岁    平均评分 ' + avg(stats.scores))
console.log('入体系率 ' + pct(stats.cult) + '   平均物品 ' + (stats.items / N).toFixed(2) + ' 件   平均成就 ' + (stats.ach / N).toFixed(2) + ' 个')
console.log('死亡原因 Top6: ' + top(stats.died, 6))
console.log('结局 Top8: ' + top(stats.endings, 8))
console.log('体系分布: ' + JSON.stringify(stats.paths || {}) + '   双修 ' + (stats.dual || 0) + ' 局')
console.log('境界分布 Top12: ' + top(stats.realm, 12))
const top1 = top(stats.endings, 1)
if (top1) {
  const name = top1.split(' ×')[0]
  const share = (100 * stats.endings[name] / N).toFixed(1)
  console.log('最常见结局「' + name + '」占比 ' + share + '%')
}
