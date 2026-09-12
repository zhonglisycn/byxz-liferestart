/**
 * 词条联动事件：给"天赋词条"打上的 flag 一个真实后果
 *
 * 设计意图：词条不只是数值加成，抽到「活不过三十」「夺舍体质」「机械飞升图」这类词条后，
 * 人生里会真的遇到对应的事。req.flags 就是这些词条的 flag（见 talents_*.js）。
 * id 段 V001 ~ V099
 */
export const EVENTS = [
  // ---- 诡异类：代价与转机 ----
  { id: 'V001', title: '道体反噬', text: '先天道体修炼极快，可这副身子也在飞快地老去。', age: [30, 300], weight: 6, kind: 'danger', req: { flags: ['innate_dao_body'], ageMin: 30 }, eff: { lifespan: -25, progress: 80 } },
  { id: 'V002', title: '另一个声音', text: '深夜里体内的另一个声音开口了，它想要这具身体。', age: [18, 200], weight: 5, kind: 'danger', req: { flags: ['body_seized'] }, eff: { hp: -2, daoHeart: 3, flag: 'seized_resisted' } },
  { id: 'V003', title: '它退让了', text: '你死守住神台，那个声音终于沉了下去，留给你一段记忆。', age: [20, 300], weight: 4, kind: 'cultivate', req: { flags: ['seized_resisted'] }, eff: { progress: 120, daoHeart: 2 } },
  { id: 'V004', title: '看见不该看的', text: '诡眼又开了。你看见了站在人群里的那些"东西"。', age: [10, 200], weight: 6, kind: 'danger', req: { flags: ['ghost_eye'] }, eff: { hp: -1, daoHeart: 2, flag: 'saw_beyond' } },
  { id: 'V005', title: '梦里授道', text: '梦里那位前辈又来了，这次他直接把手按在了你额头上。', age: [10, 300], weight: 7, kind: 'cultivate', req: { flags: ['dream_teacher'] }, eff: { progress: 60, iq: 1 } },
  { id: 'V006', title: '前世残篇', text: '某个瞬间你忽然记起了前世的功法，指诀自己动了起来。', age: [12, 300], weight: 6, kind: 'cultivate', req: { flags: ['past_life'] }, eff: { progress: 50, iq: 1 } },
  { id: 'V007', title: '而立之关', text: '相士说你活不过三十。二十九岁那年冬天，你咳出了血。', age: [28, 30], weight: 20, kind: 'danger', req: { flags: ['short_life'] }, eff: { hp: -2, dieChance: 0.18 } },
  { id: 'V008', title: '逆天改命', text: '你硬生生熬过了那道坎。从此命数里再没有"早夭"两个字。', age: [30, 40], weight: 8, kind: 'life', req: { flags: ['short_life'], ageMin: 30 }, eff: { luck: 3, lifespan: 40, flag: 'defied_fate' } },
  { id: 'V009', title: '阎王再叩门', text: '第二次走到鬼门关前，你还是没进去。', age: [30, 400], weight: 6, kind: 'danger', req: { flags: ['died_once'] }, eff: { dieChance: 0.02, luck: 2, flag: 'death_denied_twice' } },
  { id: 'V010', title: '借命到账', text: '当年借来的寿元，如今开始一笔一笔地还了。', age: [60, 600], weight: 6, kind: 'danger', req: { flags: ['borrow_life'] }, eff: { lifespan: -40, progress: 100 } },

  // ---- 神品类：各体系的终极契机 ----
  { id: 'V011', title: '道种萌发', text: '天生道种终于抽枝，你静坐三日，天地灵气自来。', age: [15, 400], weight: 6, kind: 'cultivate', req: { flags: ['dao_seed'], cultivation: true }, eff: { progress: 200, breakthrough: 0.05 } },
  { id: 'V012', title: '识海传承', text: '识海里那道上古印记解封，法神的经验涌了进来。', age: [15, 400], weight: 6, kind: 'cultivate', req: { flags: ['mage_legacy'], path: 'magic' }, eff: { progress: 220, sp: 2 } },
  { id: 'V013', title: '蓝图动工', text: '你把脑子里那张飞升蓝图铺在桌上，第一次看清了全貌。', age: [20, 600], weight: 6, kind: 'cultivate', req: { flags: ['mech_ascend'], path: 'tech' }, eff: { progress: 220, iq: 2 } },
  { id: 'V014', title: '龙象初成', text: '龙象之力终于被你完全炼化，举手投足都带着风。', age: [15, 400], weight: 6, kind: 'cultivate', req: { flags: ['dragon_elephant'], path: 'body' }, eff: { progress: 200, hp: 2 } },
  { id: 'V015', title: '诡异开花', text: '埋在你体内的那颗种子，在这一天裂开了。', age: [30, 500], weight: 4, kind: 'danger', req: { flags: ['weird_seed'] }, eff: { hp: -3, dieChance: 0.08, flag: 'weird_bloomed', progress: 150 } },
  { id: 'V016', title: '神机一算', text: '你掐指一算，忽然算出了自己剩下多少年。', age: [25, 500], weight: 5, kind: 'life', req: { flags: ['divine_calc'] }, eff: { luck: 2, lifespan: 20, flag: 'knows_fate' } },
  { id: 'V017', title: '两路对撞', text: '两条脉路在体内撞了一次，痛得你满地打滚，醒来却觉得通了。', age: [20, 500], weight: 6, kind: 'cultivate', req: { flags: ['dual_meridian'] }, eff: { hp: -1, progress: 120, sp: 1 } },
  { id: 'V018', title: '诸天垂青', text: '你在绝境里被推了一把，出手的不知道是谁。', age: [20, 800], weight: 4, kind: 'life', req: { flags: ['heaven_favor'] }, eff: { luck: 3, hp: 1, flag: 'saved_by_heaven' } },

  // ---- 梗类：给生活加一点回响 ----
  { id: 'V019', title: '猫的重量', text: '你养的那只猫越来越重，夜里压在腿上，你却舍不得挪开。', age: [20, 90], weight: 8, kind: 'life', req: { flags: ['cat_owner'] }, eff: { eq: 1, luck: 1 } },
  { id: 'V020', title: '猫走的那天', text: '它在你的手心里睡了过去，你哭了整整一晚。', age: [40, 120], weight: 6, kind: 'life', req: { flags: ['cat_owner'], ageMin: 40 }, eff: { eq: 2, lifespan: 10, flag: 'cat_farewell' } },
  { id: 'V021', title: '终于上岸', text: '考了这么多年，这次名单上终于有你的名字。', age: [22, 45], weight: 7, kind: 'life', req: { flags: ['exam_master'] }, eff: { eq: 2, luck: 1, flag: 'finally_passed' } },
  { id: 'V022', title: '闹钟响了', text: '你在七点整自然醒，第一次没被"起床气"控制。', age: [16, 60], weight: 7, kind: 'life', req: { flags: ['morning_rage'] }, eff: { eq: 1, iq: 1 } }
]
