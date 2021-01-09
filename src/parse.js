let lex = require('./lex')
lex(global)


function name() {
  return pad(ident)
}


function list() {
  return some('[', expr, ',', ']')
}


function params() {
  return some('(', name, ',', ')')
}


function anon() {
  return {
    params: params(),
    body: skip(punc, '->') ? expr() : code()
  }
}


function func() {
  keyword('def')
  space()

  return {
    name: name(),
    params: params(),
    body: code()
  }
}


function call(func) {
  return {
    type: 'call',
    args: some('(', expr, ',', ')')
  }
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
