'use strict'

const Controller = require('trails-controller')

module.exports = class SwaggerController extends Controller {

  /* express version
   doc (req, res) {
   //this.log.info(this.app.services.SwaggerService.getDoc())
   return res.json(this.app.services.SwaggerService.getDoc())
   }

   ui (req, res) {
   //this.log.info(req.info)
   res.redirect(this.config.swagger.ui.url + '?url=' + request.info.host + '/swagger/doc')
   }
   */
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
