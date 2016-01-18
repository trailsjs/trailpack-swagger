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
  normalizeFootprint(route) {
    const routes = []

    _.each(this.app.models, (model, name) => {
      const newRoute = _.cloneDeep(route)
      name = name.toLowerCase()
      newRoute.path = newRoute.path.replace('{model}', name).replace('{parentModel}', name).replace('{parentId}', name + 'Id')
      newRoute.tags = [_.capitalize(name)]
      routes.push(newRoute)
    })

    return routes
  }

  normalizeRoutes() {
    let routes = []

    this.app.routes.forEach(item => {
      if (_.isArray(item.method) && item.method.length > 1) {
        item.method.forEach(methodName => {
          const newRoute = _.cloneDeep(item)
          newRoute.method = methodName
          if (item.path.indexOf('{model}') != -1 || item.path.indexOf('{parentModel}') != -1) {
            routes = routes.concat(this.normalizeFootprint(newRoute))
          }
          else {
            routes.push(newRoute)
          }
        })
      }
      else {
        if (item.path.indexOf('{model}') != -1 || item.path.indexOf('{parentModel}') != -1) {
          routes = routes.concat(this.normalizeFootprint(_.cloneDeep(item)))
        }
        else {
          routes.push(_.cloneDeep(item))
        }

      }
    })

    return routes
  }

  getPaths() {
    let routes = this.normalizeRoutes()

    routes = _.map(routes, route => {
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
      .reject({path: '/swagger/doc'})
      .reject((o) => {
        return o.path.indexOf('{model}') != -1
      })
      .reject((o) => {
        return o.path.indexOf('{parentModel}') != -1
      })
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

    this.log.info(pathGroups)
    return _.mapValues(pathGroups, pathGroup => {
      return this.getPathItem(pathGroup)
    })
  }

  getPathItem(pathGroup) {
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
  getOperation(methodGroup, method) {
    methodGroup.tags = methodGroup.tags || []
    const parameters = []
    let responses = {}
    if (methodGroup.tags.length > 0) {
      responses = {
        400: {
          description: 'Invalid parameters'
        }
      }
      if (method == 'post' || method == 'put') {
        parameters.push({
          in: 'body',
          name: 'body',
          description: 'Created ' + methodGroup.tags[0] + ' object',
          required: true,
          schema: {
            $ref: '#/definitions/' + methodGroup.tags[0]
          }
        })
      }
      else {
        responses['404'] = {
          description: methodGroup.tags[0] + ' not found'
        }
      }
    }
    if (_.isArray(method)) {
      method = method[0]
    }
    return {
      summary: methodMap[method],
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: parameters,
      responses: responses,
      tags: methodGroup.tags
    }
  }

  getInfo() {
    const config = this.app.config.swagger
    return {
      version: config.pkg.version || '1.0.0',
      title: config.pkg.name || 'No name provided'
    }
  }

  getTags() {
    const tags = []
    _.each(this.app.api.models, (model, name) => {
      tags.push({
        name: _.capitalize(name.toLowerCase())
      })
    })
    return tags
  }

  getDefinitions() {
    const definitions = {}
    _.each(this.app.api.models, (model, name) => {
      definitions[_.capitalize(name.toLowerCase())] = {
        type: 'object'
        //properties: model.schema()//FIXME: need to filter and format schema
      }
    })
    return definitions
  }

  /**
   * Get base Swagger json configuration document
   * @return {Object}
   */
  getDoc() {
    const host = this.app.config.web.host
    const port = this.app.config.web.port
    return {
      swagger: '2.0',
      info: this.getInfo(),
      host: host ? host + ':' + port : 'localhost:' + port,
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
