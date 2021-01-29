const { use, need, peek, skip } = require('./lex')
const { unary, binary, flip } = require('./operator')


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


function punc() {
  return need(/^[\(\)\[\]\,]|^\s*(\->)/)
}


function operator() {
  return need(/^((and|or|not)(\W|$)|==|!=|<<|>>|<<=|>>=|<=|>=|<|>|\+=|\-=|\*\*=|\*=|\/=|&=|\|=|\^=|=|\+|\-|\*\*|\*|\/|&|\||\^|~|\.|\[|\()/)
}


function keyword() {
  return need(/^(if|elif|else|while|for|in|def|return|break|continue|end)(?:\W|$)/)
}


function ident() {
  return need(/^(?:(?!(if|elif|else|while|for|in|def|return|break|continue|end|and|or|not)(\W|$)))([a-zA-Z_][\w_]*)/)
}


function space() {
  return need(/^\s+/)
}


function end() {
  return need(/^$/)
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
  need(/^def/)
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
