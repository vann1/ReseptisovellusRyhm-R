const express = require('express');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const sql = require('mssql');
const config = require('../config/config');
const router = express.Router();
const {searchReviews, addReview} =require("../controllers/review")

const {requireAuth} = require('../middlewares/authMiddleware')





router.post('/search', async (req, res) => {
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









module.exports = router;