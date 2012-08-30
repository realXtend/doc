import re
import os

path = '../UnionPong/Actionscript/'

type_matcher = re.compile(r'(:\w+)')
keywords = re.compile(r'public|static|protected|private|final')
package = re.compile(r'(^package \{)(.*)}')

for filename in os.listdir(path):
    data = open(os.path.join(path, filename)).read()
    #print type_matcher.findall(data)
    data = type_matcher.sub('', data)
    data = keywords.sub('', data)
    data = data.replace('const ', 'var ')
    print data
    open(os.path.join('../UnionPong/js_for_closure/', filename.replace('.as', '.js')), 'w').write(data)

