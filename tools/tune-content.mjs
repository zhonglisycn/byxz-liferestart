/**
 * 内容数值微调：把事件里"负面属性"减半（保留正向成长感，减少体质死亡螺旋）
 * 用法：node tools/tune-content.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const C = path.join(process.cwd(), 'src/common/core/content')

function halveNeg(v) {
  if (typeof v !== 'number' || v >= 0) return v
  const n = Math.round(v / 2)
  return n === 0 ? -1 : n
}

async function tune(file, exportName) {
  const p = path.join(C, file)
  const mod = await import('file://' + p.replace(/\\/g, '/'))
  const arr = mod.default || mod[exportName]
  let touched = 0
  const out = arr.map(e => {
    if (!e.eff) return e
    const eff = {}
    for (const k in e.eff) {
      const v = e.eff[k]
      if (['iq', 'eq', 'hp', 'luck'].indexOf(k) >= 0) {
        const nv = halveNeg(v)
        if (nv !== v) touched++
        eff[k] = nv
      } else {
        eff[k] = v
      }
    }
    return Object.assign({}, e, { eff: eff })
  })
  const body = 'export const ' + exportName + ' = [\n' +
    out.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]\n'
  fs.writeFileSync(p, body)
  console.log('已调整 ' + file + '：负面属性 ' + touched + ' 处，共 ' + out.length + ' 条')
}

await tune('events_life.js', 'EVENTS_LIFE')
await tune('events_cultivation.js', 'EVENTS_CULTIVATION')
await tune('events_extra.js', 'EVENTS_EXTRA')
