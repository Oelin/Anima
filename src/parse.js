function name() {
  return pad(ident)
}


function list() {
  return some(name, /\^[/, '^,', /^\]/)
}


function parse() {
  return list()
}


// helpers

function pad(parser) {
  let node = parser(keep(space))
  keep(space)

  return node
}


function some(parser, a, b, z) {
  let node = []
  itch(a)

  while (! keep(itch, z)) {
    node.push(parser())
    keep(itch, b)
  }

  return node
}


module.exports = function(code) {
  return parse(use(code))
}
