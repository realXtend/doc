import pylab

N = 4
labels = ('LoC Full', 'OP Full', 'LoC Client', 'OP Client')

#tundra
loc_tundra_full = 361
op_tundra_full = 178

loc_tundra_client = 115
op_tundra_client = 90

#union
loc_union_client = 565
op_union_client = 376

#added with server to get full-full
loc_union_full = loc_union_client + 281
op_union_full = op_union_client + 162

#all
tundraData = [loc_tundra_full, op_tundra_full, 
              loc_tundra_client, op_tundra_client]
unionData = [loc_union_full, op_union_full,
             loc_union_client, op_union_client]
#locs = [loc_tundra_full, loc_union_full]

if __name__ == '__main__':
    pylab.plot(tundraData)
    pylab.plot(unionData)
    pylab.show()
