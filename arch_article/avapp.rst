The concept of an avatar characterizes virtual worlds -- VW
functionality is often described by how the user is in the world as an
avatar through which she can act. It is so central that technologies
like the protocol used in Second Life assume it, the concept is
hardcoded in the platform. We argue that it should not exist on the
base level, to allow arbitrary applications to be built. However, a
generic platform must of course allow the implementation of avatar
functionality on the application level. Here we describe how it is
achieved using the RealXtend Entity-Component-Action model.

Avatar means two things: 1) The visual appearance and the systems
built around it, to for example modify the looks and add attachments
like clothing and accessories, and use of animations for communication
etc.  2) The functionality that when a user connects to a world server
with a client, she gets the avatar object as the point of focus and
control -- for example, the default inputs from arrow keys and the
mouse are mapped to move and rotate the own avatar. Here, while
covering the very basics for the visual appearance, the focus is on
the functionality.

The server side functionality to give every new client connection a
designated avatar is implemented in a simple Javascript script,
avatarapplication.js . Upon a new connection, it instanciates an
avatar by creating a new entity and these components to it: Mesh for
visible 3d model and associated skeleton for animations, Placeable for
the entity to be positioned in the 3d scene, AnimationController to
change and synchronize the animation states so that e.g. the walking
animation is correctly played back while the avatar moves and finally
a Script component which refers to another Javascript file which
implements the avatar functionality. Additionally, the main
application script is also executed on the client, where it only adds
a function to toggle between the default free look camera and new
camera which follows the avatar.

The other script for an individual avatar, simpleavatar.js, adds a few
more components: AvatarAppearance for the customizable looks,
RigidBody for physics (collision detection) and on the client side an
InputMapper for handling user control input. ...

(finish me!)
