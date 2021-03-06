#!/usr/bin/env python
# a bar plot with errorbars
import numpy as np
import matplotlib.pyplot as plt

import data

#N = 5
#menMeans = (20, 35, 30, 35, 27)
#menStd =   (2, 3, 4, 1, 2)

ind = np.arange(data.N)  # the x locations for the groups
width = 0.35       # the width of the bars

fig = plt.figure()
ax = fig.add_subplot(111)
rects1 = ax.bar(ind, data.tundraData, width, color='r') #, yerr=menStd)

#womenMeans = (25, 32, 34, 20, 25)
#womenStd =   (3, 5, 2, 3, 3)
rects2 = ax.bar(ind+width, data.unionData, width, color='y') #, yerr=womenStd)

# add some
ax.set_ylabel('Scores')
ax.set_title('Scores by Game version and Metric')
ax.set_xticks(ind+width)
ax.set_xticklabels( data.labels )#, 'G2', 'G3', 'G4', 'G5') )
#'Object Points, Full Code')
ax.legend( (rects1[0], rects2[0]), ('TundraPong', 'UnionPong') )
#ax.legend( [rects1[0]], ['Men'] )

def autolabel(rects):
    # attach some text labels
    for rect in rects:
        height = rect.get_height()
        ax.text(rect.get_x()+rect.get_width()/2., height + 10, '%d'%int(height),
                ha='center', va='bottom')

autolabel(rects1)
autolabel(rects2)

plt.show()
