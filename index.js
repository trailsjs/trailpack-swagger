'use strict'

const _ = require('lodash')
const Trailpack = require('trailpack')

/**
 * trailpack-swagger
 *
 * Creates a Swagger configuration based on defined Routes
 *
 * @see https://github.com/trailsjs/trailpack-router
 * @see http://swagger.io/
 */
module.exports = class Swagger extends Trailpack {

  initialize () {
    
    return Promise.resolve()
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}
