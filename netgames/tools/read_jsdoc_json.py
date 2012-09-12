import json
import klass
from klass import Klass, Method

def get_classes(infilter=None): #XXX note: filter not implemented here now, only for unionpong / as reading
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

        if kind == "member":
            #print name
            pass
            """
            NOTE: this does not read members to find relations now.
            by reading the TundraPong game.js source code, it seems that those classes 
            do not have relationships? Thereis the gamedata dict as member.
            perhaps the UI Widget in GameClient should be considered a relation?
            or the components such as InputMapper? Let's add those manually here now.
            """

    #manual addition of relations
    client = klasses['GameClient']
    client.relations.add('EC_InputMapper') #apparently the only EC used anywhere in this app.
    
    server = klasses['GameServer']
    #except placeable is used via data.p?_bat.placeable -- let's consider the bat&ball rels, rels
    server.relations.add('Entity') #multiple of kind => 1 rel with cardinality ("Ball", "P1_Bat", "P2_Bat")

    #the gamedata dict kind of hides the fact that there are members/fields here
    #--lets include the vars that are initialized in GameServer.createGame
    server.fields.extend([
            "serverId",
            "running",
            "speed",
            "winscore",
            "gameTimeIter",
            "p1_client_id",
            "p2_client_id",
            "p1_score",
            "p2_score"])
    
    #fields for the client too from init() and initUi()
    client.fields.extend([
            "myId",
            "running",
            "widget"])

    return klasses

if __name__ == '__main__':
    klasses = get_classes()
    klass.printout(klasses)
