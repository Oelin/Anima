function use(s) {
  code = s
}


// consume token

function need(token) {
  if (m = code.match(token))
    return move(m)

  fail()
}


// peek next token  

function peek(...a) {
  let s = code
  let node = skip(...a)
  use(s)

  return node
}


function skip(p, ...a) {
  let s = code

  try {
    return p(...a)
  } catch {
    use(s)
  }
}


// several

function some(a, p, b, c) {
  let node = []
  a()
  
  while (!skip(c)) skip(b, node.push(p()))
  return node
}


// move cursor

function move(m) {
  let v = m.filter(e => e).pop()
  code = code.slice(v.length)

  return v
}


function fail() {
  throw 'syntax error'
}


module.exports = {
  use,
  need,
  peek,
  skip,
  fail
}
