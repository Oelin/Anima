imports('./lex')
imports('./operator')


function list() {
  return some(expr, /^[/, ',', /^]/)
}


function 


// helpers

function imports(path) {
  Object.assign(global, require(path))
}

function pad(parser) {
  skip(space)
  let node = parser()
  skip(space)

  return node
}
// todo...
