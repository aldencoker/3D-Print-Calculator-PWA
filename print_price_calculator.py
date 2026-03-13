des_time_input = input("Design Time: ")
mat = float(input("Mass: "))
prnt_time = float(input("Print Time: "))
if des_time_input == "":
    des_time = 0
else:
    des_time = float(des_time_input)
cost = (des_time * 30) + (mat * 0.05) + prnt_time
rounded_cost = int((cost + 2.5) // 5 * 5)
if rounded_cost == 0:
    rounded_cost = 5
print("$" + str(rounded_cost))