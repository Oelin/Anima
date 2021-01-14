let code = ''


function use(s) {
  code = s
}


function here() {
  return code
}


function move(m) {
  let v = m[[...m].length - 1]
  code = code.slice(v.length)
  
  return v
}


function itch(token) {
  let m 
  
  if (m = code.match(token))
    return move(m)
  
  fail()
}


// token types

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
  return itch(/^(?:(?!(if|elif|else|while|for|in|def|return|break|continue|end|and|or|not)(\W|$)))[a-zA-Z_][\w_]*/)
}


function space() {
  return itch(/^\s+/)
}


function end() {
  return itch(/^$/)
}


function fail() {
  throw 'syntax error'
}


function keep(p, ...a) {
  let s = here()
  
  try { 
    return p(...a) 
  } catch { 
    use(s) 
  }
}


function peek(...a) {
  let s = here()
  let node = keep(...a)
  use(s)
  
  return node
}


module.exports = {
  use,
  itch,
  keep,
  peek,
  fail,
  string,
  number,
  punc,
  operator,
  keyword,
  ident,
  space,
  end,
}
