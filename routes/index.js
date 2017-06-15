const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const mongoose = require('mongoose');
const Tire = mongoose.model('Tire');

// new Tire({ name: 'bridgestone', quantity: '0' }).save();
// new Tire({ name: 'michelin', quantity: '0' }).save();
// new Tire({ name: 'firestone', quantity: '0' }).save();

router.get('/', notificationController.loadHomepage);

router.post('/', notificationController.submitEmail);

router.get('/admin', notificationController.loadAdmin);

router.post('/admin', notificationController.updateQuantity, notificationController.sendNotification);

module.exports = router;
