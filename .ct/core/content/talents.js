/**
 * 天赋词条（种子数据，内容扩充请替换本文件，保持 schema）
 * 见 docs/内容规范.md
 */
export const TALENTS = [
  { id: 'T001', name: '过目不忘', rarity: 2, tag: '智慧', desc: '看一遍就记住，考试从不复习', eff: { iq: 2 } },
  { id: 'T002', name: '铜皮铁骨', rarity: 2, tag: '体质', desc: '皮糙肉厚，很少生病', eff: { hp: 3 } },
  { id: 'T003', name: '天生灵根', rarity: 4, tag: '修仙', desc: '娘胎里就带着灵根', eff: { spiritRoot: 'dual', daoHeart: 3 } },
  { id: 'T004', name: '锦鲤附体', rarity: 3, tag: '幸运', desc: '运气好得不像话', eff: { luck: 3, luckRate: 0.4 } },
  { id: 'T005', name: '社恐', rarity: 1, tag: '社交', desc: '人多的地方就浑身难受', eff: { eq: -2, iq: 1 } }
]
