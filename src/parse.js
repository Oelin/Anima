let lex = require('./lex')
lex(global)


function name() {
  return pad(ident)
}


function list() {
  return some('[', expression, ',', ']')
}


function pad(parser) {
  skip(space)
  let node = parser()
  skip(space)

  return node
}


module.exports = function(text) {
  return code(use(text))
}
