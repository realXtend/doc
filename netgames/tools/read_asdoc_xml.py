import xml.etree.ElementTree as ET
from klass import Klass, Method

filepath = "../UnionPong/unionpong-asdoc/tempdita/" 

#classfile = "Classes.xml"
methodfile = "methodSummary.xml"
xmlfile = methodfile

et_classes = ET.ElementTree()
et_classes.parse(filepath + xmlfile)

klasses = {}

classes = et_classes.getiterator("apiClassifier")
for c in classes:
    classname = c.find('apiName').text
    print classname
    k = Klass(classname)
    klasses[classname] = k

    operations = c.getiterator("apiOperation")
    for op in operations:
        opname = op.find('apiName').text
        print opname
        m = Method(opname)
        k.methods[opname] = m

        details = op.getiterator("apiOperationDetail")
        for det in details:
            opdef = det.find('apiOperationDef')
            params = opdef.getiterator('apiParam')
            for par in params:
                parname = par.find('apiItemName').text
                m.params.append(parname)

    print '---'


