/**
 * 修仙事件（种子数据，内容扩充请替换本文件，保持 schema）
 * 除入门机缘外都要带 req.cultivation 或 req.realm
 */
export const EVENTS_CULTIVATION = [
  { id: 'C001', title: '灵根测试', text: '仙门开山收徒，测灵石的微光落在你身上，长老挑起了眉。', age: [10, 20], weight: 3, kind: 'cultivate', eff: { spiritRoot: 'dual' } },
  { id: 'C002', title: '闭关', text: '你在洞府中枯坐一年，灵气在经脉里缓缓流转。', age: [12, 200], weight: 14, kind: 'cultivate', req: { cultivation: true }, eff: { progress: 12 } },
  { id: 'C003', title: '顿悟', text: '一片落叶飘过，你忽然明白了什么，体内灵机一颤。', age: [12, 200], weight: 6, kind: 'cultivate', req: { cultivation: true, iq: 10 }, eff: { progress: 40, daoHeart: 2 } },
  { id: 'C004', title: '心魔', text: '闭关时旧事翻涌，你差点在幻境里出不来。', age: [20, 300], weight: 8, kind: 'danger', req: { cultivation: true }, eff: { daoHeart: -1, hp: -1 } },
  { id: 'C005', title: '上古洞府', text: '你在山腹里找到一座洞府，案上还留着半卷功法。', age: [20, 400], weight: 3, kind: 'item', req: { cultivation: true, luck: 8 }, eff: { item: 'I001', progress: 30 } },
  { id: 'C006', title: '雷劫', text: '你的气息引动天象，乌云压顶，雷光在云中游走。', age: [60, 500], weight: 6, kind: 'cultivate', req: { cultivation: true, realm: 8 }, eff: { tribulation: true } },
  { id: 'C007', title: '冲关', text: '修为已然圆满，你盘膝而坐，准备冲击下一境界。', age: [15, 500], weight: 10, kind: 'cultivate', req: { cultivation: true }, eff: { realmUp: true } }
]
