
const { json, getDb, getObject } = require('./_common.js');
exports.handler = async () => {
  const store = await getDb();
  let idx = await getObject(store, 'list:index'); idx = idx||[];
  const full = [];
  for(const meta of idx){ const l = await getObject(store, `listing:${meta.id}`); if(l && l.status!=='supprime'){ full.push(l); } }
  return json(200, full.filter(x=>x.status!=='suspendu'));
};
