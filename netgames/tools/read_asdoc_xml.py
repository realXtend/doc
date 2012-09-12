import xml.etree.ElementTree as ET
import klass
from klass import Klass, Method

filepath = "../UnionPong/unionpong-asdoc/tempdita/" 

#classfile = "Classes.xml"
methodfile = "methodSummary.xml"
fieldfile = "fieldSummary.xml"


def get_klasses(infilter=None):
    klasses = {}

    et_classes = ET.ElementTree()
    et_classes.parse(filepath + methodfile)

    classes = et_classes.getiterator("apiClassifier")
    for c in classes:
        classname = c.find('apiName').text
        #print classname
        if infilter is not None: #filtering in use
            if classname not in infilter:
                print "Filtering out class:", classname
                continue
        k = Klass(classname)
        klasses[classname] = k

        classdetail = c.find('apiClassifierDetail')
        classdef = classdetail.find('apiClassifierDef')
        baseclass = classdef.find('apiBaseClassifier')
        if baseclass is not None:
            supername = baseclass.text
            if supername != 'Object':
                k.supers.append(baseclass.text)

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
        if classname not in klasses: #has been filtered out in first pass
            continue
        klass = klasses[classname]

        values = c.getiterator("apiValue")
        for value in values:
            name = value.find('apiName').text
            valuedetail = value.find('apiValueDetail')
            valuedef = valuedetail.find('apiValueDef')

            #relation or attribute?
            valueclassifier = valuedef.find('apiValueClassifier')
            if valueclassifier is not None: #looks like a relation?
                relclassname = valueclassifier.text
                #print classname, name, relclassname

                #relklass = klasses[relclassname]
                klass.relations.add(relclassname) #relklass)

            else:
                apiproperty = valuedef.find('apiProperty')
                if apiproperty is not None: #is a property?
                    #this seemed to work otherwise ok but UnionPong,
                    #but referring to a class outside this codebase was not detected similarily:
                    if name == "Reactor":
                        klass.relations.add(name)
                    else:
                        klass.fields.append(name)

def get_classes(infilter=None):
    klasses = get_klasses(infilter)
    get_values(klasses) #adds relations to each klass
    return klasses

if __name__ == '__main__':
    klasses = get_classes()
    klass.printout(klasses)
