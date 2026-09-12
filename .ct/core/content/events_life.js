/**
 * 人生事件（种子数据，内容扩充请替换本文件，保持 schema）
 */
export const EVENTS_LIFE = [
  { id: 'E001', title: '出生', text: '你出生在一个普通家庭，开始了新的人生。', age: [0, 1], weight: 20, kind: 'life', eff: {} },
  { id: 'E002', title: '抓周', text: '抓周宴上，你一把抓住了算盘，长辈们都说你将来会管钱。', age: [1, 2], weight: 12, kind: 'life', req: { luck: 6 }, eff: { luck: 1 } },
  { id: 'E003', title: '启蒙', text: '你被送进幼儿园，第一天就哭到嗓子哑。', age: [3, 4], weight: 12, kind: 'life', eff: { eq: -1 } },
  { id: 'E004', title: '数学竞赛', text: '你在数学竞赛里拿了奖，全校都知道了你的名字。', age: [9, 15], weight: 8, kind: 'life', req: { iq: 8 }, eff: { iq: 2, luck: 1 } },
  { id: 'E005', title: '一场大病', text: '你生了一场大病，在床上躺了整整一个夏天。', age: [4, 40], weight: 5, kind: 'danger', eff: { hp: -2, iq: 1 } },
  { id: 'E006', title: '余晖', text: '你坐在院子里晒太阳，觉得这一生还算不错。', age: [70, 120], weight: 15, kind: 'life', eff: { eq: 1 } }
]
