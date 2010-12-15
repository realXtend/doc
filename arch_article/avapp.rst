The concept of an avatar characterizes virtual worlds -- VW
functionality is often described by how the user is in the world as an
avatar through which she can act. It is so central that technologies
like the protocol used in Second Life assume it, the concept is
hardcoded in the platform. We argue that it should not exist on the
base level, to allow arbitrary applications to be built. However, a
generic platform must of course allow the implementation of avatar
functionality on the application level. Here we describe a proof of
concept implementation using the realXtend Entity-Component-Action
model. The full source code is available at [tundra-avatar]_, and a
parts of it are included below.

Avatar means two things: 1) The visual appearance and the systems
built around it, to for example modify the looks and add attachments
like clothing and accessories, and use of animations for communication
etc.  2) The functionality that when a user connects to a world server
with a client, she gets the avatar object as the point of focus and
control -- for example, the default inputs from arrow keys and the
mouse are mapped to move and rotate the own avatar. Here, while
covering the very basics for the visual appearance, the focus is on
the latter control functionality.

The server side functionality to give every new client connection a
designated avatar is implemented in a simple Javascript script,
avatarapplication.js . Upon a new connection, it instanciates an
avatar by creating a new entity and these components to it: Mesh for
the visible 3d model and associated skeleton for animations, Placeable
for the entity to be positioned in the 3d scene, AnimationController
to change and synchronize the animation states so and finally a Script
component to implement the functionality of a single
avatar. Additionally, the main application script is also executed on
the client, where it only adds a function to toggle between the
default free look camera and new camera which follows the avatar.

Handling new client connections on the server:

.. code-block:: javascript

   function serverHandleUserConnected(connectionID, userconnection) {
       var avatarEntity = scene.CreateEntity(scene.NextFreeId(), 
                          ["EC_Script", "EC_Placeable", "EC_AnimationController"]);
       avatarEntity.Name = "Avatar" + connectionID;
       avatarEntity.Description = userconnection.GetProperty("username");
       avatarEntity.script.ref = "simpleavatar.js";

       // Set random starting position for avatar
       var transform = avatarEntity.placeable.transform;
       transform.pos.x = (Math.random() - 0.5) * avatar_area_size + avatar_area_x;
       transform.pos.y = (Math.random() - 0.5) * avatar_area_size + avatar_area_y;
       transform.pos.z = avatar_area_z;
       avatarEntity.placeable.transform = transform;
   }


The other script for an individual avatar, simpleavatar.js, adds a few
more components: AvatarAppearance for the customizable looks,
RigidBody for physics (collision detection) and on the client side an
InputMapper for handling user control input. So called Entity Actions
are used to make the avatar move according to the user controls. These
actions are commands that any code can invoke on an entity, to be
executed either locally in the same client or remotely on the server,
or on all the connected peers. In this case the local code for avatar
control sends for example the action "Move(forward)" to be executed on
the server when the up-arrow is pressed. The built-in InputMapper
component provides triggering actions based on input, so the avatar
code only needs to register the mappings it wants. The server
maintains a velocity vector for the avatar and applies physics for
it. The resulting position is in the transform attribute of the
component Placeable, which is automatically synchronized with the
generic mechanism so the avatar moves on all clients. The server also
sets the animation state to either "Stand" or "Walk" based on whether
the avatar is moving. All participants run common animation update
code to play back the walk animation while moving, calculating the
correct speed from the velocity data from the physics on the server.

Updating animations, the common code executed both on the client and the server:

.. code-block:: javascript

    function commonUpdateAnimation(frametime) {
        var animcontroller = me.animationcontroller;
        var rigidbody = me.rigidbody;
        var animname = animcontroller.animationState;
        if (animname != "")
            animcontroller.EnableExclusiveAnimation(animname, true, 0.25, 0.25, false);
        // If walk animation is playing, adjust speed according to the rigidbody velocity
        if (animcontroller.IsAnimationActive("Walk")) {
            // Note: on client the rigidbody does not exist, 
            // so the velocity is only a replicated attribute
            var vel = rigidbody.linearVelocity;
            var walkspeed = Math.sqrt(vel.x * vel.x + vel.y * vel.y) * walk_anim_speed;
            animcontroller.SetAnimationSpeed("Walk", walkspeed);
        }
    }

These two parts are enough for very basic avatar functionality to
work. This proof of concept implementation totals in 369 lines of
fairly simple Javascript code in the two files. The visual appearance
is gotten from a pre-existing c++ written AvatarAppearance component,
which reads an xml description with references to the base meshes used
and individual morphing values set by the user in an editor. It uses
the realXtend avatar model which was implemented already in 2008 for
the first prototype which did not have the entity component system at
all, and is used in this demo as is. A more generic and customizable
appearance system could be implemented with the ECs, but that is
outside the scope of the demo and description here.

One thing to note is that the division of work between the clients and
the server described here is by no means the only possible one. The
fact that we are using the same code to run both the server and the
clients makes it fairly simple to reconfigure what is executed
where. This model of clients sending commands only and server doing
all the movement is identical to how the Second Life protocol
works. It is suitable when trust and physics are centralized on a
server. The drawback is that user control responsiveness may suffer
from network lag. We are planning to later utilize the physics module
in client mode too to allow movement code to run locally as well.
