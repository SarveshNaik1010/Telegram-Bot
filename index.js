require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// modules
const setupCommands = require('./bot/commands');
const setupOnboarding = require('./bot/onboarding');
const startScheduler = require('./bot/scheduler');

// ===== INIT BOT =====
const bot = new TelegramBot(process.env.TOKEN, {
  polling: true
});

// ===== BASIC HEALTH CHECK =====
bot.onText(/\/start/, async (msg) => {
  try {
    await bot.sendMessage(
      msg.chat.id,
      `🚀 Welcome to AI News Bot\n\nSetting things up for you...`
    );
  } catch (err) {
    console.error("Start Error:", err);
  }
});

// ===== FALLBACK HANDLER (ONLY FOR DEBUG) =====
// ⚠️ Keep this LAST so it doesn't interfere with onboarding
bot.on('message', async (msg) => {
  try {
    if (!msg.text) return;

    // ignore commands (they are handled elsewhere)
    if (msg.text.startsWith('/')) return;

    // optional debug mode
    if (process.env.DEBUG === "true") {
      await bot.sendMessage(
        msg.chat.id,
        `⚙️ Debug: received "${msg.text}"`
      );
    }

  } catch (err) {
    console.error("Message Error:", err);
  }
});

// ===== ATTACH FEATURES =====
setupCommands(bot);
setupOnboarding(bot);

// ===== START SCHEDULER =====
startScheduler(bot);

// ===== GLOBAL ERROR HANDLING =====
bot.on('polling_error', (error) => {
  console.error("Polling Error:", error.code, error.message);
});

bot.on('webhook_error', (error) => {
  console.error("Webhook Error:", error.code, error.message);
});

process.on('unhandledRejection', (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});

// ===== START LOG =====
console.log("🤖 AI News Bot is running...");