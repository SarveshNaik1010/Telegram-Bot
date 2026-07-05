const supabase = require("../services/supabase");

module.exports = function (bot) {
  // START
  bot.onText(/\/start/, async (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "Welcome 🚀\n\nSend your location to personalize news",
      {
        reply_markup: {
          keyboard: [[{ text: "📍 Share Location", request_location: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
  });

  // LOCATION HANDLER
  bot.on("location", async (msg) => {
    const { latitude, longitude } = msg.location;

    await supabase.from("users").upsert({
      telegram_id: msg.from.id,
      latitude,
      longitude,
    });

    bot.sendMessage(
      msg.chat.id,
      "Got your location ✅\n\nNow choose your interests:",
      {
        reply_markup: {
          keyboard: [
            ["Tech", "Business"],
            ["Sports", "Politics"],
            ["All News"],
          ],
          resize_keyboard: true,
        },
      },
    );
  });

  // INTEREST HANDLER
  bot.on("message", async (msg) => {
    const interests = ["Tech", "Business", "Sports", "Politics", "All News"];

    if (interests.includes(msg.text)) {
      await supabase
        .from("users")
        .update({
          interests: msg.text,
        })
        .eq("telegram_id", msg.from.id);

      bot.sendMessage(
        msg.chat.id,
        `Preferences saved ✅\n\nYou'll receive personalized news every hour 📰`,
        { reply_markup: { remove_keyboard: true } },
      );
    }
  });
};
