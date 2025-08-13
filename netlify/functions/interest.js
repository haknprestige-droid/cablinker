
const { json, bad, auth, getDb, getObject, putObject, uuidv4 } = require('./_common.js');
exports.handler = async (event) => {
  if(event.httpMethod!=='POST') return json(405,{error:'Method'});
  const user = auth(event); const { listing_id } = JSON.parse(event.body||'{}');
  if(!listing_id) return bad('listing_id requis');
  const store = await getDb(); const listing = await getObject(store, `listing:${listing_id}`);
  if(!listing) return bad('Annonce introuvable',404);
  const threadId = uuidv4(); const thread = { id:threadId, listing_id, listing_title: listing.brand || listing.title || listing_id, owner_id: listing.owner_id, interested_id: user.id, created_at: new Date().toISOString() };
  await putObject(store, `thread:${threadId}`, thread);
  let tOwner = await getObject(store, `threads:${listing.owner_id}`); tOwner = tOwner||[]; tOwner.unshift(threadId);
  let tInt = await getObject(store, `threads:${user.id}`); tInt = tInt||[]; tInt.unshift(threadId);
  await putObject(store, `threads:${listing.owner_id}`, tOwner); await putObject(store, `threads:${user.id}`, tInt);
  return json(200, { ok:true, id: threadId });
};
