import json
import klass
from klass import Klass, Method

def giev():
    f = open("../PongMultiplayer/Tundra-PongMultiplayer_jsdoc.json")
    d = f.read()
    r = json.loads(d)

    klasses = {}

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
    return klasses

if __name__ == '__main__':
    klasses = giev()
    klass.printout(klasses)
