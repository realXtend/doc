The Tundra ECA model
====================

<!-- ![(ECA Diagram)](https://github.com/realXtend/doc/raw/master/ec_model.png "Entity-Component model")-->
<img src="https://github.com/realXtend/doc/raw/master/ec_model.png" style="width: 50%;" />

Example: a positioned mesh
==========================

TXML
----

```xml
<entity id="1" sync="1">
    <component type="EC_Placeable" sync="1">
        <attribute value="0,-20,0,0,0,0,1,1,1" name="Transform"/>
    </component>
    <component type="EC_Mesh" sync="1">
        <attribute value="local://teapot.mesh" name="Mesh ref"/>
    </component>
</entity>
```

XML3d
-----

```xml
<group style="transform: translate3d(0px,-20px, 0px)" >
    <mesh src="resource/teapot.xml#mesh" />
</group>
```
