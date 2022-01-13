import * as dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, json } from 'express'
import _ from 'lodash'
import bot from './bot'

const { BOT_TOKEN, PORT } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')
if (!PORT) throw new Error('"PORT" env var is required!')

const app = express()

app.use(json())

app.post('/bot/' + BOT_TOKEN, function (req, res) {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

// Used by heroku to rollback deployment if not ok
app.get('/health', (_req: Request, res: Response) => res.send('Ok'))

app.listen(PORT, () =>
  console.log(`The application is listening on port ${PORT}!`),
)
