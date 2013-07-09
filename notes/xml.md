The Tundra ECA model
====================

![(ECA Diagram)](https://github.com/realXtend/doc/raw/master/ec_model.svg "Entity-Component model")

Example: a positioned mesh
==========================

TXML
----

    <entity id="1" sync="1">
        <component type="EC_Placeable" sync="1">
             <attribute value="0,-5.0215,-22.5612,0,0,0,5,2,5" name="Transform"/>
   	     <attribute value="false" name="Show bounding box"/>
  	     <attribute value="true" name="Visible"/>
	     <attribute value="1" name="Selection layer"/>
	     <attribute value="" name="Parent entity ref"/>
   	     <attribute value="" name="Parent bone name"/>
  	 </component>
  	 <component type="EC_Mesh" sync="1">
   	     <attribute value="0,-20,0,0,0,0,1,1,1" name="Transform"/>
	     <attribute value="local://teapot.mesh" name="Mesh ref"/>
	     <attribute value="" name="Skeleton ref"/>
	     <attribute value="local://red.material" name="Mesh materials"/>
	     <attribute value="0" name="Draw distance"/>
   	     <attribute value="false" name="Cast shadows"/>
	 </component>
    </entity>

XML3d
-----

    <group  style="transform: translate3d(0px,-20px, 0px)" >
        <mesh src="resource/teapot.xml#mesh" />
    </group>
