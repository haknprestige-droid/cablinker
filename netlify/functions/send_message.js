
const { db, json, bad, getAuthUser, Thread, Message } = require('./_common.js');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try{
    const u = getAuthUser(event);
    await db();
    const { thread_id, body } = JSON.parse(event.body||'{}');
    if(!thread_id || !body) return bad('Paramètres requis');
    const t = await Thread.findById(thread_id).lean();
    if(!t) return bad('Thread introuvable',404);
    if(String(u.id)!==String(t.ownerId) && String(u.id)!==String(t.interestedId)) return bad('Accès refusé',403);
    await Message.create({ threadId: t._id, senderId: u.id, body: String(body).slice(0,2000) });
    return json(200, { ok:true });
  }catch(e){
    console.error(e); return bad('Erreur serveur', 500);
  }
};
