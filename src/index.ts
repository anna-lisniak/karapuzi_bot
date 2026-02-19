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


bot.start(async ctx => {
  const from = ctx.from;
  const foresight = await getRandomForesight(from.username ? '@' + from.username : from.first_name)
  ctx.reply(foresight)
});

bot.command('magic', async ctx => {
  const from = ctx.from;
  const foresight = await getRandomForesight(from.username ? '@' + from.username : from.first_name)
  ctx.reply(foresight)
});

// bot.action('start', (ctx: any) => {
//   const from = ctx.from;
//   console.log('Start ', ctx.message)
// });

bot.on('inline_query', async (ctx) => {
  const {from} = ctx.inlineQuery

  const foresight = await getRandomForesight(from.username ? '@' + from.username : from.first_name)

  await ctx.answerInlineQuery([
       {
        type: 'article',
        id: '1',
        title: 'Начаклую....🔮',
        description: 'Дізнайся своє передбачення!',
        input_message_content: {
            message_text: `🔮 Передбачення для ${name}:\n\n${foresight}`
        }
    }
  ], {
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
