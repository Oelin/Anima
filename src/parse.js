let lex = require('./lex')
lex(global)


function peek(...a) {
  let s = here()
  let node = skip(...a)
  use(s)

  return node
}


function skip(parser, ...a) {
  let s = here()

  try {
    return parser(...a)
  } catch {
    use(s)
  }
}
