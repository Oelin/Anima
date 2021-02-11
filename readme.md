# anima

A little scripting language that's easy to to read, write and learn. This is my first go
at writing a language. The frontend is nearly finished.


```ruby

# Assignment

number = 43
fun = true
sad = false

# Conditions

name = "mas" if reverse else "sam"
adult = true if age >= 18

if adult
  print("#{name} is an adult")
end

# Functions

add = (x, y) -> x + y
five = add(3, 2)

def hello(name)
  print("hello my name is #{name}")
end

# Loops

while i < 10
  print(i)
end

# which is the same as...

for i in range(10)
  print(i)
end

# Lists

powers = [2, 4, 8, 16, 32]

print(powers[0])

# Objects 

math = {
  root: (x) -> x ** 0.5,
  square: (x) -> x ** 2,
}

print(math.root(16))
```
