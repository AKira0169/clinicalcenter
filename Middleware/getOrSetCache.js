const client = require('../config/redisClient.js');

module.exports = async function getOrSetCache(key, callback) {
  try {
    const cachedData = await client.get(key);
    console.log('a7a', cachedData);
    if (cachedData !== null && cachedData !== undefined) {
      return JSON.parse(cachedData);
    } else {
      const data = await callback();
      await client.setEx(key, 15, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
