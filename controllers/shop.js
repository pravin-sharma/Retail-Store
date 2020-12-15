const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      // console.log(products)
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err))
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id
  console.log(id);
  Product.findByPk(id)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        path: '/products',
        pageTitle: product.title
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then((cart) => {
      return cart.getProducts()
    })
    .then((cartProducts) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        cartProductData: cartProducts
      });
    })
    .catch(err => console.log(err))
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.id;
  let fetchedCart;
  let newQuantity = 1

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      //can be present already
      //fetched + 1
      let product;
      if (products.length > 0) {
        product = products[0]
      }
      //if not present
      if (product) {
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product
      }
      //get data about product from db
      return Product.findByPk(prodId)
    })
    .then(product => {
      //add to cart
      fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(()=>{
      res.redirect('/cart')
    })
    .catch(err=>console.log(err))
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.id;
  req.user.getCart()
  .then((cart)=>{
    return cart.getProducts({where:{id: prodId}})
  })
  .then((products)=>{
    let product = products[0];
    console.log(product);
    return product.cartItem.destroy()
  })
  .then(()=>{
    res.redirect('/cart')
  })
  .catch(err=>console.log(err))
}

exports.createOrder = (req,res,next)=>{
  
}


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
