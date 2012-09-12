#import read_asdoc_xml as r #UnionPong asdoc
import count_calls
import read_jsdoc_json as r #TundraPong jsdoc

#unionpongnet = ["GameManager", "GameStates", "KeyboardController", "PongClient", "PongObject", "RoomAttributes", "RoomMessages", "UnionPong"] #the classes included for the net-code-only run
#infilter = unionpongnet
infilter = None #no filtering, use all classes

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

C = r.get_classes(infilter)

W_c = 4
W_R_c = 2
W_O_c = 3
W_O_M = 2
W_S_O = 2
W_T_O = 2


N_C = sum([getN(c, C) for c in C.values()]) / len(C)


CP = (W_c * len(C) + sum([len(c.fields) for c in C.values()]) + W_R_c * sum([len(c.relations) for x in C.values()]) + W_O_c * sum([len(c.methods) for x in C.values()])) * N_C

#N_O_M = sum([o.N for o in O_M]) / len(O_M)

#call counts from closure trees
unique_funcs = {}
for c in C.itervalues():
        #print "Functions called in class:", c.name
 	funcs = count_calls.functions_called_in_class(c.name)
        #print funcs.keys()

        #add to the global set (well, dict) of all called funcs by using the func name only
        #to filter out duplicates -- e.g. addEventListener and getAttribute are considered the same on all objs (room, reactor etc.)
        for func, params in funcs.iteritems():
                if '.' in func:
                        plainname = func.split('.')[-1]
                else:
                        plainname = func

                if plainname not in unique_funcs:
			unique_funcs[plainname] = params
		else:
			#check if the param count in this call is same as previous info
			if len(unique_funcs[plainname]) < len(params):
                                unique_funcs[plainname] = params #lets use the biggest param count found

                #XXX NOTE: if "source count" in Sneed means places (classes?) where was called,
                #add the bookkeeping for that data here!!! XXX

for f, params in unique_funcs.iteritems():
        print f, len(params)

MP = (W_O_M * len(unique_funcs)  )	

# MP = (W_O_M * len(O_M) + sum([len(o.P) for o in O_M)]) + W_S_O * sum([len(o.S) for i in O_M]) + W_T_O * sum([len(o.T) for o in O_M])) * N_O_M

# N_c = prod([(len(c.A) + len(c.R) + len(c.O)) / (len(c.A) + len(c.R) + len(c.O) + ) for c in C])

print "OP %d = CP %d + MP %d" % (CP + MP,
                                 CP,
                                 MP)
