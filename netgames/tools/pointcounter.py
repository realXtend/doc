import read_asdoc_xml as r
unionpongnet = ["GameManager", "GameStates", "KeyboardController", "PongClient", "PongObject", "RoomAttributes", "RoomMessages", "UnionPong"] #the classes included for the net-code-only run
from count_calls import count_calls
#unionpongnet = None
#import read_jsdoc_json as r

def getN(c, C):
	term = len(c.fields) + len(c.relations) + len(c.methods)
	result = 1
	if c.supers:
		return 0.5
	return 1

	#Fix this if time (XXX: requires getting the values for Flash Sprite and the base Client in Reaktor) 
	for x in c.supers:
		result *= term / (term + len(C[x].fields) + len(C[x].relations) + len(C[x].methods))
	return result

C = r.get_classes(unionpongnet)

W_c = 4
W_R_c = 2
W_O_c = 3
W_O_M = 2
W_S_O = 2
W_T_O = 2


N_C = sum([getN(c, C) for c in C.values()]) / len(C)


CP = (W_c * len(C) + sum([len(c.fields) for c in C.values()]) + W_R_c * sum([len(c.relations) for x in C.values()]) + W_O_c * sum([len(c.methods) for x in C.values()])) * N_C
print CP

#N_O_M = sum([o.N for o in O_M]) / len(O_M)

#call counts from closure trees

all_calls = list()
for c in C.itervalues():
        print "Function calls in class:", c.name
 	all_calls.append(count_calls(c.name))



unique_calls = set()

print '-----'
for calls in all_calls:
	for call in calls:
		unique_calls.add(call[1])

print unique_calls

MP = (W_O_M * len(all_calls)  )	

# MP = (W_O_M * len(O_M) + sum([len(o.P) for o in O_M)]) + W_S_O * sum([len(o.S) for i in O_M]) + W_T_O * sum([len(o.T) for o in O_M])) * N_O_M

# N_c = prod([(len(c.A) + len(c.R) + len(c.O)) / (len(c.A) + len(c.R) + len(c.O) + ) for c in C])
