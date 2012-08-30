
#!/bin/bash

CLASSNAMES=( clamp ClientAttributes Court GameManager GameStates HUD KeyboardController PongClient PongObject Rectangle RoomAttributes RoomMessages Settings UnionPong )

for s in "${CLASSNAMES[@]}"
do
    java -jar /home/antont/Downloads/compiler-latest/compiler.jar --print_tree ../UnionPong/js_for_closure/$s.js > ../data/unionpong/$s.tree

    awk -f parse_tree.awk ../data/unionpong/$s.tree > ../data/unionpong/$s-filtered.tree
done


