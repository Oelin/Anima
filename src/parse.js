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
    type: skip(keyword, 'break') || keyword('continue')
  }
}


function _while() {
  return {
    type: keyword('while'),
    cond: expr(),
    body: code()
  }
}


function _for() {
  return {
    type: keyword('for'),
    vars: skip(name) || pad(params),
    list: expr(keyword('in')),
    body: code()
  }
}


function statement() {
  return skip(_while) || skip(_for) || skip(action) || expr()
}


function code() {
  let node = []

  while (peek(end) != '' && !skip(keyword, 'end')) {
    node.push(pad(statement))
  }

  return node
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


function sticks(op) {
  return !(sticky.indexOf(op) + 1)
}


function binary(prec, left) {
  let op = operator()
  let right = expr(prec + sticks(op))

  return {
    type: 'binary',
    op,
    left,
    right
  }
}


function pad(parser) {
  skip(space)
  let node = parser()
  skip(space)

  return node
}



//module.exports = {use, some, params, skip, peek, here}
module.exports = function(text) {
  return code(use(text))
}


// bugs:

// parser completeness
// status: FIXED
// info: ([1,2,3]) causes a syntax error
// info: lists inside of braces causes a syntax error
// info: was caused by anon() it atom()
// info: caused by params() in anon()
// info: caused by some() in params()
// info: caused by scoping error in skip()

// parser leniance
// status: CAUSE FOUND
// info: '()' is parsed as an anon because code() can be the empty string.
// proposal: we need a distinction between top-level code and blocks which
// end with the `end` keyword. Blocks cannot be the empty string.
