import xml.etree.ElementTree as ET

xmlfile = "../UnionPong/unionpong-asdoc/tempdita/" + 'Classes.xml'
et = ET.ElementTree()
et.parse(xmlfile)

classes = et.getiterator("apiClassifier")
for c in classes:
    classname = c.find('apiName').text
    print classname
