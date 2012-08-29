class Klass:
    def __init__(self, name):
        self.name = name
        self.fields = []
        self.methods = {}
        #print "class:", name

class Method:
    def __init__(self, name):
        self.name = name
        self.params = []
    
def printout(klasses):
    print "============="
    for k in klasses.itervalues():
        print "Class %s:" % k.name
        for m in k.methods.itervalues():
            print "%s: %s" % (m.name, str(m.params))
    print "-------"

#XXX add Object-Point variable calc here too?
