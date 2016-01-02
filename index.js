'use strict'

const _ = require('lodash')
const Trailpack = require('trailpack')
const lib = require('./lib')


/**
 * trailpack-swagger
 *
 * Creates a Swagger configuration based on defined Routes
 *
 * @see https://github.com/trailsjs/trailpack-router
 * @see http://swagger.io/
 */
module.exports = class Swagger extends Trailpack {

  validate () {
    return Promise.resolve()
  }

  configure () {
    console.log(this.app.api.models)
    return Promise.resolve()
  }

  /**
   * Merge route configuration and store in app.routes. Trailpacks that wish to
   * extend/add new routes should do so in the configure() lifecycle method.
   *
   * 1. ETL controller handlers into the standard route format.
   *    api.controllers.handlers  --> (map)
   *                              --> [ { controllerId, controllerName, handlerName } ]
   *                              --> (map)
   *                              --> [ { id, method, path, handler } ]
   *               config.routes  --> (group by path + handler)
   *                              --> { routeId: [ { id, method, path, handler } ] }
   *               config.routes  --> (merge each route group)
   *                              --> [ { id, method, path, handler } ]
   *                              --> app.routes
   *
   * 2. Create CRUD Route definition which maps to api.controllers.FootprintController
   *
   *    Operation | Method | Path         | ORM Action
   *    ----------+--------+--------------+------------
   *    Create    | POST   | /model       | .create
   *    Read      | GET    | /model/{id?} | .find
   *    Update    | PUT    | /model/{id?} | .update
   *    Delete    | DELETE | /model/{id?} | .destroy
   *
   * 3. Attach Policies as prerequisites.
   *    @see http://hapijs.com/api#route-prerequisites
   */
  initialize () {

  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}
