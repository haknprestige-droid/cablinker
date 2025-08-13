
const { json, bad, auth, ADMIN_EMAIL, getDb, getObject, putObject } = require('./_common.js');
exports.handler = async (event) => {
  if(event.httpMethod!=='POST') return json(405,{error:'Method'});
  const u = auth(event); if(!(ADMIN_EMAIL && u.email===ADMIN_EMAIL.toLowerCase())) return bad('Accès admin requis',403);
  const { id, status } = JSON.parse(event.body||'{}'); if(!id||!status) return bad('Paramètres requis');
  const store = await getDb(); const l = await getObject(store, `listing:${id}`); if(!l) return bad('Annonce introuvable',404);
  if(['actif','suspendu','supprime','supprimer'].includes(status)){ l.status = (status==='supprimer')?'supprime':status; } else { return bad('Statut invalide'); }
  await putObject(store, `listing:${id}`, l);
  let idx = await getObject(store, 'list:index') || []; idx = idx.map(m => m.id===id ? {...m, status:l.status} : m); await putObject(store, 'list:index', idx);
  return json(200, { ok:true, status:l.status });
};
