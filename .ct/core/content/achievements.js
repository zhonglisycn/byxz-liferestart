/**
 * 成就（种子数据）
 */
export const ACHIEVEMENTS = [
  { id: 'A001', name: '长命百岁', desc: '活到一百岁', req: { ageMin: 100 } },
  { id: 'A002', name: '天生我材', desc: '某项属性达到 15', req: { iq: 15 } },
  { id: 'A003', name: '筑基之路', desc: '突破到筑基期', req: { cultivation: true, realm: 5 } },
  { id: 'A004', name: '收藏家', desc: '拥有 5 件法宝或丹药', req: { items: ['I001', 'I002', 'I003', 'I004', 'I005'] } },
  { id: 'A005', name: '命硬', desc: '体质跌到 1 还活着', req: { lt: { hp: 2 }, ageMin: 30 } }
]
