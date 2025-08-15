
const { db, json, bad, getAuthUser, Listing, Thread } = require('./_common.js');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try{
    const u = getAuthUser(event);
    await db();
    const { listing_id } = JSON.parse(event.body||'{}');
    if(!listing_id) return bad('listing_id requis');
    const l = await Listing.findById(listing_id).lean();
    if(!l) return bad('Annonce introuvable', 404);
    const t = await Thread.create({ listingId: l._id, ownerId: l.ownerId, interestedId: u.id });
    return json(200, { ok:true, id: t._id.toString(), listing_title: l.brand || l.model || l._id.toString() });
  }catch(e){
    console.error(e); return bad('Erreur serveur', 500);
  }
};
