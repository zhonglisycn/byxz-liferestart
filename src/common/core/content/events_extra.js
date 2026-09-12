export const EVENTS_EXTRA = [
  {"id":"X001","title":"一夜爆红","text":"你随手拍的视频火了，评论区全在刷同一句台词。","age":[15,40],"weight":3,"kind":"life","req":{"luck":7},"eff":{"eq":2,"luck":1,"flag":"meme"}},
  {"id":"X002","title":"成了梗图","text":"你的表情被截下来做成表情包，在群里传了好几年。","age":[13,45],"weight":4,"kind":"life","req":{"luck":6},"eff":{"eq":1,"flag":"sticker"}},
  {"id":"X003","title":"像个NPC","text":"你忽然觉得，自己的一天像被写好的脚本，连台词都没变过。","age":[20,60],"weight":6,"kind":"life","eff":{"eq":-1,"flag":"npc"}},
  {"id":"X004","title":"被写成小说","text":"有人把你的经历写成了小说，销量还不错。","age":[60,200],"weight":2,"kind":"life","req":{"luck":8,"ageMin":60},"eff":{"eq":2,"flag":"novelized"}},
  {"id":"X005","title":"社死现场","text":"你在众人面前出了个无法挽回的丑，连夜搬了城市。","age":[10,45],"weight":5,"kind":"danger","eff":{"eq":-1,"flag":"social_death"}},
  {"id":"X006","title":"被诈骗","text":"一个电话让你把积蓄转了出去，回头才发现是骗局。","age":[20,70],"weight":4,"kind":"danger","eff":{"luck":-1,"eq":-1,"flag":"scammed"}},
  {"id":"X007","title":"破产","text":"生意一夜之间垮了，你把车和房都抵了出去。","age":[25,60],"weight":3,"kind":"danger","req":{"lt":{"luck":6}},"eff":{"hp":-1,"eq":-1,"flag":"bankrupt"}},
  {"id":"X008","title":"一夜暴富","text":"一笔早被遗忘的投资忽然暴涨，你的余额多了好几个零。","age":[20,60],"weight":2,"kind":"life","req":{"luck":9},"eff":{"luck":2,"eq":1,"flag":"overnight_rich"}},
  {"id":"X009","title":"大厂螺丝钉","text":"你进了大厂，工位很亮，日子很暗。","age":[22,45],"weight":5,"kind":"life","eff":{"iq":1,"hp":-1,"flag":"corporate_slave"}},
  {"id":"X010","title":"修炼狂魔","text":"你把所有时间都拿去打坐，连饭都忘了吃。","age":[20,300],"weight":5,"kind":"cultivate","req":{"cultivation":true},"eff":{"progress":25,"hp":-1,"flag":"cultivation_slave"}},
  {"id":"X011","title":"结为道侣","text":"有人在丹霞峰顶等你，说愿意与你共修此道。","age":[20,400],"weight":3,"kind":"cultivate","req":{"cultivation":true,"eq":8},"eff":{"daoHeart":3,"progress":20,"flag":"dao_companion"}},
  {"id":"X012","title":"隐世高人","text":"你收起了名号，在山中做个种药的老头。","age":[80,800],"weight":2,"kind":"cultivate","req":{"cultivation":true,"realm":8},"eff":{"daoHeart":2,"breakthrough":0.05,"flag":"hidden_master"}},
  {"id":"X013","title":"名动一方","text":"你的名字被写进了这行的名册，连同行都要敬三分。","age":[25,70],"weight":3,"kind":"life","req":{"iq":11},"eff":{"eq":2,"luck":1,"flag":"famous"}},
  {"id":"X014","title":"出了家","text":"你把所有东西都送了人，剃了头发住进山里。","age":[20,50],"weight":3,"kind":"life","req":{"eq":8},"eff":{"eq":1,"hp":1,"flag":"monk"}}
,

  // ---- 双修与跨界（需要"双修"天赋才能抽到）----
  { id: 'X015', title: '体修参道', text: '你以血肉之躯硬撼灵力，两种力量在体内撞出奇异的平衡。', age: [20, 600], weight: 6, kind: 'cultivate', req: { dualPath: true, path: 'body' }, eff: { daoHeart: 2, progress: 40 } },
  { id: 'X016', title: '武法兼修', text: '白天打熬筋骨，夜里冥想咒文，你睡的时间少得可怜。', age: [20, 600], weight: 6, kind: 'cultivate', req: { dualPath: true, path: 'body' }, eff: { hp: 1, iq: 1, progress: 30, sp: 1 } },
  { id: 'X017', title: '魔导机械', text: '你把符文刻进齿轮里，第一次让它自己转了起来。', age: [20, 600], weight: 6, kind: 'cultivate', req: { dualPath: true, path: 'tech' }, eff: { iq: 2, progress: 35 } },
  { id: 'X018', title: '炼器与图纸', text: '你把图纸和道纹叠在一起看，忽然分不清哪边是技术。', age: [25, 800], weight: 5, kind: 'cultivate', req: { dualPath: true, path: 'tech' }, eff: { iq: 1, item: 'I001', progress: 45 } },
  { id: 'X019', title: '魔法工业化', text: '你让学徒们按流程画同一道法术，效率高得让人不安。', age: [25, 800], weight: 5, kind: 'cultivate', req: { dualPath: true, path: 'magic', iq: 12 }, eff: { iq: 2, progress: 50 } },
  { id: 'X020', title: '法体同源', text: '你发现魔力与气血本就同出一源，只是叫法不同。', age: [25, 800], weight: 5, kind: 'cultivate', req: { dualPath: true, path: 'magic' }, eff: { sp: 2, daoHeart: 2, progress: 50 } },
  { id: 'X021', title: '两条路打架', text: '两条体系的力量在你体内互相拉扯，你在床上躺了半个月。', age: [20, 700], weight: 5, kind: 'danger', req: { dualPath: true }, eff: { hp: -2, progress: 20 } },
  { id: 'X022', title: '大道相济', text: '某一刻你忽然把两门功课合在了一起，从此一日千里。', age: [30, 900], weight: 3, kind: 'cultivate', req: { dualPath: true, iq: 14 }, eff: { progressRate: 0.25, progress: 80, daoHeart: 3, flag: 'cross_path_master' } },
  { id: 'X023', title: '跨界同道', text: '你遇见一个既懂修行又懂机械的人，两人聊到天亮。', age: [25, 800], weight: 4, kind: 'life', req: { dualPath: true }, eff: { eq: 2, iq: 1, flag: 'cross_path_friend' } },
  { id: 'X024', title: '双修走火', text: '你在两条路上同时冲关，险些把自己炼废了。', age: [30, 900], weight: 4, kind: 'danger', req: { dualPath: true }, eff: { dieChance: 0.12, hp: -2, sp: -1 } },
  { id: 'X025', title: '开宗立派', text: '你把自己那套杂糅的路数写成了书，居然有人来拜师。', age: [60, 2000], weight: 3, kind: 'life', req: { dualPath: true, eq: 10 }, eff: { eq: 2, flag: 'founded_school' } },
  { id: 'X026', title: '一身所学', text: '回看这一生，你走的路没人走过，连地图上都没有。', age: [100, 3000], weight: 4, kind: 'life', req: { dualPath: true, ageMin: 100 }, eff: { eq: 2, luck: 1, flag: 'two_paths_legend' } }
]
