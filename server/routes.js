/**
 * Main application routes
 */

'use strict'

var errors = require('./helpers/errors')

module.exports = function (app) {

    // All undefined asset or api routes should return a 404

    app.route('/:url(api|components|app|bower_components|files)/*').get(errors[404])

    app.route('/*').get(function (req, res) {
        res.sendFile('index.html', {
            root: app.get('appPath')
        })
    })

  // app.get('/',function (req, res) {
  //     res.render('index', { title: 'Index Page'});
  // })

}