import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { getRandomForesight } from './foresight.js';
import http from 'http';
import { processBirthday } from './birthday.js';

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);


bot.start(ctx => ctx.reply('Я тут нічого не вмію....'));

bot.action('start', (ctx: any) => console.log('Start ', ctx.message));

bot.on('inline_query', async (ctx) => {
  const {from} = ctx.inlineQuery

  const result = [await getRandomForesight(from.username ? '@' + from.username : from.first_name)]

  await ctx.answerInlineQuery(result, {
    cache_time: 0
  })
})

bot.on('message', async (ctx) => {
  console.log('MESSAGE RECEIVED')
  console.log('ctx chat', ctx.chat);

  try {
    const member = await ctx.telegram.getChatMember(
      ctx.chat.id,
      ctx.from.id
    )

    console.log('member', member)
    console.log('STATUS:', member.status)

  } catch (e) {
    console.error('FAILED:', e)
  }
})

bot.launch(() => console.log('Bot is running'));

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    if(req.url?.includes('/birthday')) {
        res.statusCode = 200;
        await processBirthday(bot);
    }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify({
    message: 'Hello from Node.js server',
  }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
