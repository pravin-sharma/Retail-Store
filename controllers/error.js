exports.get404 = (req, res, next) => {
  console.log("Not Found url:", req.url);
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};
