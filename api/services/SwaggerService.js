'use strict'

const _ = require('lodash')
const Service = require('trails-service')

const methodMap = {
  post: 'Create Object(s)',
  get: 'Read Object(s)',
  put: 'Update Object(s)',
  patch: 'Update Object(s)',
  delete: 'Destroy Object(s)',
  options: 'Get Resource Options',
  head: 'Get Resource headers'
}

module.exports = class SwaggerService extends Service {

  getPaths () {
    const routes = _.map(this.app.routes, route => {
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
      .reject({path: '/*'})
      .reject({path: '/swagger/doc'})
      .reject({path: '/swagger/ui'})
      .reject({path: '/__getcookie'})
      .reject({path: '/csrfToken'})
      .reject({path: '/csrftoken'})
      .groupBy('path')
      .value()

    pathGroups = _.reduce(pathGroups, function (result, routes, path) {
      path = path.replace(/:(\w+)\??/g, '{$1}')
      if (result[path])
        result[path] = _.union(result[path], routes)
      else
        result[path] = routes
      return result
    }, [])

    return _.mapValues(pathGroups, pathGroup => {
      return this.getPathItem(pathGroup)
    })
  }

  getPathItem (pathGroup) {
    const methodGroups = _.chain(pathGroup)
      .indexBy('method')
      .pick([
        'get', 'post', 'put', 'head', 'options', 'patch', 'delete'
      ])
      .value()

    return _.mapValues(methodGroups, (methodGroup, method) => {
      return this.getOperation(methodGroup, method)
    })
  }

  /**
   * http://swagger.io/specification/#operationObject
   */
  getOperation (methodGroup, method) {
    this.log.info(methodGroup, method)
    return {
      summary: methodMap[method],
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [],
      responses: [],
      tags: []
    }
  }

  getInfo () {
    const config = this.app.config.swagger
    return  {
      version: config.pkg.version || '1.0.0',
      title: config.pkg.name || 'No name provided'
    }
  }

  getTags () {
    const tags = []
    _.each(this.app.api.models, (model, name) =>{
      tags.push({
        name: name
      })
    })
    return tags
  }

  getDefinitions () {
    const definitions = {}
    _.each(this.app.api.models, (model, name) =>{
      definitions[name] = {
        type: 'object',
        properties: model.schema()
      }
    })
    return definitions
  }

  /**
   * Get base Swagger json configuration document
   * @return {Object}
   */
  getDoc () {

    return {
      swagger: '2.0',
      info: this.getInfo(),
      host: 'localhost:3000',//FIXME: get this from config/web
      basePath: '/',//FIXME: get this from config/footprint
      schemes: ['http'],//FIXME: get this from config/swagger
      consumes: [
        'application/json'
      ],
      produces: [
        'application/json'
      ],
      tags: this.getTags(),
      definitions: this.getDefinitions(),
      paths: this.getPaths()
    }
  }
}
