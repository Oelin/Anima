let { use, need, peek, skip } = require('./lex')
let { infix, prefix, flip } = require('./operator')


// tokens

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


function arrow() {
  return need(/^->/)
}


function operator() {
  return need(/^((and|or|not)(?:\W|$)|==|!=|<<|>>|<<=|>>=|<=|>=|<|>|\+=|\-=|\*\*=|\*=|\/=|&=|\|=|\^=|=|\+|\-|\*\*|\*|\/|&|\||\^|~|\.|\[|\()/)
}


function ident() {
  return need(/^(?:(?!(if|elif|else|while|for|in|def|return|break|continue|end|and|or|not)(\W|$)))([a-zA-Z_][\w_]*)/)
}


function space() {
  return need(/^\s+/)
}


function nothing() {
  return !code.length
}


function end() {
  return need(/^end/)
}


function params() {
  return some(obr, name, comma, cbr)
}


// literals

function name() {
  return {
    type: 'name',
    value: pad(ident)
  }
}


function string() {
  return {
    type: 'string',
    value: need(/^'[^']*'/)
  }
}


function number() {
  return {
    type: 'number',
    value: need(/^(0x[0-9a-fA-F]+|0b[01]+|\d+\.\d+|\d+)(?:\W|$)/)
  }
}


function list() {
  return {
    type: 'list',
    value: some(osq, expr, comma, csq)
  }
}


function anon() {
  return {
    type: 'anon',
    params: params(),
    body: skip(pad, arrow) ? expr() : block()
  }
}


function func() {
  need(/^def/)
  space()

  return {
    type: 'func',
    name: name(),
    params: params(),
    body: block()
  }
}


function literal() {
  return skip(name)
    || skip(number) 
    || skip(string) 
    || skip(list) 
    || skip(func)
    || anon()
}


// expressions

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
  let right = expr(bind + !flip[op])

  return {
    type: 'binary',
    op,
    left,
    right
  }
}


// blocks

function command() {
  return {
    type: skip(/^break/) || need(/^continue/)
  }
}


function _while() {
  return {
    type: need(/^while/),
    test: pad(expr),
    body: block()
  }
}


function each() {
  return {
    type: need(/^for/),
    left: pad(params),
    right: expr(need(/^in/)),
    body: block()
  }
}


function _if() {
  return {
    type: need(/^if/),
    test: expr(),
    body: block(),
  }
}


function action() {
  return skip(expr) || skip(_while) || skip(each) || skip(_if) || command()
}


function block(d = end) {
  let node = []

  while (!skip(d))
    node.push(pad(action))

  return node
}


function parse(code) {
  return block(nothing, use(code))
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


function some(start, p, sep, end) {
  let node = []
  start()

  while (!skip(end))
    skip(sep, node.push(p()))

  return node
}


module.exports = parse
