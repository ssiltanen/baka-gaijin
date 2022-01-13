import kuromoji from 'kuromoji'
import {
  hasJapanese,
  hasKanji,
  hasKatakana,
  katakanasToHiraganas,
} from './text-util'

const KUROMOJI_DICT = 'node_modules/kuromoji/dict/'

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>
kuromoji.builder({ dicPath: KUROMOJI_DICT }).build((err, t) => {
  err && console.error(err)
  tokenizer = t
})

export interface Token {
  hasKanji: boolean
  token: string
  reading: string
}

export const analyze = (text: string): Token[] => {
  return tokenizer
    .tokenize(text)
    .map((token) => {
      return { ...token, surface_form: token.surface_form.trim() }
    })
    .filter((token) => token.surface_form)
    .map((token) => {
      if (hasJapanese(token.surface_form)) {
        const kanji = hasKanji(token.surface_form)
        const katakana = hasKatakana(token.surface_form)

        let reading
        if (katakana) reading = token.surface_form
        else if (kanji && token.reading)
          reading = katakanasToHiraganas(token.reading.trim())
        else reading = token.surface_form

        return {
          hasKanji: kanji,
          token: token.surface_form,
          reading: reading,
        }
      } else {
        return {
          hasKanji: false,
          token: token.surface_form,
          reading: token.surface_form,
        }
      }
    })
}
