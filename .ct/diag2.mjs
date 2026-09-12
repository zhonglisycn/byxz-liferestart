const E = await import('./core/engine.js')
const run = E.newRun(217)
const c = E.drawTalents(run, Math.min(10, E.counts().talents))
console.log('天赋:', c.slice(0,3).map(t => t.name + '(' + JSON.stringify(t.eff) + ')').join(' '))
E.chooseTalents(run, c.slice(0,3).map(t => t.id))
E.alloc(run, { iq: 5, eq: 5, hp: 5, luck: 5 })
console.log('初始属性:', JSON.stringify(run.attrs), '寿命:', E.lifespan(run))
let g = 0
while (run.alive && g < 50) { E.step(run); g++ }
console.log('死因:', run.death, ' 年龄:', run.age)
run.log.forEach(l => console.log('  [' + l.age + '] ' + l.kind + ' ' + l.title + ' | ' + l.text.slice(0,28) + ' | ' + (l.changes||[]).join(',')))
