
const { json, auth, getDb, getObject } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = auth(event);
    const store = await getDb();
    let ids = await getObject(store, `user_list:${u.id}`); ids = ids||[];
    const rows = [['id','domaine','type','city','postal_code','brand','model','year','price','created_at']];
    for(const id of ids){ const l = await getObject(store, `listing:${id}`); if(l){ rows.push([l.id,l.domaine,l.type,l.city||'',l.postal_code||'',l.brand||'',l.model||'',String(l.year||''),String(l.price||''),l.created_at]); } }
    const csv = rows.map(r => r.map(v => '"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');
    return json(200, { csv });
  }catch(e){ return json(401,{error:'Unauthorized'}); }
};
