
const { db, json, Listing } = require('./_common.js');
exports.handler = async () => {
  await db();
  const arr = await Listing.find({ status: { $ne: 'supprime' } }).sort({ createdAt: -1 }).limit(200).lean();
  return json(200, arr.filter(x => x.status !== 'suspendu'));
};
