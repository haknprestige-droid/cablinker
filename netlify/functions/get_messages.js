
const { db, json, bad, getAuthUser, Thread, Message } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = getAuthUser(event);
    await db();
    const qs = event.queryStringParameters || {};
    const thread_id = qs.thread_id;
    if(!thread_id) return bad('thread_id requis');
    const t = await Thread.findById(thread_id).lean();
    if(!t) return bad('Thread introuvable',404);
    if(String(u.id)!==String(t.ownerId) && String(u.id)!==String(t.interestedId)) return bad('Accès refusé',403);
    const msgs = await Message.find({ threadId: t._id }).sort({ createdAt: 1 }).lean();
    const arr = msgs.map(m => ({ sender_name: String(m.senderId)===String(u.id)?'Vous':'Autre', body: m.body, created_at: m.createdAt }));
    return json(200, arr);
  }catch(e){ return json(401, { error:'Unauthorized' }); }
};
