const express = require('express');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const sql = require('mssql');
const config = require('../config/config');
const router = express.Router();
const {searchReviews, addReview, editReview, deleteReview} =require("../controllers/review")

const {requireAuth} = require('../middlewares/authMiddleware')





router.get('/search/:recipeid', async (req, res) => {
    if(!isJson) {
    return badRequest(res, "Content was not Json");
    }
    return searchReviews(req, res);
  });

router.post('/add', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return addReview(req, res);
  
}); 

router.post('/edit', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return editReview(req, res);
  
});

router.delete('/delete/:reviewid', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return deleteReview(req, res);
   
});







module.exports = router;