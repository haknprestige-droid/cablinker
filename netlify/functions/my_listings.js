
const { json, auth, getDb, getObject } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const user = auth(event);
    const store = await getDb();
    let ids = await getObject(store, `user_list:${user.id}`); ids = ids||[];
    const arr = []; for(const id of ids){ const l = await getObject(store, `listing:${id}`); if(l) arr.push(l); }
    return json(200, arr);
  }catch(e){ return json(401,{error:'Unauthorized'}); }
};
