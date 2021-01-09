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
    type: skip(keyword, 'return') || skip(keyword, 'break') || keyword('continue'),
    right: skip(expr)
  }
}


function brace() {
  let left = expr(punc('('))
  punc(')')

  return left
}


function unary() {
  let op = operator()
  let right = expr(prefix[op] || fail())

  return {
    type: 'unary',
    op,
    right
  }
}


function atom() {
  let type

  let value = (type = 'name', skip(ident))
    || (type = 'number', skip(number))
    || (type = 'string', skip(string))
    || (type = 'list', skip(list))
    || (type = 'func', skip(func))
    || (type = 'anon', anon())

  return { type, value }
}


function primary() {
  return skip(atom) || skip(brace) || unary()
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


// helpers

function pad(parser) {
  skip(space)
  let node = parser()
  skip(space)

  return node
}


module.exports = function(text) {
  return code(use(text))
}
