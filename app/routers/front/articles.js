// front.js - Handle all Front's MVC routes

const express = require('express');
const path = require('path');
const router = express.Router();
const articleController = require(path.join(global._settings.paths.controllersDir, 'front', 'articles.js'));

// Home page route.
router.get('/', articleController.list);
router.get('/article/:id', articleController.view);

module.exports = {
    path: '/',
    router: router
};
