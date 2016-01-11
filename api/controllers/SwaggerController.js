'use strict'

module.exports = {

  doc (request, reply) {
    return reply(this.api.services.SwaggerService.getDoc())
      .header('Access-Control-Allow-Origin', '*')
  },

  ui (request, reply) {
    console.log(request.info)
    reply(this.config.swagger.ui.url + '?url=' + request.info.host + '/swagger/doc')
  }
}
