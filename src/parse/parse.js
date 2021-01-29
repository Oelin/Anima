let { use, need, peek, skip } = require('./lex')
let { infix, prefix, flip } = require('./operator')


// terminals

function osq() {
  return need(/^\[/)
}


function csq() {
  return need(/^\]/)
}


function obr() {
  return need(/^\(/)
}


function cbr() {
  return need(/^\)/)
}


function comma() {
  return need(/^,/)
}


function string() {
  return need(/^'[^']*'/)
}


function number() {
  return need(/^(0x[0-9a-fA-F]+|0b[01]+|\d+\.\d+|\d+)/)
}


function operator() {
  return need(/^((and|or|not)(\W|$)|==|!=|<<|>>|<<=|>>=|<=|>=|<|>|\+=|\-=|\*\*=|\*=|\/=|&=|\|=|\^=|=|\+|\-|\*\*|\*|\/|&|\||\^|~|\.|\[|\()/)
}


function ident() {
  return need(/^(?:(?!(if|elif|else|while|for|in|def|return|break|continue|end|and|or|not)(\W|$)))([a-zA-Z_][\w_]*)/)
}


function space() {
  return need(/^\s+/)
}


function name() {
  return pad(ident)
}


function list() {
  return some(osq, expr, comma, csq)
}


function params() {
  return some(obr, name, comma, cbr)
}


// expressions

function anon() {
  return {
    params: params(),
    body: skip(/^->/) ? expr() : block()
  }
}


function func() {
  need(/^def/)
  space()

  return {
    name: name(),
    params: params(),
    body: code()
  }
}


function literal() {
  let type
  let value = (type='name', skip(ident))
    || (type='number', skip(number))
    || (type='string', skip(string))
    || (type='list', skip(list))
    || (type='func', skip(func))
    || (type='anon', anon())

  return { type, value }
}


function member(left) {
  let prop = expr(osq())
  csq()

  return {
    type: 'member',
    prop,
    left
  }
}


function call(left) {
  return {
    type: 'call',
    args: some(obr, expr, comma, cbr),
    left
  }
}


function group() {
  let right = expr(obr())
  cbr()

  return right
}


function primary() {
  return skip(literal) || skip(group) || unary()
}


function expr(min = 0) {
  let left = pad(primary)

  while (true) {
    let op = peek(operator)
    let bind = infix[op]

    if (!op || bind < min)
      return left

    left = skip(member, left) || skip(call, left) || binary(bind, left)
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


function binary(bind, left) {
  let op = operator()
  let right = expr(bind + flips[op])

  return {
    type: 'binary',
    op,
    left,
    right
  }
}


function block() {
  // todo
}















// helpers

function fail() {
  throw 'syntax error'
}


function pad(parser) {
  skip(space)
  let node = parser()
  skip(space)

  return node
}


function some(a, p, q, z) {
  let node = []
  a()

  while (!skip(z))
    skip(q, node.push(p()))

  return node
}


module.exports = {use, literal, member, molecule, group, call, func, anon, list, params, binary, unary, expr}
