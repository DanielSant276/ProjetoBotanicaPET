while True:
  try:
    number = int(input("insira um número: "))

    print(number / 2)
    break
  except:
    print("você não inseriu um número")
    print("")