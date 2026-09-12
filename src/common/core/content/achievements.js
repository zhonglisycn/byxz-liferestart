/**
 * 成就：req 支持属性门槛 / lt / ageMin / realm / flags / items / talents
 * flag 名与事件作者对齐（事件 eff.flag 打标记）
 */
export const ACHIEVEMENTS = [
  /* ---- 年龄里程碑 ---- */
  { id: 'A001', name: '总角之年', desc: '活到十岁', req: { ageMin: 10 } },
  { id: 'A002', name: '三十而立', desc: '活到三十岁', req: { ageMin: 30 } },
  { id: 'A003', name: '半百之年', desc: '活到五十岁', req: { ageMin: 50 } },
  { id: 'A004', name: '花甲老人', desc: '活到六十岁', req: { ageMin: 60 } },
  { id: 'A005', name: '古稀之年', desc: '活到七十岁', req: { ageMin: 70 } },
  { id: 'A006', name: '耄耋之年', desc: '活到八十岁', req: { ageMin: 80 } },
  { id: 'A007', name: '长命百岁', desc: '活到一百岁', req: { ageMin: 100 } },
  { id: 'A008', name: '人瑞', desc: '活到三百岁', req: { ageMin: 300 } },
  { id: 'A009', name: '五百春秋', desc: '活到五百岁', req: { ageMin: 500 } },
  { id: 'A010', name: '千年之身', desc: '活到一千岁', req: { ageMin: 1000 } },

  /* ---- 属性极端值 ---- */
  { id: 'A011', name: '天纵奇才', desc: '智力达到十五', req: { iq: 15 } },
  { id: 'A012', name: '人见人爱', desc: '情商达到十五', req: { eq: 15 } },
  { id: 'A013', name: '铜皮铁骨', desc: '体质达到十五', req: { hp: 15 } },
  { id: 'A014', name: '天选之子', desc: '幸运达到十五', req: { luck: 15 } },
  { id: 'A015', name: '绝世天才', desc: '智力达到十八', req: { iq: 18 } },
  { id: 'A016', name: '六边形战士', desc: '四项属性都到十二', req: { iq: 12, eq: 12, hp: 12, luck: 12 } },
  { id: 'A017', name: '偏科怪才', desc: '智力很高情商很低', req: { iq: 16, lt: { eq: 4 } } },
  { id: 'A018', name: '空空如也', desc: '二十岁智力仍不到二', req: { lt: { iq: 2 }, ageMin: 20 } },
  { id: 'A019', name: '钢铁直男', desc: '二十岁情商不到二', req: { lt: { eq: 2 }, ageMin: 20 } },
  { id: 'A020', name: '命悬一线', desc: '体质跌到一还活着', req: { lt: { hp: 2 }, ageMin: 20 } },
  { id: 'A021', name: '霉运缠身', desc: '三十岁幸运不到二', req: { lt: { luck: 2 }, ageMin: 30 } },
  { id: 'A022', name: '一无是处', desc: '四十岁四项都不足五', req: { lt: { iq: 5, eq: 5, hp: 5, luck: 5 }, ageMin: 40 } },

  /* ---- 境界里程碑 ---- */
  { id: 'A023', name: '炼气入道', desc: '踏上修仙之路', req: { cultivation: true, realm: 1 } },
  { id: 'A024', name: '炼气九层', desc: '修到炼气九层', req: { cultivation: true, realm: 4 } },
  { id: 'A025', name: '筑基之路', desc: '突破到筑基期', req: { cultivation: true, realm: 5 } },
  { id: 'A026', name: '金丹大道', desc: '结成金丹', req: { cultivation: true, realm: 8 } },
  { id: 'A027', name: '元婴老祖', desc: '修出元婴', req: { cultivation: true, realm: 10 } },
  { id: 'A028', name: '化神登天', desc: '踏入化神期', req: { cultivation: true, realm: 11 } },
  { id: 'A029', name: '大乘至尊', desc: '修到大乘期', req: { cultivation: true, realm: 14 } },
  { id: 'A030', name: '飞升成仙', desc: '成为仙人', req: { cultivation: true, realm: 16 } },
  { id: 'A031', name: '长生久视', desc: '成仙且活过五百岁', req: { cultivation: true, realm: 16, ageMin: 500 } },
  { id: 'A032', name: '渡劫三连', desc: '三次从雷劫下生还', req: { flags: ['tribulation_x3'], cultivation: true } },

  /* ---- 收集类 ---- */
  { id: 'A033', name: '收藏家', desc: '集齐五件初始遗物', req: { items: ['I001', 'I002', 'I003', 'I004', 'I005'] } },
  { id: 'A034', name: '剑修', desc: '同时持有青锋剑与护心镜', req: { items: ['I001', 'I005'] } },
  { id: 'A035', name: '丹道入门', desc: '同时持有聚气丹与万年灵参', req: { items: ['I002', 'I003'] } },
  { id: 'A036', name: '天赋异禀', desc: '集齐三个初始天赋', req: { talents: ['T001', 'T002', 'T003'] } },
  { id: 'A037', name: '命里带仙', desc: '拥有天生灵根天赋', req: { talents: ['T003'] } },
  { id: 'A038', name: '锦鲤附体', desc: '拥有幸运类天赋', req: { talents: ['T004'] } },
  { id: 'A039', name: '社恐本恐', desc: '拥有社恐天赋', req: { talents: ['T005'] } },
  { id: 'A040', name: '富甲一方', desc: '收集到四件灵物', req: { items: ['I003', 'I059', 'I084', 'I094'] } },

  /* ---- flag 奇葩成就 ---- */
  { id: 'A041', name: '打工皇帝', desc: '在职场拼到最后一刻', req: { flags: ['corporate_slave'] } },
  { id: 'A042', name: '你火了', desc: '你成了全网的梗', req: { flags: ['meme'] } },
  { id: 'A043', name: '表情包本包', desc: '你的脸被做成表情包', req: { flags: ['sticker'] } },
  { id: 'A044', name: '游戏NPC', desc: '转世成游戏里的NPC', req: { flags: ['npc'] } },
  { id: 'A045', name: '地摊文主角', desc: '你的故事被写成小说', req: { flags: ['novelized'] } },
  { id: 'A046', name: '反诈失败', desc: '你被一通电话骗了一生', req: { flags: ['scammed'] } },
  { id: 'A047', name: '一夜暴富', desc: '天降横财砸中了你', req: { flags: ['overnight_rich'] } },
  { id: 'A048', name: '一夜破产', desc: '你从云端摔到了泥里', req: { flags: ['bankrupt'] } },
  { id: 'A049', name: '社死现场', desc: '你当众丢过一次大人', req: { flags: ['social_death'] } },
  { id: 'A050', name: '道侣成双', desc: '你寻到了并肩的人', req: { flags: ['dao_companion'] } },
  { id: 'A051', name: '遁入空门', desc: '你放下红尘出了家', req: { flags: ['monk'] } },
  { id: 'A052', name: '大隐隐于市', desc: '高手藏在人堆里', req: { flags: ['hidden_master'] } },
  { id: 'A053', name: '天下谁人不识君', desc: '你成了家喻户晓的人', req: { flags: ['famous'] } },
  { id: 'A054', name: '修仙社畜', desc: '修炼也要打卡上班', req: { flags: ['cultivation_slave'], cultivation: true } },
  { id: 'A055', name: '走火入魔不死', desc: '差点入魔却挺过来了', req: { flags: ['survived_deviation'], cultivation: true } },
  { id: 'A056', name: '与天同寿', desc: '成仙后仍活到千岁', req: { cultivation: true, realm: 16, ageMin: 1000 } },
  { id: 'A057', name: '凡人终局', desc: '一辈子没修仙活到百岁', req: { noCultivation: true, ageMin: 100 } },
  { id: 'A058', name: '天劫幸存者', desc: '被天劫劈过还活着', req: { flags: ['tribulation_survivor'], cultivation: true } },
  { id: 'A059', name: '逆天改命', desc: '气运低到谷底却飞升', req: { cultivation: true, realm: 16, lt: { luck: 8 } } },
  { id: 'A060', name: '大器晚成', desc: '六十岁后才开始修仙', req: { cultivation: true, realm: 5, ageMin: 60 } }
,
  { id: 'A061', name: '双修者', desc: '同时走上两条体系', req: { dualPath: true } },
  { id: 'A062', name: '大道相济', desc: '把两门功课合而为一', req: { flags: ['cross_path_master'] } },
  { id: 'A063', name: '开宗立派', desc: '把自己那条杂糅的路写成了书', req: { flags: ['founded_school'] } },
  { id: 'A064', name: '无人走过', desc: '两条路都走到了极致', req: { flags: ['two_paths_legend'], ageMin: 100 } }
,
  { id: 'A065', name: '逆天改命', desc: '熬过"活不过三十"的命数', req: { flags: ['defied_fate'] } },
  { id: 'A066', name: '阴阳为眼', desc: '用诡眼看见了另一个世界', req: { flags: ['saw_beyond'] } },
  { id: 'A067', name: '阎王不收', desc: '第二次从鬼门关走回来', req: { flags: ['death_denied_twice'] } },
  { id: 'A068', name: '它退让了', desc: '守住了自己的身体', req: { flags: ['seized_resisted'] } },
  { id: 'A069', name: '天机在手', desc: '算出了自己的寿数', req: { flags: ['knows_fate'] } },
  { id: 'A070', name: '冥冥之中', desc: '被不知名的力量救过一次', req: { flags: ['saved_by_heaven'] } },
  { id: 'A071', name: '诡异开花', desc: '体内的种子裂开了', req: { flags: ['weird_bloomed'] } },
  { id: 'A072', name: '猫奴一生', desc: '陪一只猫走到它生命的尽头', req: { flags: ['cat_farewell'] } },
  { id: 'A073', name: '上岸', desc: '考了多年终于上岸', req: { flags: ['finally_passed'] } }
]
