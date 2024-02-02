module.exports = async (channel) => {
    let messages = [];
    let lastId;

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

      lastId = fetchedMessages.last().id;
    }

    return messages;
};