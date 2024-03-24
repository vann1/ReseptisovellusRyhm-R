const express = require('express');
const router = express.Router();
const {requireAuth} = require('../middlewares/authMiddleware');
const {isJson} = require('../utils/requestUtils')
const {sendEmail} = require('../controllers/email');

// router.use(requireAuth);

router.post('/send', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return sendEmail(req,res);
  });

module.exports = router;