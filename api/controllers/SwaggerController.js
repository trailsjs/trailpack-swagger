'use strict'

const Controller = require('trails/controller')

module.exports = class SwaggerController extends Controller {

  doc(request, reply) {
    this.log.info(this.app.services.SwaggerService.getDoc())
    return reply(this.app.services.SwaggerService.getDoc())
      .header('Access-Control-Allow-Origin', '*')
  }

  ui(request, reply) {
    this.log.info(request.info)
    reply(this.config.swagger.ui.url + '?url=' + request.info.host + '/swagger/doc')
  }
}
