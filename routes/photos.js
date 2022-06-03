const express = require("express");
const router = express.Router();
const Photos=require("../models/Photos")


//GET ALL PHOTOS
router.get("/", async(req, res) => {
 try {
   const allPhotos = await Photos.find()
   res.json(allPhotos)
 } catch (error) {
  res.json({message:error})
 }
});



//GET PHOTOS BY NAME ... IN CASE THERE WOULD BE A SEARCH BAR IN THE FUTURE...
router.get("/query/:searchBy", async (req, res) => {
  const query = { name: { $regex: `(?i)${req.params.searchBy}` } }
  try {
    const allPhotos = await Photos.find(query);
    res.json(allPhotos);
  } catch (error) {
    res.json({ message: error });
  }
});

//GET PHOTO BY ID
router.get("/filter/:id", async(req,res) => {
   try {
    const selectedPhoto= await Photos.findById(req.params.id)
     res.status(200).header({Allowed:true}).send({
       selectedPhoto
     });
   } catch (error) {
     res.send({ message: error });
   }
})

//GET FEATURED PHOTO
router.get("/featured", async (req, res) => {
  try {
    const featuredPhoto = await Photos.find({ featured: true });
    res.json(featuredPhoto);
  } catch (error) {
    res.json({ message: error });
  }
});



//IN ORDER TO GET PHOTOS BY  MULTIPLE FILTERS
router.post("/filter", async (req, res) => {
  let query; 

  if (req.body?.categories && req.body?.price) {
    query = {
      category: { $in: req.body.categories },
      price: { $gt: req.body?.price[0], $lt: req.body?.price[1] },
    };
  } else if (req.body?.categories && !req.body?.price) {
    query = {
      category: { $in: req.body.categories },
    };
  } else if (!req.body?.categories && req.body?.price) {
    query = {
      price: { $gt: req.body?.price[0], $lt: req.body?.price[1] },
    };
  } else {
    query = {};
  }

  // IN ORDER TO PROVIDE PAGINATION, ...EVERY PAGE WILL SHOW 6 ITEMS
  const page = req.body.page || 0;
    try {
      const allPhotos = await Photos.find(query);
      const photosToSend =  allPhotos.slice(page * 6, page * 6 + 6);
      res.send({
        totalNumberOfPhotos: allPhotos.length,
        numberOfShowingPhotos:photosToSend.length,
        photos: photosToSend,
      });
    } catch (error) {
      res.send({ message: error });
    }
});

module.exports = router;