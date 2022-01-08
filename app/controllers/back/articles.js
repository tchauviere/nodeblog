class AdminArticlesController {

    // Listing articles
    list(req, res) {
        res.render('back/articles/list', {
          data: "This is just some data"
        });
    }

    // Edit one article
    edit(req, res) {
      let articleId = parseInt(req.params.id);
      res.render('back/articles/edit', {
        articleId: articleId
      });
  }

}

module.exports = new AdminArticlesController;
