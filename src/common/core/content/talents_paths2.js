/**
 * 四体系深度词条（流派 / 出身 / 天赋）
 * 只导出 TALENTS 数组；id 段 T341 ~ T480
 * tag：修仙 / 炼体 / 魔法 / 科技
 * 稀有度：1 凡品 / 2 灵品 / 3 仙品 / 4 神品
 * 效果键见 docs/内容规范.md（enterPath / progressRate / breakthrough / sp / daoHeart /
 *  progress / lifespan / flag / item / 属性加成等）
 */
export const TALENTS = [
  // ---------------- 修仙 T341 ~ T375（35 条） ----------------
  // 授予体系（5）
  { id: 'T341', name: '剑冢遗孤', rarity: 3, tag: '修仙', desc: '剑冢里爬出的孩子', eff: { enterPath: 'cultivate', breakthrough: 0.05, eq: -1 } },
  { id: 'T342', name: '丹炉童子', rarity: 3, tag: '修仙', desc: '三岁便守着丹炉看火', eff: { enterPath: 'cultivate', progressRate: 0.2, hp: -1 } },
  { id: 'T343', name: '阵道世家', rarity: 3, tag: '修仙', desc: '满屋阵图当壁纸', eff: { enterPath: 'cultivate', iq: 2, eq: -1 } },
  { id: 'T344', name: '符箓传人', rarity: 3, tag: '修仙', desc: '祖上留下半箱符纸', eff: { enterPath: 'cultivate', progressRate: 0.2 } },
  { id: 'T345', name: '灵根天成', rarity: 4, tag: '修仙', desc: '灵根莹润，天生道骨', eff: { enterPath: 'cultivate', progressRate: 0.4, daoHeart: 3 } },
  // 凡品（11）
  { id: 'T346', name: '炸炉体质', rarity: 1, tag: '修仙', desc: '炼丹十炉炸八炉', eff: { progressRate: 0.15, hp: -2, luck: -1 } },
  { id: 'T347', name: '阵鬼', rarity: 1, tag: '修仙', desc: '钻进阵里就出不来', eff: { iq: 2, progressRate: 0.1 } },
  { id: 'T348', name: '朱砂手', rarity: 1, tag: '修仙', desc: '指尖常年染着朱砂', eff: { progressRate: 0.1 } },
  { id: 'T349', name: '散修出身', rarity: 1, tag: '修仙', desc: '无门无派，全靠自己', eff: { progressRate: 0.15, luck: 1 } },
  { id: 'T350', name: '宗门弃徒', rarity: 1, tag: '修仙', desc: '被逐出师门，憋着口气', eff: { breakthrough: 0.08, eq: -2 } },
  { id: 'T351', name: '外门杂役', rarity: 1, tag: '修仙', desc: '扫了十年藏经阁', eff: { progressRate: 0.12, eq: 1 } },
  { id: 'T352', name: '记名弟子', rarity: 1, tag: '修仙', desc: '名字挂在墙上，没人管', eff: { progressRate: 0.1, luck: 1 } },
  { id: 'T353', name: '半吊子剑修', rarity: 1, tag: '修仙', desc: '剑招会半套，架子挺足', eff: { hp: 1, breakthrough: -0.03 } },
  { id: 'T354', name: '灵根蒙尘', rarity: 1, tag: '修仙', desc: '灵根沾灰，擦擦还能用', eff: { progressRate: -0.1, luck: 1 } },
  { id: 'T355', name: '心浮气躁', rarity: 1, tag: '修仙', desc: '坐不住，也静不下', eff: { progressRate: 0.15, breakthrough: -0.05 } },
  { id: 'T356', name: '药渣体质', rarity: 1, tag: '修仙', desc: '吃药吸收总比别人少', eff: { hp: 1, luck: 1 } },
  // 灵品（12）
  { id: 'T357', name: '剑痴', rarity: 2, tag: '修仙', desc: '抱着剑才睡得踏实', eff: { breakthrough: 0.06, eq: -1 } },
  { id: 'T358', name: '剑意雏形', rarity: 2, tag: '修仙', desc: '闭眼能看见一线剑光', eff: { breakthrough: 0.05, iq: 1 } },
  { id: 'T359', name: '药香体', rarity: 2, tag: '修仙', desc: '身上总带着淡淡药香', eff: { lifespan: 30, progressRate: 0.1 } },
  { id: 'T360', name: '百草通', rarity: 2, tag: '修仙', desc: '闻味识得千种灵草', eff: { iq: 2, progressRate: 0.1 } },
  { id: 'T361', name: '淬火眼', rarity: 2, tag: '修仙', desc: '一眼看出材料火候', eff: { breakthrough: 0.05, iq: 1 } },
  { id: 'T362', name: '炼器狂', rarity: 2, tag: '修仙', desc: '不炼出法宝不睡觉', eff: { breakthrough: 0.06, hp: -1, lifespan: -10 } },
  { id: 'T363', name: '符胆', rarity: 2, tag: '修仙', desc: '画的符格外灵验', eff: { progressRate: 0.15 } },
  { id: 'T364', name: '慧根深种', rarity: 2, tag: '修仙', desc: '一点就透，举一反三', eff: { iq: 2, progressRate: 0.15 } },
  { id: 'T365', name: '血修', rarity: 2, tag: '修仙', desc: '以血为引，以命换力', eff: { breakthrough: 0.1, hp: -2, lifespan: -30 } },
  { id: 'T366', name: '修真世家', rarity: 2, tag: '修仙', desc: '家里灵石堆成山', eff: { progressRate: 0.1, eq: 1, luck: 1 } },
  { id: 'T367', name: '逆天改命', rarity: 2, tag: '修仙', desc: '命越薄，心越狠', eff: { breakthrough: 0.1, lifespan: -30, hp: -1 } },
  { id: 'T368', name: '内门嫡传', rarity: 2, tag: '修仙', desc: '师祖亲自喂招', eff: { progressRate: 0.2, breakthrough: 0.05 } },
  // 仙品（5）
  { id: 'T369', name: '本命剑', rarity: 3, tag: '修仙', desc: '剑在人在，剑毁人伤', eff: { breakthrough: 0.08 } },
  { id: 'T370', name: '驭剑天才', rarity: 3, tag: '修仙', desc: '御剑如臂使指', eff: { breakthrough: 0.07, progressRate: 0.15 } },
  { id: 'T371', name: '丹心', rarity: 3, tag: '修仙', desc: '心口一点丹火不灭', eff: { progressRate: 0.2, daoHeart: 2 } },
  { id: 'T372', name: '阵眼天生', rarity: 3, tag: '修仙', desc: '生来就是一座阵眼', eff: { iq: 2, breakthrough: 0.06 } },
  { id: 'T373', name: '魔修骨', rarity: 3, tag: '修仙', desc: '天生适合修魔功', eff: { progressRate: 0.3, luck: -2 } },
  // 神品（2）
  { id: 'T374', name: '噬魂体', rarity: 4, tag: '修仙', desc: '能吞他人残魂为己用', eff: { progressRate: 0.35, eq: -2, luck: -1 } },
  { id: 'T375', name: '天命加身', rarity: 4, tag: '修仙', desc: '天道偏爱你一分', eff: { luck: 3, luckRate: 0.3, progressRate: 0.2 } },

  // ---------------- 炼体 T376 ~ T410（35 条） ----------------
  // 授予体系（5）
  { id: 'T376', name: '横练传人', rarity: 3, tag: '炼体', desc: '祖传十三式横练', eff: { enterPath: 'body', hp: 2, eq: -1 } },
  { id: 'T377', name: '药浴传人', rarity: 3, tag: '炼体', desc: '从小泡在药汤里', eff: { enterPath: 'body', hp: 2, progressRate: 0.1 } },
  { id: 'T378', name: '擂台武夫', rarity: 3, tag: '炼体', desc: '打遍擂台没输过', eff: { enterPath: 'body', hp: 1, eq: 2 } },
  { id: 'T379', name: '军中力士', rarity: 3, tag: '炼体', desc: '扛过军粮扛过旗', eff: { enterPath: 'body', hp: 2, eq: 1 } },
  { id: 'T380', name: '苦行僧', rarity: 4, tag: '炼体', desc: '以苦为食，以痛为乐', eff: { enterPath: 'body', hp: 3, daoHeart: 2, eq: -2 } },
  // 凡品（11）
  { id: 'T381', name: '挨打白挨', rarity: 1, tag: '炼体', desc: '挨了打也没长进', eff: { hp: -1, luck: 1 } },
  { id: 'T382', name: '死练蛮力', rarity: 1, tag: '炼体', desc: '只使蛮力，不讲章法', eff: { hp: 2, iq: -2 } },
  { id: 'T383', name: '伤疤体质', rarity: 1, tag: '炼体', desc: '旧疤叠着新疤', eff: { hp: 1, luck: 1 } },
  { id: 'T384', name: '药浴过敏', rarity: 1, tag: '炼体', desc: '一泡药浴就起疹子', eff: { hp: -1, progressRate: -0.05 } },
  { id: 'T385', name: '桩功三天', rarity: 1, tag: '炼体', desc: '桩功只扎了三天', eff: { progressRate: 0.15, eq: 1 } },
  { id: 'T386', name: '外强中干', rarity: 1, tag: '炼体', desc: '看着壮，一身虚火', eff: { hp: 2, lifespan: -20 } },
  { id: 'T387', name: '蛮牛脾气', rarity: 1, tag: '炼体', desc: '一句话不合就动手', eff: { hp: 1, eq: -2 } },
  { id: 'T388', name: '身上旧伤', rarity: 1, tag: '炼体', desc: '阴雨天旧伤就疼', eff: { hp: -1, lifespan: -20, progressRate: 0.1 } },
  { id: 'T389', name: '断骨史', rarity: 1, tag: '炼体', desc: '断过的骨头数不清', eff: { hp: 1, luck: 1 } },
  { id: 'T390', name: '厚茧老皮', rarity: 1, tag: '炼体', desc: '手上茧子比鞋底厚', eff: { hp: 1, eq: 1 } },
  { id: 'T391', name: '铁砂烫手', rarity: 1, tag: '炼体', desc: '插铁砂烫出一手泡', eff: { hp: 1, breakthrough: -0.03 } },
  // 灵品（12）
  { id: 'T392', name: '铁掌开碑', rarity: 2, tag: '炼体', desc: '一掌劈开青石', eff: { hp: 1, eq: 1, progressRate: 0.1 } },
  { id: 'T393', name: '蛰龙桩', rarity: 2, tag: '炼体', desc: '桩功一扎就是半天', eff: { progressRate: 0.2 } },
  { id: 'T394', name: '铁布衫功', rarity: 2, tag: '炼体', desc: '刀砍只留白印', eff: { hp: 2, progressRate: 0.05 } },
  { id: 'T395', name: '筋骨如铁', rarity: 2, tag: '炼体', desc: '骨节撞出金石声', eff: { hp: 2 } },
  { id: 'T396', name: '吐纳如雷', rarity: 2, tag: '炼体', desc: '呼吸间隐有雷鸣', eff: { progressRate: 0.2, hp: 1 } },
  { id: 'T397', name: '真气逆行', rarity: 2, tag: '炼体', desc: '逆行经脉，险中求快', eff: { progressRate: 0.3, hp: -2 } },
  { id: 'T398', name: '药人骨', rarity: 2, tag: '炼体', desc: '骨头里浸着药性', eff: { hp: 1, lifespan: 40, progressRate: -0.05 } },
  { id: 'T399', name: '毒抗体质', rarity: 2, tag: '炼体', desc: '毒药当补药吃', eff: { hp: 2, luck: 1, progressRate: 0.05 } },
  { id: 'T400', name: '护道镖师', rarity: 2, tag: '炼体', desc: '走镖十年没丢过货', eff: { hp: 1, eq: 2 } },
  { id: 'T401', name: '挡刀好手', rarity: 2, tag: '炼体', desc: '替人挨刀是常事', eff: { hp: 2, eq: 1, lifespan: -10 } },
  { id: 'T402', name: '痛觉迟钝', rarity: 2, tag: '炼体', desc: '挨打反而觉得舒服', eff: { hp: 2, luck: 1 } },
  { id: 'T403', name: '打擂常胜', rarity: 2, tag: '炼体', desc: '擂台从没输过', eff: { hp: 1, eq: 1, luck: 1 } },
  // 仙品（6）
  { id: 'T404', name: '百炼皮膜', rarity: 3, tag: '炼体', desc: '皮膜炼过一百遍', eff: { hp: 2, breakthrough: 0.05 } },
  { id: 'T405', name: '金钟罩体', rarity: 3, tag: '炼体', desc: '罩门藏在脚底', eff: { hp: 3, breakthrough: 0.05, luck: -1 } },
  { id: 'T406', name: '内家罡气', rarity: 3, tag: '炼体', desc: '一口罡气护住周身', eff: { hp: 2, progressRate: 0.2, iq: 1 } },
  { id: 'T407', name: '混元一气', rarity: 3, tag: '炼体', desc: '气沉丹田，生生不息', eff: { progressRate: 0.25, hp: 1 } },
  { id: 'T408', name: '气走任督', rarity: 3, tag: '炼体', desc: '小周天日夜自行运转', eff: { breakthrough: 0.08, progressRate: 0.15 } },
  { id: 'T409', name: '雷劫淬体迷', rarity: 3, tag: '炼体', desc: '主动引雷来劈自己', eff: { breakthrough: 0.1, hp: -1, flag: 'body_lightning_lover' } },
  // 神品（1）
  { id: 'T410', name: '龙象胚子', rarity: 4, tag: '炼体', desc: '生来筋骨像龙象', eff: { hp: 3, progressRate: 0.3, lifespan: 50 } },

  // ---------------- 魔法 T411 ~ T445（35 条） ----------------
  // 授予体系（5）
  { id: 'T411', name: '元素派嫡传', rarity: 3, tag: '魔法', desc: '师承元素派老法师', eff: { enterPath: 'magic', progressRate: 0.2, iq: 1 } },
  { id: 'T412', name: '召唤世家', rarity: 3, tag: '魔法', desc: '家里养着三只魔宠', eff: { enterPath: 'magic', eq: 1, progressRate: 0.15 } },
  { id: 'T413', name: '亡灵学徒', rarity: 3, tag: '魔法', desc: '师父是个活死人', eff: { enterPath: 'magic', luck: -1, progressRate: 0.25 } },
  { id: 'T414', name: '野法师出身', rarity: 3, tag: '魔法', desc: '没上过学，全靠野路子', eff: { enterPath: 'magic', progressRate: 0.25 } },
  { id: 'T415', name: '学院首席', rarity: 4, tag: '魔法', desc: '毕业时院长亲自授杖', eff: { enterPath: 'magic', iq: 2, progressRate: 0.3 } },
  // 凡品（10）
  { id: 'T416', name: '元素失谐', rarity: 1, tag: '魔法', desc: '元素总跟你对着干', eff: { progressRate: -0.15, luck: -1, hp: -1 } },
  { id: 'T417', name: '魔力透支', rarity: 1, tag: '魔法', desc: '魔力总是不够用', eff: { progressRate: -0.1, hp: -1 } },
  { id: 'T418', name: '药剂过敏', rarity: 1, tag: '魔法', desc: '闻见魔药就直打喷嚏', eff: { hp: -1, progressRate: -0.05, luck: 1 } },
  { id: 'T419', name: '咒文反噬体', rarity: 1, tag: '魔法', desc: '念错咒就自己挨打', eff: { breakthrough: 0.08, hp: -2 } },
  { id: 'T420', name: '咒文结巴', rarity: 1, tag: '魔法', desc: '念到一半就卡壳', eff: { breakthrough: -0.05, iq: 1 } },
  { id: 'T421', name: '炼金炸锅', rarity: 1, tag: '魔法', desc: '配药十次炸九次', eff: { progressRate: 0.15, hp: -2, luck: -1 } },
  { id: 'T422', name: '旁听生', rarity: 1, tag: '魔法', desc: '坐在教室最后排蹭课', eff: { iq: 1, luck: 1 } },
  { id: 'T423', name: '魔杖手滑', rarity: 1, tag: '魔法', desc: '施法时杖总脱手', eff: { breakthrough: -0.04, luck: -1 } },
  { id: 'T424', name: '学费欠条', rarity: 1, tag: '魔法', desc: '学院账单堆成小山', eff: { iq: 1, luck: -1, eq: -1 } },
  { id: 'T425', name: '魔力虚浮', rarity: 1, tag: '魔法', desc: '魔力看着多，不凝实', eff: { progressRate: 0.1, breakthrough: -0.05 } },
  // 灵品（13）
  { id: 'T426', name: '烈焰亲和', rarity: 2, tag: '魔法', desc: '火元素见了你就亲', eff: { progressRate: 0.2, hp: 1 } },
  { id: 'T427', name: '寒冰体质', rarity: 2, tag: '魔法', desc: '体温比常人低三度', eff: { progressRate: 0.2, hp: -1, iq: 1 } },
  { id: 'T428', name: '召唤狂', rarity: 2, tag: '魔法', desc: '一开口就召出一群', eff: { progressRate: 0.15, eq: -1 } },
  { id: 'T429', name: '魔宠亲和', rarity: 2, tag: '魔法', desc: '野兽见了你摇尾巴', eff: { eq: 2, luck: 1 } },
  { id: 'T430', name: '尸骨亲和', rarity: 2, tag: '魔法', desc: '白骨见了你轻轻颤动', eff: { progressRate: 0.15, hp: 1 } },
  { id: 'T431', name: '冥河引路', rarity: 2, tag: '魔法', desc: '能听见冥河的水声', eff: { luck: 2, progressRate: 0.1 } },
  { id: 'T432', name: '梦中施法', rarity: 2, tag: '魔法', desc: '睡着了也在念咒', eff: { progressRate: 0.2, hp: -1 } },
  { id: 'T433', name: '真假难辨', rarity: 2, tag: '魔法', desc: '连自己都骗得过', eff: { eq: 2, iq: 1 } },
  { id: 'T434', name: '咒文速记', rarity: 2, tag: '魔法', desc: '咒文过耳不忘', eff: { iq: 2 } },
  { id: 'T435', name: '制杖巧手', rarity: 2, tag: '魔法', desc: '削出的法杖格外顺手', eff: { item: 'IM002', iq: 1 } },
  { id: 'T436', name: '典籍狂', rarity: 2, tag: '魔法', desc: '图书馆闭馆才肯走', eff: { iq: 2, progressRate: 0.1 } },
  { id: 'T437', name: '逃课天才', rarity: 2, tag: '魔法', desc: '课上睡觉，考试第一', eff: { iq: 2, luck: 1 } },
  { id: 'T438', name: '考古法师', rarity: 2, tag: '魔法', desc: '专挖古墓里的咒本', eff: { iq: 1, luck: 1, hp: 1 } },
  // 仙品（6）
  { id: 'T439', name: '雷元素体', rarity: 3, tag: '魔法', desc: '头顶常年静电噼啪', eff: { progressRate: 0.25, hp: 1, luck: -1 } },
  { id: 'T440', name: '双元素体', rarity: 3, tag: '魔法', desc: '体内住着两种元素', eff: { progressRate: 0.3, hp: -1 } },
  { id: 'T441', name: '契约之眼', rarity: 3, tag: '魔法', desc: '一眼看穿契约漏洞', eff: { breakthrough: 0.08, iq: 1 } },
  { id: 'T442', name: '亡灵低语', rarity: 3, tag: '魔法', desc: '死者在你耳边说悄悄话', eff: { progressRate: 0.25, eq: -2, luck: -1 } },
  { id: 'T443', name: '幻术天才', rarity: 3, tag: '魔法', desc: '第一次施法骗过导师', eff: { breakthrough: 0.08, iq: 1, eq: 1 } },
  { id: 'T444', name: '沉默施法', rarity: 3, tag: '魔法', desc: '不出声也能念咒', eff: { breakthrough: 0.07, iq: 1 } },
  // 神品（1）
  { id: 'T445', name: '血统觉醒', rarity: 4, tag: '魔法', desc: '沉睡的血脉忽然苏醒', eff: { progressRate: 0.5, hp: 2, lifespan: 80 } },

  // ---------------- 科技 T446 ~ T480（35 条） ----------------
  // 授予体系（5）
  { id: 'T446', name: '材料派门生', rarity: 3, tag: '科技', desc: '导师是材料学大牛', eff: { enterPath: 'tech', iq: 2, progressRate: 0.1 } },
  { id: 'T447', name: '算法世家', rarity: 3, tag: '科技', desc: '父母都是程序员', eff: { enterPath: 'tech', iq: 2, progressRate: 0.15 } },
  { id: 'T448', name: '硬件狂人', rarity: 3, tag: '科技', desc: '拆过的机器堆成山', eff: { enterPath: 'tech', iq: 1, hp: 1, progressRate: 0.1 } },
  { id: 'T449', name: '生物极客', rarity: 3, tag: '科技', desc: '家里养着一柜子菌种', eff: { enterPath: 'tech', iq: 2, hp: -1 } },
  { id: 'T450', name: '航天少尉', rarity: 4, tag: '科技', desc: '从小梦想造火箭', eff: { enterPath: 'tech', iq: 2, progressRate: 0.25 } },
  // 凡品（10）
  { id: 'T451', name: '拆机狂', rarity: 1, tag: '科技', desc: '家里电器没一个完整', eff: { iq: 1, luck: -1 } },
  { id: 'T452', name: '手抖症', rarity: 1, tag: '科技', desc: '精密操作总差一点', eff: { breakthrough: -0.05, iq: 1 } },
  { id: 'T453', name: '永动机信徒', rarity: 1, tag: '科技', desc: '坚信自己能造永动机', eff: { progressRate: 0.2, sp: -2, luck: -1 } },
  { id: 'T454', name: '学术孤儿', rarity: 1, tag: '科技', desc: '导师不管，同门不理', eff: { progressRate: 0.15, eq: -2 } },
  { id: 'T455', name: '数据美化师', rarity: 1, tag: '科技', desc: '图好看，但不太真', eff: { breakthrough: 0.05, sp: -2, flag: 'tech_fraud' } },
  { id: 'T456', name: '仪器克星', rarity: 1, tag: '科技', desc: '你一碰仪器就出故障', eff: { breakthrough: -0.05, luck: -2, iq: 1 } },
  { id: 'T457', name: '截稿冲刺', rarity: 1, tag: '科技', desc: '截止前一夜才动笔', eff: { progressRate: 0.15, hp: -1, luck: 1 } },
  { id: 'T458', name: '民科苗子', rarity: 1, tag: '科技', desc: '张口就是颠覆性理论', eff: { iq: 1, eq: -1 } },
  { id: 'T459', name: '经费乞讨', rarity: 1, tag: '科技', desc: '为报销跑断腿', eff: { eq: 1, luck: -1 } },
  { id: 'T460', name: '实验室小白', rarity: 1, tag: '科技', desc: '仪器名字还认不全', eff: { iq: 1, hp: -1 } },
  // 灵品（12）
  { id: 'T461', name: '材料眼', rarity: 2, tag: '科技', desc: '一眼看穿材料缺陷', eff: { iq: 2, breakthrough: 0.03 } },
  { id: 'T462', name: '合金手感', rarity: 2, tag: '科技', desc: '摸一摸就知道配比', eff: { iq: 1, breakthrough: 0.05 } },
  { id: 'T463', name: '重构癖', rarity: 2, tag: '科技', desc: '看见烂代码就手痒', eff: { iq: 2, progressRate: 0.1 } },
  { id: 'T464', name: '递归脑袋', rarity: 2, tag: '科技', desc: '总先想终止条件', eff: { iq: 2, sp: 1, eq: -1 } },
  { id: 'T465', name: '焊接神技', rarity: 2, tag: '科技', desc: '焊点小得像芝麻', eff: { hp: 1, breakthrough: 0.05 } },
  { id: 'T466', name: '解剖熟手', rarity: 2, tag: '科技', desc: '下刀稳准狠', eff: { hp: 1, iq: 1 } },
  { id: 'T467', name: '菌种亲和', rarity: 2, tag: '科技', desc: '培养皿里的菌很听话', eff: { progressRate: 0.15, hp: 1 } },
  { id: 'T468', name: '火箭少年', rarity: 2, tag: '科技', desc: '后院搭过三次发射台', eff: { progressRate: 0.15, luck: 1 } },
  { id: 'T469', name: '火药味童年', rarity: 2, tag: '科技', desc: '小时候炸过自家柴房', eff: { hp: 1, progressRate: 0.15 } },
  { id: 'T470', name: '民科之王', rarity: 2, tag: '科技', desc: '自创一套颠覆理论', eff: { iq: 2, eq: -2, luck: -1 } },
  { id: 'T471', name: '熬夜圣体', rarity: 2, tag: '科技', desc: '连熬三夜照样清醒', eff: { progressRate: 0.15, hp: -1, lifespan: -10 } },
  { id: 'T472', name: '论文机器', rarity: 2, tag: '科技', desc: '一年能水十篇', eff: { progressRate: 0.2, iq: 1 } },
  // 仙品（6）
  { id: 'T473', name: '烧炉圣手', rarity: 3, tag: '科技', desc: '炉温全凭手感', eff: { breakthrough: 0.07, progressRate: 0.1 } },
  { id: 'T474', name: '代码直觉', rarity: 3, tag: '科技', desc: '看代码就知道哪有问题', eff: { iq: 2, progressRate: 0.15, sp: 1 } },
  { id: 'T475', name: '算法嗅觉', rarity: 3, tag: '科技', desc: '嗅得出最优解的方向', eff: { iq: 2, breakthrough: 0.05 } },
  { id: 'T476', name: '示波器圣手', rarity: 3, tag: '科技', desc: '波形一动就知道哪坏了', eff: { iq: 2, breakthrough: 0.06 } },
  { id: 'T477', name: '电路直觉', rarity: 3, tag: '科技', desc: '闭眼都能画出电路图', eff: { iq: 2, progressRate: 0.1 } },
  { id: 'T478', name: '基因剪刀手', rarity: 3, tag: '科技', desc: '剪切拼接从不出错', eff: { breakthrough: 0.08, iq: 1 } },
  // 神品（2）
  { id: 'T479', name: '军工血统', rarity: 4, tag: '科技', desc: '家里三代造枪炮', eff: { hp: 1, iq: 2, progressRate: 0.25, eq: 1 } },
  { id: 'T480', name: '机械飞升候补', rarity: 4, tag: '科技', desc: '身体一半已是机械', eff: { hp: 2, lifespan: 100, iq: 2, progressRate: 0.2 } }
]
