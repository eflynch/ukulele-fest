"""
Cocktail Recipes
"""


import random

a = int(input("How many \"an's\" are in the name of the"
              " cocktail you'd like? (enter any integer)"))
b = int(input("How many \"a's\" are in the name of the cocktail "
          "you'd like? (enter any integer)"))
c = int(input("How many \"um's\" are in the name of the cocktail "
              "you'd like? (enter any integer)"))

a = (a % 20)
b = (b % 20)
c = (c % 20)

a = ['an'] * a
b = ['a'] * b
c = ['um'] * c

cocktail_name = a + b + c
random.shuffle(cocktail_name)
cocktail_name = ' '.join(cocktail_name) + " the drink"

print()
print(f'Ok, copy that. It sounds like you want {cocktail_name}.'
      " Let's see what you have for ingredients and I bet we "
      f'can figure out how to cook up {cocktail_name}.')
print()

ing_1 = input('What is one ingredient that you have?')
ing_2 = input('What is another ingredient that you have?')
ing_3 = input('How bout another?')
ing_4 = input('What else?')
ing_5 = input('What else?')
ing_6 = input('What else?')

ingredient_quantity = random.randint(0,3)
available_ingredients = [ing_1, ing_2, ing_3, ing_4, ing_5, ing_6]
random.shuffle(available_ingredients)
ingredients = available_ingredients[ingredient_quantity:]

print()
print('Ok sweet. These ingredients actually set you up perfectly '
      f'for making {cocktail_name}.')
print()
print("Based on the ingredients that you have available, I'd recommend using "
      f"the following to make {cocktail_name}:")
print()
print(' '.join(ingredients))
print()
print("Good luck.")