const controllers = require('./controllers');

const router = (app) => {
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);
  app.get('/getCatName', controllers.getCatName);
  app.get('/findCatByName', controllers.searchCatName);
  app.get('/getDogName', controllers.getDogName);
  app.get('/findDogByName', controllers.searchDogName);

  app.get('/', controllers.index);

  app.get('/*', controllers.notFound);

  app.post('/setCatName', controllers.setCatName);
  app.post('/setDogName', controllers.setDogName);

  app.post('/updateLastCat', controllers.updateLastCat);
};

// export the router function
module.exports = router;
