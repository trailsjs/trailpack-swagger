'use strict'
const assert = require('assert')

describe('SwaggerController', () => {
  it('should exist', () => {
    assert(global.app.api.controllers.SwaggerController)
    assert(global.app.controllers.SwaggerController)
  })
})

