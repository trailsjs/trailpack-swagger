'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')

const Api = require('./api')

const App = {
  pkg: {
    name: 'swagger-trailpack-test',
    version: '1.0.0'
  },
  api: Api,
  config: {
    footprints: {
      controllers: false,
      models: {

        actions: {
          create: true,
          createWithId: true,
          find: true,
          findOne: true,
          update: true,
          destroy: true,

          createAssociation: true,
          createAssociationWithId: true,
          findAssociation: true,
          findOneAssociation: true,
          updateAssociation: true,
          destroyAssociation: true
        }
      },
      prefix: ''
    },
    main: {
      packs: [
        require('trailpack-router'),
        require('trailpack-hapi'),
        require('../') // trailpack-swagger
      ]
    },
    routes: [],
    policies: {},
    web: {port: 3000}
  }
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
