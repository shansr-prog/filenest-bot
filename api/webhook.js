import { Bot, webhookCallback } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply(
    `👋 Welcome to FileNestBot!

📁 Send me any file.
🔗 I'll generate a download link.
`
  );
});

export default webhookCallback(bot, "http");
