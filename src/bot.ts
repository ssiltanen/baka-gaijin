import TelegramBot from 'node-telegram-bot-api'
import { hasJapanese } from './text-util'
import { analyze, Token } from './tokenizer'

const { BOT_TOKEN, APP_URL, PORT } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')
if (!APP_URL) throw new Error('"APP_URL" env var is required!')
if (!PORT) throw new Error('"PORT" env var is required!')

let bot: TelegramBot
if (process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(BOT_TOKEN)
  bot.setWebHook(`${APP_URL}/bot/${BOT_TOKEN}`)
} else {
  bot = new TelegramBot(BOT_TOKEN, { polling: true })
}

bot.setMyCommands([])

const concise = (tokens: Token[]) => {
  return tokens.map((token) => token.reading).join(' ')
}

const verbose = (tokens: Token[]) => {
  const text = tokens.map((token) => token.token).join(' ')
  const details = tokens
    .filter((token) => token.hasKanji)
    .map((token) => `${token.token} - ${token.reading}`)
    .join('\n')
  if (details) return `${text}\n---\n${details}`
  return text
}

bot.on('inline_query', (msg) => {
  if (msg.query) {
    const tokens = analyze(msg.query)
    bot.answerInlineQuery(
      msg.id,
      [
        {
          id: 'concise',
          type: 'article',
          title: 'Concise',
          input_message_content: { message_text: concise(tokens) },
        },
        {
          id: 'verbose',
          type: 'article',
          title: 'Verbose',
          input_message_content: { message_text: verbose(tokens) },
        },
      ],
      {
        cache_time: 1,
        is_personal: true,
      },
    )
  }
})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  if (msg.text) {
    const tokens = analyze(msg.text)
    if (tokens.some(({ token }) => hasJapanese(token))) {
      return await bot.sendMessage(chatId, verbose(tokens))
    }
  } 
  await bot.sendMessage(chatId, 'Baaaka!')
})

export default bot
