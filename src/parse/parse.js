let { peek, skip, use, here } = require('./lex')
let { unary, binary, bind } = require('./operator')
let osq = () => itch(/^\[/)
let csq = () => itch(/^\]/)
let obr = () => itch(/^\(/)
let cbr = () => itch(/^\)/)
let comma = () => itch(/^,/)


function string() {
  return itch(/^'[^']*'/)
}


function number() {
  return itch(/^(0x[0-9a-fA-F]+|0b[01]+|\d+\.\d+|\d+)/)
}


function punc() {
  return itch(/^[\(\)\[\]\,]|^\s*(\->)/)
}


function arrow() {
  return itch(/^->/)
}


function operator() {
  return itch(/^((and|or|not)(\W|$)|==|!=|<<|>>|<<=|>>=|<=|>=|<|>|\+=|\-=|\*\*=|\*=|\/=|&=|\|=|\^=|=|\+|\-|\*\*|\*|\/|&|\||\^|~|\.|\[|\()/)
}


function keyword() {
  return itch(/^(if|elif|else|while|for|in|def|return|break|continue|end)(?:\W|$)/)
}


function ident() {
  return itch(/^(?:(?!(if|elif|else|while|for|in|def|return|break|continue|end|and|or|not)(\W|$)))([a-zA-Z_][\w_]*)/)
}


function space() {
  return itch(/^\s+/)
}


function end() {
  return itch(/^$/)
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


function anon() {
  return {
    params: params(),
    body: skip(arrow) ? expr() : code()
  }
}


function func() {
  itch(/^def/)
  space()
  
  return {
    name: name(),
    params: params(),
    body: code()
  }
}











































// helpers

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


function imports(path) {
  Object.assign(global, require(path))
}


module.exports = parse
