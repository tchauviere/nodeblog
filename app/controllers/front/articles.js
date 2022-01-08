class ArticlesController {

    // Listing articles
    list(req, res) {
        res.render('front/articles/list', {
          data: "This is just some data"
        });
    }

    // View one article
    view(req, res) {
      let articleId = parseInt(req.params.id);
      res.render('front/articles/view', {
        articleId: articleId
      });
  }

}

module.exports = new ArticlesController;
