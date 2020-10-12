// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultCatData = {
  name: 'unknown',
  bedsOwned: 0,
};

const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastCatAdded = new Cat(defaultCatData);
let lastDogAdded = new Dog(defaultDogData);

// PAGE HOSTING --

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastCatAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean();
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback).lean();
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }

    return res.render('page1', {
      cats: docs,
    });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page4', {
      dogs: docs,
    });
  };

  readAllDogs(req, res, callback);
};

// CATS -----------

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }

    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({
      error: 'firstname,lastname and beds are all required',
    });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  // save operation
  // promise is an object to which you can attach events to in the future
  const savePromise = newCat.save();

  // add events to the promise
  savePromise.then(() => {
    lastCatAdded = newCat;

    res.json({
      name: lastCatAdded.name,
      beds: lastCatAdded.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({
      err,
    });
  });

  return res;
};

const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({
      error: 'Name is required to perform a search',
    });
  }

  // find cat by name
  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }

    if (!doc) {
      return res.json({
        error: 'No Cats Found!',
      });
    }

    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  });
};

const getCatName = (req, res) => {
  res.json({
    name: lastCatAdded.Name,
  });
};

const updateLastCat = (req, res) => {
  lastCatAdded.bedsOwned++;

  // send to database - save is a smart update or add
  const savePromise = lastCatAdded.save();

  savePromise.then(() => {
    res.json({
      name: lastCatAdded.name,
      beds: lastCatAdded.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({
      err,
    });
  });
};

// DOGS ------------

const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }

    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const getDogName = (req, res) => {
  res.json({
    name: lastDogAdded.Name,
  });
};

const setDogName = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({
      error: 'firstname, age and breed are all required',
    });
  }

  const name = `${req.body.name}`;

  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  // save operation
  // promise is an object to which you can attach events to in the future
  const savePromise = newDog.save();

  // add events to the promise
  savePromise.then(() => {
    lastDogAdded = newDog;

    res.json({
      name: lastDogAdded.name,
      breed: lastDogAdded.breed,
      age: lastDogAdded.age,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({
      err,
    });
  });

  return res;
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({
      error: 'Name is required to perform a search',
    });
  }

  // find dog by name
  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }

    if (!doc) {
      return res.json({
        error: 'No Dogs Found!',
      });
    }

    const updateDog = doc;
    updateDog.age++;

    // send to database - save is a smart update or add
    const savePromise = updateDog.save();

    savePromise.then(() => res.json({
      name: updateDog.name,
      breed: updateDog.breed,
      age: updateDog.age,
    }));

    savePromise.catch((err1) => {
      res.status(500).json({
        err1,
      });
    }); // end promise catch

    return savePromise;
  }); // end findByName
}; // end searchDogName function

// notFound handling --
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export all functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  getCatName,
  setCatName,
  searchCatName,
  updateLastCat,
  readDog,
  getDogName,
  setDogName,
  searchDogName,
  notFound,
};
