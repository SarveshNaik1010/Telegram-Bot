const supabase = require("../services/supabase");
const getNews = require("../services/newsService");

module.exports = async function (bot) {
  const { data: users } = await supabase.from("users").select("*");

  for (const user of users) {
    // fetch news based on:
    // - location
    // - interest
    const news = await getNews({
      lat: user.latitude,
      lng: user.longitude,
      interest: user.interests,
    });

    // send personalized news
    if (news.personalized.length > 0) {
      await bot.sendMessage(
        user.telegram_id,
        `📍 Personalized News:\n\n${news.personalized}`,
      );
    }

    // send global/breaking news
    if (news.global.length > 0) {
      await bot.sendMessage(
        user.telegram_id,
        `🌍 Breaking News:\n\n${news.global}`,
      );
    }
  }
};
