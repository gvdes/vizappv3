import orderApi from 'src/API/PreordersApi';


const verificarPrecioMayoreo = (prdts, product, reglas) => {
  const categoria = product.category.familia.seccion.id;
  const categoriaReglas = reglas.filter(e => e.id == categoria)[0].rules;
  let model = 0;
  let family = 0;
  let distinct = 0
  let rev;
  if (!categoriaReglas) {
    return false;
  }
  let sameModel = prdts.filter(p => p.id === product.id).reduce((acc, curr) => acc + Number(curr.pivot.amount_require), 0);
  let sameFamily = prdts.filter(p => p.category.familia.id === product.category.familia.id).reduce((acc, curr) => acc + Number(curr.pivot.amount_require), 0);
  let distin = prdts.filter(p => p.category.familia.seccion.id === product.category.familia.seccion.id && p.id !== product.id).reduce((acc, curr) => acc + Number(curr.pivot.amount_require), 0);
  let inx = prdts.findIndex((e) => e.id == product.id);
  if (inx >= 0) {
      model = sameModel
      family = sameFamily
      distinct = distin
  } else {
    model = sameModel + Number(product.pivot.amount_require)
    family = sameFamily  + Number(product.pivot.amount_require)
    distinct = distin + Number(product.pivot.amount_require)
  }
  for (const regla of categoriaReglas) {
    if (regla._type === 2) {
      if (regla.sameModel == 1 && model >= regla.min && (!regla.max || model <= regla.max)) {
        return true;
      }
      if (regla.sameModel == 0 && family >= regla.min && (!regla.max || family <= regla.max)) {
        return true;
      }
      if (regla.sameModel == 0 && distinct >= regla.min && (!regla.max || family <= regla.max) && regla.family == 0) {
        return true;
      }
    }
  }
  return false
}

const verificarPrecioDocena = (prdts, product, reglas) => {
  const categoria = product.category.familia.seccion.id;
  const categoriaReglas = reglas.filter(e => e.id == categoria)[0].rules;
  let model = 0;
  let family = 0;
  let category = 0;

  if (!categoriaReglas) {
    return false;
  }
  let sameModel = prdts.filter(p => p.id === product.id).reduce((acc, curr) => acc + Number(curr.pivot.amount_require), 0);
  let sameFamily = prdts.filter(p => p.category.familia.id === product.category.familia.id && p.id !== product.id).reduce((acc, curr) => acc + Number(curr.pivot.amount_require), 0);
  let cat = prdts.filter(p => p.category.id === product.category.id && p.id !== product.id).reduce((acc, curr) => acc + Number(curr.pivot.amount_require), 0);
  let inx = prdts.findIndex((e) => e.id == product.id);
  if (inx >= 0) {
      model = sameModel
      family = sameFamily
      category = cat
  } else {
    model = sameModel + Number(product.pivot.amount_require)
    family = sameFamily + Number(product.pivot.amount_require)
    category = cat + Number(product.pivot.amount_require)
  }
  for (const regla of categoriaReglas) {
    if (regla._type === 3) {
      if (regla.sameModel == 1 && model >= regla.min && (!regla.max || model <= regla.max)) {
        return true;
      }
      if (regla.sameModel == 0 && family >= regla.min && (!regla.max || family <= regla.max)) {
        return true;
      }
      if (regla.sameModel == 1 && category >= regla.min && (!regla.max || family <= regla.max) && regla.category == 1) {
        return true;
      }
    }
  }
  return false;
}

const actualizarPreciosProductos = async (products, order, rules) => {
  const productosCambiados = [];

  for (const p of products) {
    const totalPzsTemp = p.pivot._supply_by == 3
      ? (p.amount_require * p.pieces)
      : p.pivot._supply_by == 2
        ? (p.amount_require * 12)
        : p.amount_require;

    let newPriceList = 0;

    if (order.client._price_list <= 3) {
      if ((totalPzsTemp >= p.pieces && (p.pivot._supply_by == 1 || p.pivot._supply_by == 2)) || p.pivot._supply_by == 3) {
        newPriceList = 4;
      } else if (verificarPrecioDocena(products, p, rules)) {
        newPriceList = 3;
      } else if (verificarPrecioMayoreo(products, p, rules)) {
        newPriceList = 2;
      } else {
        newPriceList = 1;
      }
    } else {
      newPriceList = order.client._price_list;
    }

    const priceData = p.prices.find(e => e.id == newPriceList);

    if (priceData) {
      const precioViejo = p.pivot.price;
      const listaVieja = p.pivot._price_list;

      const nuevoPrecio = priceData.pivot.price;

      if (precioViejo !== nuevoPrecio || listaVieja !== newPriceList) {
        p.pivot._price_list = newPriceList;
        p.pivot.price = nuevoPrecio;
        p.pivot.total = totalPzsTemp * nuevoPrecio;
        productosCambiados.push({
          _order: p.pivot._order,
          _product: p.id,
          _price_list: newPriceList,
          price: nuevoPrecio,
          total: totalPzsTemp * nuevoPrecio
        });
      }
    }
  }

  if (productosCambiados.length > 0) {
    const resp = await orderApi.updateProductPrices(productosCambiados);
    console.log(resp)
    if (resp.fail) {
      console.error('Error al actualizar precios:', resp);
    } else {
      console.log('Precios actualizados correctamente');
    }
  }
};

export default { verificarPrecioMayoreo, verificarPrecioDocena, actualizarPreciosProductos }
