'use strict'

const _ = require('lodash');

const methodMap = {
  post: 'Create Object(s)',
  get: 'Read Object(s)',
  put: 'Update Object(s)',
  patch: 'Update Object(s)',
  delete: 'Destroy Object(s)',
  options: 'Get Resource Options',
  head: 'Get Resource headers'
}

const SwaggerService = module.exports = {

  getPaths () {
    let routes = _.map(this.routes, route => {
      if (_.isString(route.method))
        route.method = route.method.toLowerCase()
      if (_.isArray(route.method))
        route.method = _.map(route.method, method => method.toLowerCase())

      return route;
    })

    let pathGroups = _.chain(routes)
      .values()
      .flatten()
      .unique(route => {
        return route.path + route.method //+ JSON.stringify(route.keys)
      })
      .reject({ path: '/*' })
      .reject({ path: '/__getcookie' })
      .reject({ path: '/csrfToken' })
      .reject({ path: '/csrftoken' })
      .groupBy('path')
      .value()

    pathGroups = _.reduce(pathGroups, function(result, routes, path) {
      path = path.replace(/:(\w+)\??/g, '{$1}')
      if (result[path])
        result[path] = _.union(result[path], routes)
      else
        result[path] = routes
      return result
    }, [])

    return _.mapValues(pathGroups, pathGroup => {
      return SwaggerService.getPathItem(pathGroup)
    })
  },

  getPathItem (pathGroup) {
    let methodGroups = _.chain(pathGroup)
      .indexBy('method')
      .pick([
        'get', 'post', 'put', 'head', 'options', 'patch', 'delete'
      ])
      .value()

    return _.mapValues(methodGroups, (methodGroup, method) => {
      return SwaggerService.getOperation(methodGroup, method)
    })
  },

  /**
   * http://swagger.io/specification/#operationObject
   */
  getOperation (methodGroup, method) {
    return {
      summary: methodMap[method],
      consumes: [ 'application/json' ],
      produces: [ 'application/json' ],
      parameters: [],
      responses: [],
      tags: []
    }
  },

  getInfo () {},

  getTags () {},

  getDefinitions () {},


  /**
   * Get base Swagger json configuration document
   * @return {Object}
   */
  getDoc () {
    console.log(SwaggerService.getPaths())
    const config = this.config.swagger
    return {
      swagger: '2.0',
      info: {
        version: config.pkg.version || '1.0.0',
        title: config.pkg.name || 'No name provided'
      },
      host: 'localhost:3000',
      basePath: '/',
      schemes: ['http'],
      consumes: [
        'application/json'
      ],
      produces: [
        'application/json'
      ],

      paths: SwaggerService.getPaths()
    }
  }
}
