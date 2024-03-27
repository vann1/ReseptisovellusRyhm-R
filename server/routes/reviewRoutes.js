const express = require('express');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const sql = require('mssql');
const config = require('../config/config');
const router = express.Router();
const {searchReviews, addReview, editReview, deleteReview} =require("../controllers/review")



//Etsii arvostelut recipeid:een perusteella
router.get('/search/:recipeid', async (req, res) => {
    if(!isJson) {
    return badRequest(res, "Content was not Json");
    }
    return searchReviews(req, res);
  });

  //Etsii käyttäjän arvostelut jotka hän on merkinnyt suosikeiksensa
  router.get('/favorites/:userid', async (req, res) => {
    if(!isJson) {
    return badRequest(res, "Content was not Json");
    }
    return searchReviews(req, res);
  });

  //lisää arvostelu
router.post('/add', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return addReview(req, res);
  
}); 

//Muokkaa arvostelua
router.post('/edit', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return editReview(req, res);
  
});

//Poistaa arvostelun reviewid:een perusteella
router.delete('/delete/:reviewid', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return deleteReview(req, res);
   
});







module.exports = router;