class Klass:
    N_c = 1

    def __init__(self, name):
        self.name = name
        self.supers = []
        self.fields = []
        self.methods = {}
        self.relations = set() #multiple rels to the same type are one rel, cardinality >1 -- right?
        #print "class:", name

class Method:
    def __init__(self, name):
        self.name = name
        self.params = []
    
def printout(klasses):
    print "============="
    for k in klasses.itervalues():
        print "Class %s: (%s)" % (k.name, k.supers)
        print "Fields:", k.fields
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
