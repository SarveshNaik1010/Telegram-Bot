const cron = require("node-cron");
const sendNewsToUsers = require("./newsSender");

module.exports = function (bot) {
  // every 1 hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running news job ⏰");
    await sendNewsToUsers(bot);
  });
};
