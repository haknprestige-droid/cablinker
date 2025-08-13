
const { json, bad, auth, getDb, getObject } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const user = auth(event); const thread_id = (event.queryStringParameters && event.queryStringParameters.thread_id) || null;
    if(!thread_id) return bad('thread_id requis');
    const store = await getDb(); const thread = await getObject(store, `thread:${thread_id}`);
    if(!thread) return bad('Thread introuvable',404);
    if(user.id !== thread.owner_id && user.id !== thread.interested_id) return bad('Accès refusé',403);
    const msgs = await getObject(store, `msgs:${thread_id}`) || [];
    const arr = msgs.map(m => ({ ...m, sender_name: (m.sender_id===user.id ? 'Vous' : 'Autre') }));
    return json(200, arr);
  }catch(e){ return json(401,{error:'Unauthorized'}); }
};
