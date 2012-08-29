import xml.etree.ElementTree as ET
import klass
from klass import Klass, Method

filepath = "../UnionPong/unionpong-asdoc/tempdita/" 

#classfile = "Classes.xml"
methodfile = "methodSummary.xml"
fieldfile = "fieldSummary.xml"

def get_klasses():
    klasses = {}

    et_classes = ET.ElementTree()
    et_classes.parse(filepath + methodfile)

    classes = et_classes.getiterator("apiClassifier")
    for c in classes:
        classname = c.find('apiName').text
        #print classname
        k = Klass(classname)
        klasses[classname] = k

        operations = c.getiterator("apiOperation")
        for op in operations:
            opname = op.find('apiName').text
            #print opname
            m = Method(opname)
            k.methods[opname] = m

            details = op.getiterator("apiOperationDetail")
            for det in details:
                opdef = det.find('apiOperationDef')
                params = opdef.getiterator('apiParam')
                for par in params:
                    parname = par.find('apiItemName').text
                    m.params.append(parname)

    return klasses


def get_values(klasses):
    et = ET.ElementTree()
    et.parse(filepath + fieldfile)

    classes = et.getiterator("apiClassifier")
    for c in classes:
        classname = c.find('apiName').text
        klass = klasses[classname]

        values = c.getiterator("apiValue")
        for value in values:
            name = value.find('apiName').text
            valuedetail = value.find('apiValueDetail')
            valuedef = valuedetail.find('apiValueDef')
            valueclassifier = valuedef.find('apiValueClassifier')
            if valueclassifier is not None:
                relclassname = valueclassifier.text
                #print classname, name, relclassname

                #relklass = klasses[relclassname]
                klass.relations.append(relclassname) #relklass)

def giev():
    klasses = get_klasses()
    get_values(klasses) #adds relations to each klass
    return klasses

if __name__ == '__main__':
    klasses = giev()
    klass.printout(klasses)
