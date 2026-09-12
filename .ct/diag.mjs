const E = await import('./core/engine.js')
let found = 0
for (let s = 1; s <= 120 && found < 2; s++) {
  const run = E.newRun(s * 31)
  const c = E.drawTalents(run, Math.min(10, E.counts().talents))
  E.chooseTalents(run, c.slice(0, Math.min(3, c.length)).map(t => t.id))
  E.alloc(run, { iq: 5, eq: 5, hp: 5, luck: 5 })
  let guard = 0
  while (run.alive && guard < 20000) { E.step(run); guard++ }
  if (run.cultivation && run.cultivation.active) {
    found++
    console.log('--- 种子', s*31, ' 死亡年龄', run.age, ' 境界', E.realmName(run), ' 修为', Math.round(run.cultivation.progress), ' level', run.cultivation.level, ' 道心', run.cultivation.daoHeart)
    const logs = run.log.filter(l => l.kind === '修仙' || l.kind === '突破' || l.kind === '天劫')
    logs.slice(0, 8).forEach(l => console.log('    [' + l.age + '] ' + l.kind + ' ' + l.title))
    console.log('    突破次数', logs.filter(l=>l.kind==='突破').length, ' 总年限', run.age)
  }
}
