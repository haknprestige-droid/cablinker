
const { db, json, getAuthUser, Listing } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = getAuthUser(event);
    await db();
    const arr = await Listing.find({ ownerId: u.id }).sort({ createdAt: -1 }).lean();
    return json(200, arr);
  }catch(e){ return json(401, { error:'Unauthorized' }); }
};
