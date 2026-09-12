/**
 * 结局（种子数据）：rank 1~5 = 平凡/优秀/稀有/史诗/传说
 */
export const ENDINGS = [
  { id: 'D001', name: '早夭', rank: 1, desc: '还没来得及看看这个世界。', req: { lt: { hp: 3 } }, ageMax: 10 },
  { id: 'D002', name: '平凡一生', rank: 1, desc: '上班下班，就这样过完了一辈子。', req: {} },
  { id: 'D003', name: '儿孙满堂', rank: 2, desc: '晚年热闹，你笑着闭上了眼。', req: { eq: 10, ageMin: 70 } },
  { id: 'D004', name: '金丹修士', rank: 3, desc: '一枚金丹悬于丹田，你已非常人。', req: { cultivation: true, realm: 8 } },
  { id: 'D005', name: '飞升成仙', rank: 5, desc: '你踏破虚空，从此世间再无你的传说。', req: { cultivation: true, realm: 16 } }
]
