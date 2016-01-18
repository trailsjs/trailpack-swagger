const assert = require('assert')

describe('SwaggerService', () => {
  it('should exist', () => {
    assert(global.app.api.services.SwaggerService)
    assert(global.app.services.SwaggerService)
  })
})

