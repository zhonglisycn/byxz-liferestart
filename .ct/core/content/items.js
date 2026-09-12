/**
 * 物品：法宝 / 丹药 / 灵物 / 功法（种子数据）
 */
export const ITEMS = [
  { id: 'I001', name: '青锋剑', kind: '法宝', rarity: 2, desc: '吹毛断发，剑身泛着幽蓝', eff: { hp: 1, breakthrough: 0.03 } },
  { id: 'I002', name: '聚气丹', kind: '丹药', rarity: 1, desc: '入门丹药，服下可增十年苦修', eff: { progress: 20 } },
  { id: 'I003', name: '万年灵参', kind: '灵物', rarity: 3, desc: '参须已成玉色，闻之精神一振', eff: { lifespan: 60, hp: 2 } },
  { id: 'I004', name: '太虚剑诀', kind: '功法', rarity: 4, desc: '残缺的上古剑经，字字如剑', eff: { progressRate: 0.8, iq: 2 } },
  { id: 'I005', name: '护心镜', kind: '法宝', rarity: 2, desc: '挡住过一次致命一击的旧物', eff: { hp: 2 } }
]
