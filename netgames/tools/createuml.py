import xml.etree.ElementTree as ET
from xml.etree.ElementTree import ElementTree, Element, SubElement

XSTART = 40
xcoord = XSTART
ycoord = 30

def make_coords(el, membercount):
    global xcoord, ycoord

    coords = SubElement(el, 'coordinates')
    x, y, w, h = [SubElement(coords, c) 
                  for c in ['x', 'y', 'w', 'h']]
    x.text = str(xcoord)
    y.text = str(ycoord)
    w.text = "230"
    h.text = str(20 + (18 * membercount))

    xcoord += 260

    if xcoord > 1000:
        xcoord = XSTART
        ycoord += 300

def make_relation(diag, relname, frm):
    rel = SubElement(diag, 'element')
    tp = SubElement(rel, 'type')
    tp.text = "com.umlet.element.Relation"

    coords = SubElement(rel, 'coordinates')
    x, y, w, h = [SubElement(coords, c) 
                  for c in ['x', 'y', 'w', 'h']]
    
    #middle pos?
    x.text = "0"
    y.text = "0"

    #not used? but needed..? (didn't work with 0)
    w.text = "10"
    h.text = "10"
    
    pn = SubElement(rel, 'panel_attributes')
    pn.text = "lt=<-"

    pn = SubElement(rel, 'additional_attributes')
    pn.text = "0;0;10;100" #end and start offsets?
    

def createuml(classes):
    diag = Element('diagram')
    diag.attrib['program'] = "umlet"
    diag.attrib['version'] = "11.3"

    for c in classes.itervalues():
        el = SubElement(diag, 'element')
        tp = SubElement(el, 'type')
        tp.text = "com.umlet.element.Class"
        make_coords(el, len(c.fields) + len(c.methods))
        
        pn = SubElement(el, 'panel_attributes')
        pn.text = c.name
        if len(c.supers) > 0:
            pn.text += ": %s" % c.supers[0] #multiple inheritance ignored now XXX

        #attrs
        pn.text += "\n--\n"
        for f in c.fields:
            pn.text += "%s: type\n" % f #we don't have type info as it is not used in the calcs

        #methods
        pn.text += "\n--\n"
        for method in c.methods.itervalues():
            pn.text += "#%s(" % method.name
            #print method, method.params
            if len(method.params) > 0:
                for p in method.params:
                    pn.text += "%s, " % p
                pn.text = pn.text[:-2]
            pn.text += ")\n"

        #possible baseclass(es?)
        

        #other relations (associations)
        for rel in c.relations:
            make_relation(diag, rel, c.name)
    
    return diag

if __name__ == '__main__':
    #import read_jsdoc_json
    #classes = read_jsdoc_json.get_classes()

    import read_asdoc_xml
    classes = read_asdoc_xml.get_classes()

    doc = createuml(classes)
    print ET.tostring(doc)

