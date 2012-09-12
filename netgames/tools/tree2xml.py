import os
import sys

def xmlify(treefile):
    print '<?xml version="1.0" encoding="utf-8"?>'
    infile = open(treefile)
    stack = []
    prev_indent = -1
    for lineno, line in enumerate(infile):
        l2 = line.lstrip(' ')
        nspaces = len(line) - len(l2)
        assert nspaces % 4 == 0, repr(line)
        indentlevel = nspaces/4
        if indentlevel <= prev_indent:
            dedent_count = (prev_indent - indentlevel) + 1
            # print dedent_count, 'c'
            for i in range(dedent_count):
                closetag = stack.pop()
                print '</' + closetag + '>'

        if l2 == '\n':
            continue

        tag = l2.split(None, 1)[0]
        if tag in ('NAME', 'STRING'):
            k,v = "PARAM", l2.split()[1]
            print '<' + tag + ' %s="%s"> <!--' % (k, v) + ' '.join(l2.strip().split()[1:]) + '-->'
        else:
            print '<' + tag + '> <!--' + ' '.join(l2.strip().split()[1:]) + '-->'
        stack.append(tag)

        # print lineno
        prev_indent = indentlevel


    # for elt in stack:
    #    print '</' + elt + '>'
    # print lineno

    # print 'eof left stack with #items', len(stack), stack

if __name__ == '__main__':
    if len(sys.argv) > 1:
        treefile = sys.argv[1]
    else:
        treefile = '../data/unionpong/UnionPong.tree'
    xmlify(treefile)
