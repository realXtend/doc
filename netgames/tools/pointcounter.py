import operator
import read_asdoc_xml as r
#import read_jsdoc_json as r

def prod(operands):
	return reduce(operator.mul, operands)


C = r.giev().values()

W_c = 4
W_R_c = 2
W_O_c = 3
W_O_M = 2
W_S_O = 2
W_T_O = 2

N_C = sum([c.N_c for c in C]) / len(C)
CP = (W_c * len(C) + sum([len(c.fields) for c in C]) + W_R_c * sum([len(c.relations) for x in C]) + W_O_c * sum([len(c.methods) for x in C])) * N_C
print CP



# N_O_M = sum([o.N for o in O_M]) / len(O_M)





# MP = (W_O_M * len(O_M) + sum([len(o.P) for o in O_M)]) + W_S_O * sum([len(o.S) for i in O_M]) + W_T_O * sum([len(o.T) for o in O_M])) * N_O_M



# N_c = prod([(len(c.A) + len(c.R) + len(c.O)) / (len(c.A) + len(c.R) + len(c.O) + ) for c in C])
