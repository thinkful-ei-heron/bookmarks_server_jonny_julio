const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const BookService = require('./bookservice');
const knex = require('knex');
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});
bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookService.getAllBooks(knexInstance)
        .then(bookmarks => {
          res.json(bookmarks)
        })
        .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      const error = 'Title is required';
      logger.error(error);
      return res.status(400).send(error);
    }
    if (!url) {
      const error = 'URL is required';
      logger.error(error);
      return res.status(400).send(error);
    }
    if (!rating) {
      const error = 'Rating is required';
      logger.error(error);
      return res.status(400).send(error);
    }

    const bookmark = {
      title,
      url,
      description,
      rating
    };

    const knexInstance = req.app.get('db');
    BookService.insertBookmark(knexInstance, bookmark)
        .then(bookmarks => {
          res.json(bookmarks)
        })
        .catch(next);
  });
bookmarksRouter
    .route('/:id')
    .get((req, res, next) => {
      const { id } = req.params;
      BookService.getById(knexInstance, id)
          .then(bookmark => {
            res.json(bookmark)
          })
          .catch(next)
    })
    .delete((req, res, next) => {
      const { id } = req.params;
      const knexInstance = req.app.get('db');
      BookService.deleteBookmark(knexInstance, id)
          .then(bookmarks => {
            res.json(bookmarks);
            res.status(204).end();
          })
          .catch(next);
});
module.exports = bookmarksRouter;
