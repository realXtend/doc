import xml.etree.ElementTree as ET

filepath = "../UnionPong/unionpong-asdoc/tempdita/" 

#classfile = "Classes.xml"
methodfile = "methodSummary.xml"
xmlfile = methodfile

et_classes = ET.ElementTree()
et_classes.parse(filepath + xmlfile)

classes = et_classes.getiterator("apiClassifier")
for c in classes:
    classname = c.find('apiName').text
    print classname

    operations = c.getiterator("apiOperation")
    for op in operations:
        opname = op.find('apiName').text
        print opname

        details = op.getiterator("apiOperationDetail")
        for det in details:
            opdef = det.find('apiOperationDef')
            params = opdef.getiterator('apiParam')
            for par in params:
                print par.find('apiItemName').text

    print '---'
