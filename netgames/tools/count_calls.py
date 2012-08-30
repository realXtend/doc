DATAPATH = "../data/unionpong/"
FILESUFFIX = "-filtered.tree"

def do_call_block(last_call, exprs):
    first_tokens = [x[0] for x in exprs[1:]]
    print last_call, 'had', first_tokens.count('NAME'),
    print 'names and', first_tokens.count('NUMBER'), 'numbers',
    print 'and', first_tokens.count('STRING'), 'strings, total: %d' % len(first_tokens)

def count_calls(classname):
    calltreefile = "%s%s%s" % (DATAPATH, classname, FILESUFFIX)

    prev_il = 0
    in_call = False
    curr = []
    last_call = None
    for line in open(calltreefile):
        indent_spaces = len(line) - len(line.lstrip(' '))
        if indent_spaces % 4 or '\t' in line:
            sys.exit('bad indent, need spaces in multiples of 4')
        indent_level = indent_spaces / 4

        tokens = line.strip().split()

        if indent_level > prev_il:
            curr = []

        if indent_level < prev_il:
            if in_call:
                do_call_block(last_call, curr)

            in_call = False
            curr = []

        if tokens[0] == 'CALL':
            in_call = True
            last_call = tokens


        curr.append(tokens)

        prev = curr
        prev_il = indent_level


    if in_call:
        do_call_block(last_call, curr)

if __name__ == '__main__':
    count_calls("Court")
