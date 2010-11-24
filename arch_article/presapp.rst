In contrast with the avatar application (/ feature?) presented in X,
let's consider a different kind of an application which does not have
avatars at all.  There are of course many virtual worlds and games
without a single character as the locus of control: Map/geographic
applications like Google Earth or astronomical simulations covering
the whole universe like Celestia are about efficient navigation and
time control of the whole space, not about moving own presence around.
Game genres like real time strategy (RTS) feature fluent selection of
the multiple units which the player commands, somewhat similarly to
board games like chess where the player has a group of pieces of which
can choose which to move. However, to get an even more different point
of view to the user controls and actions in an application, the
example here is not about navigating a view of a 3d space or spatial
movement of units. Instead, here we present more a slideshow like
presentation application design using the same entity-component-action
building blocks which were used to implement the avatar functionality
on the same generic application platform.

A presentation tool is typically about giving the presenter means to
control the position in the prepared material, for example to select
the currently visible slide in a slideshow, which is shared among all
participants. In a local setting where everyone is in the same
physical space it is simply about choosing what to show via the
overhead projector which the audience sees. In a remote distributed
setting there must be some system to get a shared view over the
network, and that is the use case in this example.

There are several ways how the realXtend platform could be used to
make a presentation. One is to put the material in the 3d space so
that by navigating the view the presenter can focus on the different
topics. The material could be simply 2d text and image slides, or web
pages, on plates around the space when the 3d system would be just
used as a spatial organization and navigation tool for the traditional
slides. Or there could be animated 3d objects in the
scene. Alternatively, the viewport could stay in place while the scene
is changed -- e.g. by simply changing the slide on a virtual display
in world, or animating the objects in the scene so that different
items come to the stage during the course of the presentation. Also,
the platform and the entity-component system is not limited to the 3d
view: the 2d ui is also accessible for application scripts, so they
can use the network synchronized entity attribute states and actions
to make shared gui views with the 2d widgets as well. The built-in
voice capability and text chat can of course be used for the talk and
communicating with the others.

No matter what techniques are used to make the presentation material,
to run the show the presenter typically always needs the same basic
controls: the default action to advance to next point, and
alternatively to reverse back to previous or jump to an arbitrary one
to for example when answering a question. In this example, let's map
those to the arrow keys and the default act of proceeding to the next
point also to spacebar and the left mouse button. So here we diverge
from e.g. the defaults in the Second Life (tm) client, where arrow
keys are used to move and turn the avatar, spacebar makes the avatar
jump or start flying, and the left mouse button over the 3d view
triggers the possible default action on the object in the scene under
the mouse cursor (the avatar touches it). SL is often used for
presentations, but typically so that the default avatar controls stay
and in-world buttons are used to control the slideshow. That is,
pressing arrow keys just rotates or moves your avatar, and you must
instead hit the right 3d object in the scene with a mouseclick to
control the presentation. We argue that customizing the controls to
best support the task at hand is essential, and that the application
designer should be given the choice whether to include e.g. the avatar
functionality or not.

Synchronizing the view, getting the presentation control actually
executed when the presenter presses the keys, is now the remaining
area to be designed. In the distributed system one question is where
to execute what. One option is to handle the controls locally in the
presenter's client: listen to key and mouse input there, manipulate
the scene accordingly and get it shared via the generic scene
synchronization mechanism which is there by default. For example if
the slides are published on the web, the presentation script can just
have a list of URLs and change the current one to be used on a webview
in the scene. When running this locally in the presenter's client, no
server or other participants actually need to know anything about the
presentation -- there is no need for a shared presentation application
among the participants. It is just a custom tool that the presenter
has to manipulate the basic scene. Naali comes by default with a
built-in WebView component which implements showing html pages from
the web, and the generic attribute synchronization mechanism shares
the URL changes, so the other participants get to see the slides.

However, sharing the custom presentation functionality and the data
among the participants would enable useful features for the audience
as well. For example it might be nice to have view of the outline of
the talk visible, with the current position highlighted. Also allowing
the participants to browse the material freely, perhaps in an
additional view beside the one the presenter controls, seems
useful. As an advanced feature, a way to add comments directly in the
context of some specific point in the material could be
developed. Showing the outline and hilighting the current position
there could be done from the presenter's client, for example by simply
adding another element to the scene next to the slide display. But it
might be simpler when the data is shared, and the free browsing
feature is certainly simplest that way.

So let's add a new entity, and call it "presentation" (or
PresentationApplication). Entities are just identities which aggregate
components. For the simple technique, showing web pages, we need a few
basic ones: Placeable to have something in the scene, Mesh to have
geometry (e.g. a plane) on which to show the slides, and WebView to
render html from URLs. Then to do our custom functionality, two
additional ones: a DynamicComponent to hold and sync our custom data,
and Script to implement the custom UI handling and presentation
controls. As data we need a list or URLs and an index number for the
current position, so the DynamicComponent needs two attributes: a
stringlist and an integer. This custom data becomes part of the scene
data and is automatically stored and synchronized among the
participants. The Script component is a reference to a Javascript or a
Python file (or a Python class) which is executed (or instanciated)
within the context of this data, to implement all the functionality.

To handle the user input, we have two options: either handle input
events and modify the state correspondingly directly in the
application (script) code, or use the InputMapper component to send
entity actions like in the avatar example. (just in code more
straightforward? but what about differentiating who is presenting
vs. audience -- following the av example, would it be nice to just
send actions from the client, and have the server arbitrate? but that
wouldn't work for the private browsing .. are entity-actions useful
for local code?) ...
