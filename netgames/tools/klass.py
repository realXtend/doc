class Klass:
    N_c = 1

    def __init__(self, name):
        self.name = name
        self.fields = []
        self.methods = {}
        self.relations = []
        #print "class:", name

class Method:
    def __init__(self, name):
        self.name = name
        self.params = []
    
def printout(klasses):
    print "============="
    for k in klasses.itervalues():
        print "Class %s:" % k.name
        print "Methods:"
        for m in k.methods.itervalues():
            print "%s: %s" % (m.name, str(m.params))
        print "-"
        #for v in k.relations.itervalues():
        print "Relations:"
            #print "%s - %s" % ()
        print k.relations
        print "---"
    print "-------"

#XXX add Object-Point variable calc here too?
