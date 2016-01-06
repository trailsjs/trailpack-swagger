'use strict'

module.exports = {

  doc (request, reply) {
    reply(this.api.swagger.doc || {})
  },

  ui (request, reply) {
    console.log(request.info)
    reply.redirect('');
  }
}
