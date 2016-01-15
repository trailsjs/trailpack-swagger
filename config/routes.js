'use strict'

module.exports = [

  {
    method: '*',
    path: '/swagger/doc',
    handler: 'SwaggerController.doc'
  },

  {
    method: '*',
    path: '/swagger/ui',
    handler: 'SwaggerController.ui'
  }

]
