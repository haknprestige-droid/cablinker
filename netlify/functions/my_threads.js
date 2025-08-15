
const { db, json, getAuthUser, Thread, Listing } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = getAuthUser(event);
    await db();
    const th = await Thread.find({ $or: [{ownerId: u.id},{interestedId: u.id}] }).sort({ createdAt: -1 }).lean();
    const ids = th.map(t => t.listingId);
    const ls = await Listing.find({ _id: { $in: ids } }).lean();
    const byId = Object.fromEntries(ls.map(x=>[x._id.toString(), x]));
    const out = th.map(t => ({ ...t, id: t._id.toString(), listing_title: (byId[t.listingId?.toString()]?.brand || byId[t.listingId?.toString()]?.model || t.listingId?.toString()) }));
    return json(200, out);
  }catch(e){ return json(401, { error:'Unauthorized' }); }
};
