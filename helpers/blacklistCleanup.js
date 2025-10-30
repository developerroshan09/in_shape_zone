// const cron = require('node-cron');
// const Blacklist = require('../models/blacklistModel');

// const cleanExpiredtokens = async () => {
//     const now = new Date();
//     const result = await Blacklist.deleteMany({ expiresAt: {$lte: now} });
//     if (result.deletedCount > 0) {
//         console.log(`Expired tokens cleand from blacklist. count: ${result.deletedCount}`);
//     }
// }

// const scheduleBlacklistCleanup = () => {
//     cron.schedule("*/10 * * * *", cleanExpiredtokens);
// }

// module.exports = scheduleBlacklistCleanup;