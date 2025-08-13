
const { json, bad, auth, getDb, getObject, putObject } = require('./_common.js');
exports.handler = async (event) => {
  if(event.httpMethod!=='POST') return json(405,{error:'Method'});
  const user = auth(event); const { thread_id, body } = JSON.parse(event.body||'{}');
  if(!thread_id || !body) return bad('Paramètres requis');
  const store = await getDb(); const thread = await getObject(store, `thread:${thread_id}`);
  if(!thread) return bad('Thread introuvable',404);
  if(user.id !== thread.owner_id && user.id !== thread.interested_id) return bad('Accès refusé',403);
  const msg = { sender_id: user.id, body: String(body).slice(0,2000), created_at: new Date().toISOString() };
  let msgs = await getObject(store, `msgs:${thread_id}`); msgs = msgs||[]; msgs.push(msg); await putObject(store, `msgs:${thread_id}`, msgs);
  return json(200, { ok:true });
};
