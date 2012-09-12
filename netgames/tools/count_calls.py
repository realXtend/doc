from lxml import etree

DATAPATH = "../data/unionpong/"
FILESUFFIX = ".xml"

def from_getprop(el):
    ob = el[0].get('PARAM')
    prop = el[1].get('PARAM')
    return ob, prop

def get_calls(classname):
    """gets all function/method calls and their parameters from closure's tree dump"""

    calls = []

    calltreefile = "%s%s%s" % (DATAPATH, classname, FILESUFFIX)
    parser = etree.XMLParser(remove_comments=True)
    tree = etree.parse(calltreefile, parser=parser)
    callelems = tree.xpath("//CALL")
    
    for c in callelems:
        func, params = c[0], c[1:]

        #get func name either via getprop or directly
        if func.tag == 'GETPROP':
            ob, prop = from_getprop(func)
            funcstr = "%s.%s" % (ob, prop) #reactor.addEventListener - may consider just plain func name
        else:
            funcstr = func.get('PARAM')

        calls.append((funcstr, params))

    return calls

def called_funcs(calls):
    """gets the set of unique functions/methods called from a list of calls"""
    funcs = {}
    for func, params in calls:
        if func not in funcs:
            funcs[func] = params
        else:
            #check if the param count in this call is same as previous info
            if len(funcs[func]) < len(params):
                funcs[func] = params #lets use the biggest param count found

    return funcs

def functions_called_in_class(classname):
    calls = get_calls(classname)
    funcs = called_funcs(calls)
    return funcs

if __name__ == '__main__':
    testclass = "UnionPong"
    #testclass = "Court"

    funcs = functions_called_in_class(testclass)

    for f, params in funcs.iteritems():
        print f, len(params)
