#!/bin/bash

CLASSNAMES=( clamp ClientAttributes Court GameManager GameStates HUD KeyboardController PongClient PongObject Rectangle RoomAttributes RoomMessages Settings UnionPong )

for s in "${CLASSNAMES[@]}"
do
    java -jar /home/antont/Downloads/compiler-latest/compiler.jar --print_tree ../UnionPong/js_for_closure/$s.js > ../data/unionpong/$s.tree

    #this filtering was apparently buggy, we just process the raw now
    #awk -f parse_tree.awk ../data/unionpong/$s.tree > ../data/unionpong/$s-filtered.tree

    python tree2xml.py ../data/unionpong/$s.tree > ../data/unionpong/$s.xml
done


