let code


function use(s) {
  code = s
}


function here() {
  return code
}


function itch(token) {
  let m 
  
  if (m = code.match(token))
    return move(m)
  
  fail()
}


function move(m) {
  let v = m[m.length - 1]
  use(code.slice(v.length))
  
  return v
}


// choice

function peek(...a) {
  let s = here()
  let node = keep(...a)
  use(s)

  return node
}


function skip(p, ...a) {
  let s = here()
  
  try { 
    return p(...a) 
  } catch { 
    use(s)
  }
}


module.exports = {
  use,
  itch,
  skip,
  peek,
}
