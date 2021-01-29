const { peek, skip, use, here } = require('./lex')
const { unary, binary, flip } = require('./operator')


function osq() {
  return itch(/^\[/)
}


function csq() {
  return itch(/^\]/)
}


function obr() {
  return itch(/^\(/)
}


function cbr() {
  return itch(/^\)/)
}


function comma() {
  return itch(/^,/)
}


function string() {
  return itch(/^'[^']*'/)
}


function number() {
  return itch(/^(0x[0-9a-fA-F]+|0b[01]+|\d+\.\d+|\d+)/)
}


function punc() {
  return itch(/^[\(\)\[\]\,]|^\s*(\->)/)
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
    body: skip(/^->/) ? expr() : code()
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


module.exports = parse
