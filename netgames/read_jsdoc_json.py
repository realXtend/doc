import json

f = open("PongMultiplayer/Tundra-PongMultiplayer_jsdoc.json")
d = f.read()
r = json.loads(d)

klasses = {}

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
    
for e in r:
    kind = e['kind']
    name = e['name']
    if kind == "class":
        assert name not in klasses
        newklass = Klass(name)
        klasses[name] = newklass

    memberof = e.get('memberof')

    if kind == "function":
        if memberof:
            owner = klasses.get(memberof)
            if owner:
                #print owner.name, name
                assert name not in owner.methods
                newmethod = Method(name)
                owner.methods[name] = newmethod
                params = e.get('params')
                if params:
                    for p in params:
                        newmethod.params.append(p["name"])
                
            else:
                print memberof

    #if kind == "member":
    #    print name

print "============="
for k in klasses.itervalues():
    print "Class %s:" % k.name
    for m in k.methods.itervalues():
        print "%s: %s" % (m.name, str(m.params))
    print "-------"

#XXX add Object-Point variable calcs directly to here?
