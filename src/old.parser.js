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


function primary() {
  return skip(atom) || skip(brace) || unary()
}


function action() {
  return {
    type: skip(keyword, 'return') || skip(keyword, 'break') || keyword('continue'),
    right: skip(expr)
  }
}


function _while() {
  return {
    type: keyword('while'),
    cond: expr(),
    body: code()
  }
}


function brace() {
  let left = expr(punc('('))
  punc(')')

  return left
}


function expr(min = 0) {
  let left = pad(primary)

  while (true) {
    let op = peek(operator)
    let prec = infix[op]

    if (!op || prec < min)
      return left

    left = skip(member, left) || skip(call, left) || binary(prec, left)
  }
}



/*
function member(object) {
  let prop = expr(punc('['))
  punc(']')

  return {
    type: 'member',
    prop,
    object
  }
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


function binary(prec, left) {
  let op = operator()
  let left = associate(op, prec)

  return {
    type: 'binary',
    op,
    left
  }
}



// helpers

function associate(op, prec) {
  return expr(prec + !(sticky.indexOf(op) + 1))
}*/


function pad(parser) {
  skip(space)
  let node = parser()
  skip(space)

  return node
}


module.exports = function(text) {
  return code(use(text))
}
