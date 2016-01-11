'use strict'

module.exports = {

  getDoc : function() {
    return {
      swagger: '2.0',
      info: {
        version: '1.0.0',
        title: 'Test app'
      },
      host: 'localhost:3000',
      basePath: '/',
      schemes: ['http'],
      consumes: [
        'application/json'
      ],
      produces: [
        'application/json'
      ]
    };
  }
}
