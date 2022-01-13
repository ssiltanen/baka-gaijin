const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')

type Mode = 'normal' | 'spaced' | 'okurigana' | 'furigana'

export const convert = async (text: string, mode: Mode) => {
  const kuroshiro = new Kuroshiro()
  await kuroshiro.init(new KuromojiAnalyzer())
  return kuroshiro.convert(text, { mode, to: 'hiragana' })
}
