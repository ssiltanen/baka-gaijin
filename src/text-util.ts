const HIRAGANA_START = '\u3040'
const HIRAGANA_END = '\u309f'
const KATAKANA_START = '\u30a0'
const KATAKANA_END = '\u30ff'

const charCode = (str: string) => str.charCodeAt(0)
const KATAKANA_TO_HIRAGANA_DIF = charCode('\u3041') - charCode('\u30a1')
const HIRAGANA_TO_KATAKANA_DIF = charCode('\u30a1') - charCode('\u3041')

export const charIsHiragana = (str: string) =>
  str.length > 0 && str[0] >= HIRAGANA_START && str[0] <= HIRAGANA_END

export const charIsKatakana = (str: string) =>
  str.length > 0 && str[0] >= KATAKANA_START && str[0] <= KATAKANA_END

export const charIsKana = (str: string) => charIsHiragana(str) || charIsKatakana(str)

export const charIsKanji = (str: string) =>
  str.length > 0 &&
  ((str >= '\u4e00' && str <= '\u9fcf') ||
    (str >= '\uf900' && str <= '\ufaff') ||
    (str >= '\u3400' && str <= '\u4dbf'))

export const charIsJapanese = (str: string) => charIsKana(str) || charIsKanji(str)

const atLeastOne = (str: string, pred: (s: string) => boolean) =>
  str.split('').some(pred)

export const hasHiragana = (str: string) => atLeastOne(str, charIsHiragana)

export const hasKatakana = (str: string) => atLeastOne(str, charIsKatakana)

export const hasKana = (str: string) => atLeastOne(str, charIsKana)

export const hasKanji = (str: string) => atLeastOne(str, charIsKanji)

export const hasJapanese = (str: string) => atLeastOne(str, charIsJapanese)

export const katakanasToHiraganas = (str: string): string => {
  return str
    .split('')
    .map((char) =>
      charIsKatakana(char)
        ? String.fromCharCode(charCode(char) + KATAKANA_TO_HIRAGANA_DIF)
        : char)
    .join('')
}

export const hiraganasToKatakanas = (str: string): string => {
  return str
    .split('')
    .map((char) =>
      charIsHiragana(char)
        ? String.fromCharCode(charCode(char) + HIRAGANA_TO_KATAKANA_DIF)
        : char)
    .join('')
}
