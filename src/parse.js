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
    args: some('(', expr, ',', ')'),
    func
  }
}


function action() {
  return {
    type: skip(keyword, 'break') || keyword('continue')
  }
}


function ret() {
  return {
    type: keyword('return'),
    right: expr()
  }
}


function member(object) {
  let prop = expr(punc('['))
  punc(']')

  return {
    type: 'member',
    prop,
    object
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
