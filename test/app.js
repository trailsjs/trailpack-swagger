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
    database: {
      stores: {
        sqlitedev: {
          adapter: require('waterline-sqlite3')
        }
      },
      models: {
        defaultStore: 'sqlitedev',
        migrate: 'drop'
      }
    },
    footprints: {
      controllers: true,
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
    i18n: {
      lng: 'en',
      resources: {
        en: {}
      }
    },
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-core'),
        require('trailpack-waterline'),
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
