/**
 * 内容池装配：把基础内容与各体系内容包合并成 5 个池子。
 *
 * 为什么单独抽出这个文件：
 * 内容是本作最大的一块内存（解析后约 1.5MB）。如果由 engine.js 直接 import，
 * 每个页面的字节码里都会内联一份完整内容，页面切换时反复解析构造，
 * 手环上极易内存耗尽导致重启。所以内容只在 app.ux 里装配一次，
 * 页面通过 this.$app.$def.CONTENT 拿到同一份引用再交给 engine.setContent()，
 * 全应用内存里只有一份，页面字节码里也不再重复打包内容。
 */

import { TALENTS } from './talents.js'
import { EVENTS_LIFE } from './events_life.js'
import { EVENTS_CULTIVATION } from './events_cultivation.js'
import { EVENTS_EXTRA } from './events_extra.js'
import { ITEMS } from './items.js'
import { ENDINGS } from './endings.js'
import { ACHIEVEMENTS } from './achievements.js'

// 各体系的专属内容包（每条体系一个文件，导出 EVENTS/TALENTS/ITEMS/ENDINGS/ACHIEVEMENTS）
import * as PKG_BODY from './path_body.js'
import * as PKG_MAGIC from './path_magic.js'
import * as PKG_TECH from './path_tech.js'
import * as PKG_CULT2 from './path_cultivate2.js'
// 词条扩展包（只有 TALENTS）
import * as PKG_T_LIFE from './talents_life.js'
import * as PKG_T_PATHS from './talents_paths2.js'
import * as PKG_T_SPECIAL from './talents_special.js'
import * as PKG_E_TALENT from './events_talent.js'

function pkgArr(pkg, name) {
  const a = pkg && (pkg[name] || (pkg.default && pkg.default[name]))
  return Array.isArray(a) ? a : []
}

/** 装配全部内容池，返回全局唯一的那一份 */
export function buildContent() {
  return {
    talents: TALENTS
      .concat(pkgArr(PKG_BODY, 'TALENTS'))
      .concat(pkgArr(PKG_MAGIC, 'TALENTS'))
      .concat(pkgArr(PKG_TECH, 'TALENTS'))
      .concat(pkgArr(PKG_CULT2, 'TALENTS'))
      .concat(pkgArr(PKG_T_LIFE, 'TALENTS'))
      .concat(pkgArr(PKG_T_PATHS, 'TALENTS'))
      .concat(pkgArr(PKG_T_SPECIAL, 'TALENTS')),

    items: ITEMS
      .concat(pkgArr(PKG_BODY, 'ITEMS'))
      .concat(pkgArr(PKG_MAGIC, 'ITEMS'))
      .concat(pkgArr(PKG_TECH, 'ITEMS'))
      .concat(pkgArr(PKG_CULT2, 'ITEMS')),

    endings: ENDINGS
      .concat(pkgArr(PKG_BODY, 'ENDINGS'))
      .concat(pkgArr(PKG_MAGIC, 'ENDINGS'))
      .concat(pkgArr(PKG_TECH, 'ENDINGS'))
      .concat(pkgArr(PKG_CULT2, 'ENDINGS')),

    achievements: ACHIEVEMENTS
      .concat(pkgArr(PKG_BODY, 'ACHIEVEMENTS'))
      .concat(pkgArr(PKG_MAGIC, 'ACHIEVEMENTS'))
      .concat(pkgArr(PKG_TECH, 'ACHIEVEMENTS'))
      .concat(pkgArr(PKG_CULT2, 'ACHIEVEMENTS')),

    events: EVENTS_LIFE
      .concat(EVENTS_CULTIVATION)
      .concat(EVENTS_EXTRA)
      .concat(pkgArr(PKG_CULT2, 'EVENTS'))
      .concat(pkgArr(PKG_BODY, 'EVENTS'))
      .concat(pkgArr(PKG_MAGIC, 'EVENTS'))
      .concat(pkgArr(PKG_TECH, 'EVENTS'))
      .concat(pkgArr(PKG_E_TALENT, 'EVENTS'))
  }
}
