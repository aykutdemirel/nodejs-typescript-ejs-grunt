/**
 * Express configuration
 */

'use strict'

var express = require('express')
var compress = require('compression')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var errorHandler = require('errorhandler')
var useragent = require('express-useragent')
var path = require('path')
var config = require('./environment')

module.exports = function (app) {

  var env = app.get('env')

  app.engine('.html', require('ejs').__express);
  app.set('views', config.root + '/views')
  app.set('view engine', 'ejs')

  app.use(compress())
  app.use(useragent.express())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(cookieParser(config.secrets.cookie))

  app.use(cookieSession({
    name: 'session',
    secret: config.secrets.session,
    cookie: {
      maxAge: 2678400000 // 31 days
    }
  }))


  if (env === 'production') {
    app.use(express.static(path.join(config.root, 'public')))
    app.set('appPath', config.root + '/public')
  }

  if (env === 'development' || env === 'test') {
    app.use(require('connect-livereload')())    
    app.use(express.static(config.root))
    app.use(errorHandler()) // error handler has to be last
  }

  // TODO: move to a separate npm package
  app.use(function (req, res, next) {
    if (!isSupportedBrowser(req.useragent)) {
      res.render('unsupported', {
        layout: false,
        currentYear: new Date().getFullYear()
      })
    } else {
      next()
    }
  })

  function isSupportedBrowser (userAgent) {
    var version = parseInt(userAgent.version, 10)
    if (userAgent.isDesktop) {
      if ((userAgent.isChrome && version < 11) ||
        (userAgent.isFirefox && version < 22) ||
        (userAgent.isIE && version < 10)) {
        return false
      }
    }

    return true
  }
}