
const { json, auth, getDb, getObject } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const user = auth(event);
    const store = await getDb();
    let ids = await getObject(store, `threads:${user.id}`); ids = ids||[];
    const arr = []; for(const id of ids){ const t = await getObject(store, `thread:${id}`); if(t) arr.push(t); }
    return json(200, arr);
  }catch(e){ return json(401,{error:'Unauthorized'}); }
};
