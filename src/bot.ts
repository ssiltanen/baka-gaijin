import TelegramBot from 'node-telegram-bot-api'
import { convert } from './domain'

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

bot.on('inline_query', async (msg) => {
  if (msg.query) {
    const normal = await convert(msg.query, 'normal')
    const spaced = await convert(msg.query, 'spaced')
    const okurigana = await convert(msg.query, 'okurigana')
    //const furigana = await convert(msg.query, 'furigana')
    bot.answerInlineQuery(msg.id, [
      {
        id: 'normal',
        type: 'article',
        title: 'Normal',
        input_message_content: { message_text: normal },
      },
      {
        id: 'spaced',
        type: 'article',
        title: 'Spaced',
        input_message_content: { message_text: spaced },
      },
      {
        id: 'okurigana',
        type: 'article',
        title: 'Okurigana',
        input_message_content: { message_text: okurigana },
      },
      // {
      //   id: 'furigana',
      //   type: 'article',
      //   title: 'Furigana',
      //   input_message_content: { message_text: furigana, parse_mode: 'HTML' },
      // },
    ])
  }
})

export default bot
