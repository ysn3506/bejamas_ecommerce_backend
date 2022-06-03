const axios = require("axios");
const li = require("lorem-ipsum").LoremIpsum;
const { v4: uuidv4 } = require('uuid');
const Photos = require("./models/Photos");

require("dotenv/config")



// Categories of Photos
const categories = [
  "lifestyle","people","adventure","nature","pets"
]

const promises = [];


//Price Lists of Photos
const prices=[3.89,99.99,101, 50.89, 7.63, 10.99]


const itemArray = [];
const resps = [];



//Photos are provided from Pexel.com
const connection = axios.create({
  baseURL: "https://api.pexels.com/v1/",
  headers: {
    Authorization: process.env.PEXEL_API_TOKEN,
  },
});


//In order to provide a description for each photo
const lorem = new li({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});




const getFirstPhotos =  () => {
   for (let i = 0; i < categories.length; i++) {
     promises.push(
       connection
         .get(`search?query=${categories[i]}&&per_page=24`)
         .then((data) => {
           for (let j = 0; j < 24; j++) {
             const picId = uuidv4();
             const photo = {
               picId,
               name: data.data.photos[j].alt,
               category: categories[i],
               price: prices[Math.floor(Math.random() * 3)],
               currency: "USD",
               image: {
                 src: data.data.photos[j].src,
                 alt: data.data.photos[j].alt,
               },
               bestseller: j===0?true:false,   //First Item of each category will be bestseller
               featured: i===0&&j===0?true:false, //First element of array will be featured
               details: {
                 width: data.data.photos[j].width,
                 height: data.data.photos[j].height,
               },
               size: `${data.data.photos[j].width}x${data.data.photos[j].height}`,
               description: `${lorem.generateSentences(5)}`,
               recommendations: [],
             };

             itemArray.push(photo);
           }
         })
     );
   }
}


const uploadAllPhotos = async() => {
     try {
     getFirstPhotos();
    Promise.all(promises).then(() => {
      const otherArr = itemArray;
      itemArray.forEach((item) => {
        const related = otherArr.filter(pic => pic.category === item.category);
        const randomArr = [
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 23),
          Math.floor(Math.random() * 22),
        ];
    
          
        // recommendations for each photo are  selected randomly from category of the photo
        if (item.recommendations.length === 0) {
          item.recommendations.push(related[randomArr[0]].picId);
          item.recommendations.push(related[randomArr[1]].picId);
          item.recommendations.push(related[randomArr[2]].picId);
        }
   
          
      })
    }).then(() => {

      itemArray.forEach(async (item) => {
        const ph = new Photos({
          picId: item.picId,
          name: item.name,
          category: item.category,
          price: item.price,
          currency: item.currency,
          image: item.image,
          bestseller: item.bestseller,
          featured: item.featured,
          details: item.details,
          size: item.size,
          description: item.description,
          recommendations: item.recommendations,
        });
        
        try {
          const savedPhoto = await ph.save();
          
        } catch (error) {
          console.log(error)
          
        }
      })
    

    })
  
  }
  catch {

      console.log("Unexpected Error");    
  }
}


module.exports = uploadAllPhotos;