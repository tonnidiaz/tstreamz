
P = .5 / 100
count = 0
gain = 0
def profit(amt, target):
    global gain
    gain += amt * P
    new_amt = amt + gain
    global count
    if( gain < target ):
        print(gain)
        count += 1
        profit(new_amt, target)

def main():
    target = float(input("Enter target amount: \n"))
    amt = float(input("Enter init amount: \n"))
    profit(amt, target)
    print(f"You gon need to trade {count} times")
        
    
    
main()