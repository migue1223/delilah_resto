const TABLA = "products";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("./index");
  }
  async function list() {
    return store.list(TABLA);
  }

  async function get(id) {
    return store.get(TABLA, id);
  }

  async function insert(body) {
    await validateNameProduct(body.name);

    const product = {
      prod_name: body.name,
      prod_img_url: body.url,
      prod_price: body.price,
      prod_enable: body.enable,
    };

    const insertId = await store.insert(TABLA, product);
    if (insertId.insertId) {
      return product;
    }
  }

  async function update(body) {
    await validateNameProduct(body.name);
    
    const product = {
      prod_id: body.id,
      prod_name: body.name,
      prod_img_url: body.url,
      prod_price: body.price,
      prod_enable: body.enable,
    };

    const insertId = await store.update(TABLA, product);
    if (insertId.insertId) {
      return product;
    }
  }

  async function validateNameProduct(name) {
    const isName = await store.get(TABLA, "prod_name", name);

    if (isName.length > 0 && isName[0].prod_id) {
      throw new Error("Conflict, product name already exist");
    }
  }

  return {
    list,
    get,
    insert,
    update,
  };
};
