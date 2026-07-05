module.exports = function (bot) {
  bot.onText(/\/setinterest/, (msg) => {
    bot.sendMessage(msg.chat.id, "Choose interests:", {
      reply_markup: {
        keyboard: [["Tech", "Business"], ["Sports", "Politics"], ["All News"]],
        resize_keyboard: true,
      },
    });
  });

  bot.onText(/\/setlocation/, (msg) => {
    bot.sendMessage(msg.chat.id, "Send location:", {
      reply_markup: {
        keyboard: [[{ text: "📍 Share Location", request_location: true }]],
        resize_keyboard: true,
      },
    });
  });
};
