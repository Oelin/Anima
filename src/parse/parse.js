imports('./lex')
imports('./operator')


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
    body: skip(punc, arrow) ? expr() : code()
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
