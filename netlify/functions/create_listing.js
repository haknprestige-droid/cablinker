
const { db, json, bad, getAuthUser, Listing, uploadPhotos } = require('./_common.js');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try{
    const u = getAuthUser(event);
    await db();
    const body = JSON.parse(event.body || '{}');
    const { domaine, type, city, postal_code, brand, model, year, price, description, options, assurance, caution, caution_amount, photos } = body;
    if(!domaine || !type || !city || !description) return bad('Champs requis manquants');
    const urls = await uploadPhotos(photos||[]);
    const listing = await Listing.create({
      ownerId: u.id, domaine, type, city, postal_code, brand, model,
      year: year? Number(year): undefined,
      price: price? Number(price): undefined,
      description, options: options||[], assurance, caution,
      caution_amount: caution_amount? Number(caution_amount): undefined,
      photos: urls, status: 'actif'
    });
    return json(200, { ok:true, id: listing._id.toString() });
  }catch(e){
    console.error(e);
    return bad('Erreur serveur', 500);
  }
};
