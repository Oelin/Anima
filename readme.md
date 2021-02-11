# anima

A little scripting language that's easy to to read, write and learn. This is my first go at writing a language. The frontend is nearly finished.

```ruby
def factorial(n)
  if n < 2
    return 1
  end
  
  return n * factorial(n - 1) 
end
```

### features (current and future)

* weak typing
* named and anonymous functions
* lambda functions
* Pythonic ternary, i.e. `<expr> if <expr> else <expr>`
* Pythonic for loops, i.e. `for <variable> in <iterator>`
* `end` instead of curly braces, similar to Ruby
* list comprehensions
* JavaScript object literals 
