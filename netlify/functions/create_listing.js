
const { json, bad, auth, getDb, putObject, getObject, uuidv4, uploadPhotosIfConfigured } = require('./_common.js');
exports.handler = async (event) => {
  if(event.httpMethod!=='POST') return json(405,{error:'Method'});
  let user; try{ user=auth(event); }catch(e){ return json(401,{error:'Unauthorized'}); }
  const body = JSON.parse(event.body||'{}');
  const { domaine, type, city, postal_code, brand, model, year, price, description, options, assurance, caution, caution_amount, photos } = body;
  if(!domaine||!type||!city||!description) return bad('Champs requis manquants');
  const store = await getDb();
  const id = uuidv4();
  const uploaded = await uploadPhotosIfConfigured(photos||[]);
  const listing = { id, status:'actif', owner_id:user.id, domaine, type, city, postal_code, brand, model, year, price: Number(price||0), description, options: options||[], assurance, caution, caution_amount: Number(caution_amount||0), photos: (uploaded||[]).slice(0,3), created_at: new Date().toISOString() };
  await putObject(store, `listing:${id}`, listing);
  let index = await getObject(store, 'list:index'); index = index||[]; index.unshift({ id, domaine, type, city, postal_code, brand, model, year, price: listing.price, options: listing.options, status:'actif' });
  await putObject(store, 'list:index', index);
  let mine = await getObject(store, `user_list:${user.id}`); mine = mine||[]; mine.unshift(id); await putObject(store, `user_list:${user.id}`, mine);
  return json(200, { ok:true, id });
};
