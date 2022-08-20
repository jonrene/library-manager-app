// Applicaiton main routes. 

// preprocessor directives
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
  res.redirect('/books');
}));

// GET route for showing book list
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', {title: "Books", books: books});
}));

// GET route for creating new book page
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', {title: "New Book"});
}));

// POST route for creating new book and adding it to database
router.post('/books/new/', asyncHandler(async (req, res) => {
  try{
    await Book.create({title:req.body.title, author:req.body.author, genre:req.body.genre, year:req.body.year})
    res.redirect("/");
  }catch(error){
    res.render('new-book', { error, title:"New Book"});
  }
}));

// GET route for showing book detail page
router.get(`/books/:id`, asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', {title: "Update Book", id: req.params.id, book});
}));

// POST route for updating book in database
router.post(`/books/:id`, asyncHandler(async (req, res) => {
  try{
    let book = await Book.findByPk(req.params.id);
    let update = await book.update({title:req.body.title, author:req.body.author, genre:req.body.genre, year:req.body.year})
    res.redirect("/");
  }catch(error){
    let book = await Book.findByPk(req.params.id);
    res.render("update-book", {title: "Update Book", id: req.params.id, error:error, book});
  }
}));


// POST route for deleting a book to database
router.post(`/books/:id/delete`, asyncHandler(async (req, res) => {
  await Book.destroy({ where: { id: req.params.id} });
  res.redirect("/");
}));


module.exports = router;
