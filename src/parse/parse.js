let { use, need, peek, skip, fail } = require('./lex')
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


// basic expressions

function urhs(op) {
  return expr(prefix[op] || fail())
}


function brhs(bind, op) {
  return expr(bind + !flip[op])
}


function after(bind, left) {
  return skip(member, left) || skip(call, left) || binary(bind, left)
}


function primary() {
  return skip(literal) || skip(group) || unary()
}


// statements

function order() {
  return {
    type: skip(/^break/) || need(/^continue/)
  }
}


function $return() {
  return {
    type: need(/^return/),
    right: expr()
  }
}


function $while() {
  return {
    type: need(/^while/),
    test: pad(expr)
  }
}


function $if() {
  return {
    type: need(/^if/),
    test: pad(expr)
  }
}


function chunk() {
  return {
    ...skip($while) || $if(),
    body: block()
  }
}


function action() {
  return skip(expr) || skip(chunk) || skip($return) || order()
}


// more expressions

/*
function group() {
  let right = expr(obr())
  cbr()
  return right
}


function unary() {
  let op = operator()
  
  return {
    type: 'unary',
    right: urhs(op),
    op
  }
}


function call(left) {
  return {
    type: 'call',
    given: some(obr, expr, comma, cbr),
    left
  }
}


function member(left) {
  let right = expr(osq())
  csq()

  return {
    type: 'member',
    right,
    left
  }
}


function expr(min = 0) {
  let left = pad(primary)

  while (true) {
    let op = peek(operator)
    let bind = infix[op]
    
    if (!op || bind < min) return left
    left = after(left)
  }
}


// function binary(bind, left) {
//   let op = operator()
//   let right = brhs(bind, op)

//   return {
//     type: 'binary'
//     left,
//     right,
//     op
//   }
// }
*/


// blocks

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
