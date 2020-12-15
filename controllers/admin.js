const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

//Open Admin add product page
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

// add a product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  .then(()=>{
    console.log("Added Product Successfully");
    res.redirect('/admin/products')
  })
  .catch(err=> console.log(err))
};

//load admin products page
exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err))
};

// open a product page in edit mode
exports.getEditProduct = (req, res, next) => {
  let editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  //fetch the data to auto populate
  const id = req.params.id;
  req.user.getProducts({where :{id: id}})
  .then((products) => {
    const product = products[0];
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err=>console.log(err))
};

//update a product after edit and redirect to admin products page
exports.postEditProduct = (req, res, next) => {
  //get data from form
  const id = req.body.id;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  
  Product.findByPk(id)
  .then(product=>{
    product.id = id;
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;
    return product.save()
  })
  .then(()=>{
    console.log("Updated Successfully")
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))
}

// delete a product
exports.deleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.findByPk(id)
  .then((product) => {
    return product.destroy();
  })
  .then(()=>{
    console.log("Product Deleted");
    res.redirect('/admin/products');
  })
  .catch()

  console.log("Product with id:" + id + " deleted");
  res.redirect('/admin/products');
}

