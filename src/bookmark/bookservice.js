const BookService = {
    getAllBooks(knex) {
        return knex.select('*').from('bookmarks_table')
    },
    insertBookmark(knex, newBook) {
        return knex
                .insert(newBook)
                .into('bookmarks_table')
            .returning('*')
            .then(rows => rows[0])
},
    getById(knex, id) {
         return knex.from('bookmarks_table').select('*').where('id', id).first()
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks_table')
             .where({ id })
         .delete()
     },
    updateBookmarks(knex, id, newBookField) {
      return knex('bookmarks_table')
              .where({ id })
         .update(newBookField)
     },
};

module.exports = BookService;