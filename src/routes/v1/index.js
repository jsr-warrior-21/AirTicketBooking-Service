const express = require("express");
const router = express.Router();
const {BookingController} =require('../../controllers/inedx');
router.post('/bookings',BookingController.create);
module.exports =  router;
