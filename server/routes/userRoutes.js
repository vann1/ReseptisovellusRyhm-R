const express = require('express');
const requestUtils = require('../utils/requestUtils')
const router = express.Router();
const user = require('../controllers/user')
const responseUtils = require('../utils/responseUtils')

router.post('/create', async (req, res) => {
    if(!requestUtils.isJson(req)){
        return responseUtils.badRequest(res, "Content was not Json");
    }
    return user.createUser(req, res);
});
router.post('/login', async (req, res) => {
      if(!requestUtils.isJson(req)){
        return responseUtils.badRequest(res, "Content was not Json");
      }
      return user.loginUser(req, res);
});

module.exports = router;