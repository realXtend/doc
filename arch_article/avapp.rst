The concept of an avatar characterizes virtual worlds -- they are
often described by how the user is in the world as an avatar. The
protocol used in Second Life assumes avatars, it is hardcoded in the
platform. We argue that it should not exist on the base level, to
allow arbitrary applications to be built. However, a generic platform
must of course allow the implementation of avatar functionality. Here
we describe a proof of concept implementation using the realXtend
Entity-Component-Action model. The full source code is available at
[tundra-avatar]_, and a parts of it are included below.

Avatar functionality is split in two aspects here: 1) The visual
appearance and related functionality to modify the looks and clothing,
and use of animations for communication etc.  2) The model where every
user connection is given a single entity as the point of focus and
control. The default inputs from arrow keys and the mouse are mapped
to move and rotate the own avatar. Here, while covering the basics for
the appearance, the focus is on the latter control functionality.

The server-side functionality to give every new client connection a
designated avatar is implemented in a simple Javascript script,
avatarapplication.js. Upon a new connection, it instanciates an avatar
by creating a new entity and these components to it: Mesh for the
visible 3D model and associated skeleton for animations, Placeable for
the entity to be positioned in the 3D scene, AnimationController to
change and synchronize the animation states and finally a Script
component to implement the functionality of a single
avatar. Additionally, the main application script is also executed on
the client, where it adds a new camera which follows the avatar and a
keybinding to toggle between camera modes.

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
RigidBody for physics and on the client side an InputMapper for user
input. Entity actions are used to make the avatar move according to
the user controls. These actions are commands that any code can invoke
on an entity, to be executed either locally in the same client or
remotely on the server, or on all the connected peers. Here the local
code sends for example the action "Move(forward)" to be executed on
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
        var animname = animcontroller.animationState;
        if (animname != "")
            animcontroller.EnableExclusiveAnimation(animname, true, 0.25, 0.25, false);
        // If walk animation is playing, adjust speed according to the rigidbody velocity
        if (animcontroller.IsAnimationActive("Walk")) {
            // Note: on client the rigidbody does not exist, 
            // so the velocity is only a replicated attribute
            var vel = me.rigidbody.linearVelocity;
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

.. figure:: avapp.jpg
   :scale: 100 %

   The parts of the avatar example:

   +-----------------------+---------------------------------------------+
   | Symbol                | Meaning                                     |
   +=======================+=============================================+
   | Colors brown/purple   | Client / Server respectively                |
   +-----------------------+---------------------------------------------+
   | Arrows                | Network messages                            |
   +-----------------------+---------------------------------------------+
   | Filled boxes          | ECs on client, server or shared by both     |
   +-----------------------+---------------------------------------------+


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

With the ability to run custom code also in the client, it is easy to
extend avatar related functionality. For example, in one project for
schools we added the capability to simply carry objects around as the
most simple means for 3D editing. Another possibility is to add more
data that is synchronized for animations, even the full skeleton for
motion capture or machine vision based mapping of the real body to the
avatar pose.
