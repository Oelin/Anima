let code
let use = s => code = s
let here = () => code


function move(m) {
  let v = m[m.length - 1]
  code = code.slice(v.length)
  
  return v
}


// consume a token

function need(token) {
  let m
  
  if (m = code.match(token))
    return move(m)
  
  fail()
}


// prediction

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
  need,
  peek,
  skip,
}
