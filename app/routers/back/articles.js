// front.js - Handle all Front's MVC routes

const express = require('express');
const path = require('path');
const router = express.Router();
const adminArticlesController = require(path.join(global._settings.paths.controllersDir, 'back', 'articles.js'));

// Home page route.
router.get('/', adminArticlesController.list);
router.get('/edit/:id', adminArticlesController.edit);

module.exports = {
    path: '/admin/articles',
    router: router
};
