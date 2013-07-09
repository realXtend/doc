The Tundra ECA model
====================

Scenes consist of Entities (E) which are only untyped identities. Entities have Components (C) which further have their data in attributes (A).

<!-- ![(ECA Diagram)](https://github.com/realXtend/doc/raw/master/ec_model.png "Entity-Component model")-->
<img src="https://github.com/realXtend/doc/raw/master/ec_model.png" style="width: 50%;" />

Example: a positioned mesh
==========================

In realXtend / Tundra a positioned mesh in the scene is an entity with two components: 
**Placeable** with the transform attribute, 
and **Mesh** with a reference to the mesh file.

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

XML in general consists of typed elements. In XML3d a mesh is an *element type*.

```xml
<group style="transform: translate3d(0px,-20px, 0px)" >
    <mesh src="resource/teapot.xml#mesh" />
</group>
```
