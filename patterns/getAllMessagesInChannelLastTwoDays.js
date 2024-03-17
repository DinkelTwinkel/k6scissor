const KimoTracker = require("../models/kimoTracker");
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (channel) => {
    let messages = [];
    let lastId;

    const tracker = await KimoTracker.findOne({ serverId: kimoServerID });
    const nextDateUtcMil = tracker.nextDate;
    const period = tracker.currentPeriodLength;
    const previousDateUtcMil = nextDateUtcMil - (3 * period);

    const now = new Date();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const options = { limit: 100, cache: false };
      if (lastId) {
        options.before = lastId;
      }

      const fetchedMessages = await channel.messages.fetch(options);
      messages = messages.concat(Array.from(fetchedMessages.values()));

      if (fetchedMessages.size < 100) {
        break;
      }

      if (messages[messages.length - 5].createdAt.getTime() < (now.getTime() - (1000 * 60 * 60 * 24 * 2) )) {
        console.log (messages[messages.length]);
        break;
      }

      lastId = fetchedMessages.last().id;
    }

    return messages;
};