var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

// GET route for home page
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', {title: "Books", books: books});
}));

// GET route for new book page
router.get('/books/new', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('new-book', {title: "New Book"});
}));

// GET route for update books page
router.get(`/books/:id`, asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  res.render('update-book', {title: "Update Book", id: req.params.id, book});
}));


module.exports = router;
