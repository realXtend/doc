===============================================
An Entity System for Networked Game Development
===============================================

---------------------------------------------------------
or: Networked Games Development with realXtend Tundra SDK
---------------------------------------------------------

toni

jukka?

jonne?

rauli?

erno?
...

.. contents::


Abstract
========

We present an inherently networked entity system for creating
multiuser applications, including networked games. The entities
aggregate components with attributes which are automatically
synchronized in a client-server setup. So called entity-actions can be
called both locally and remotely, they are a simple form of RPC. This
system is implemented in the open source realXtend Tundra SDK which is
a complete platform for multiuser 3d applications. The API of Tundra
is evaluated critically to analyze the entity model and to identify
areas for improvement in future work.

The goal is to make creating efficient multiplayer games easy, with
for example just Javascript logic code, without the need to invent own
network messages for simple functionality. Custom messages are
supported for efficiency in more complex cases.

Besides the generic attribute sync, the Tundra SDK includes custom
messages and logic for moving rigid bodies, utilizing the physics
module also on the client side and by implementing (XXX basic sensible
things / nice clever tricks / best practices from the literature /
something). Measurements from these optimizations are presented --
with the optimizations the maximum number of moving objects in a scene
went up by N.


Introduction
============

.. mention concrete advantages to dev clearer, perhaps like was in the old intro version (now moved to under tundra sdk desc here)

Developing a networked multiplayer game is typically (unavoidably)
more complex than a local game. Multiplayer logic is a part of it,
compared to single player games, but a large part of the complexity
comes with the networking: Synchronizing state, triggering events
remotely, arbitrating possible conflicts due to simultaneous actions
from different clients, dealing with problems such as dropped messages
and aborted connections etc. All that work is away from what a game
developer ideally would be focusing on: developing the gameplay
itself.

The question here is whether and how a platform or a library can make
networked game programming easier. In computer science in general, any
problem can be addressed by introducing a new layer of abstraction,
but there are caveats. Many layers of abstraction with different
concepts may just add the cognitive load for the developer, especially
if underlying issues such as network connectivity problems still
propagate through to the top and need to be dealt with. What would be
the best core concepts for productive development of robust networked
games?

The model presented here is an entity-component model, similar to
several contemporary games and engines. It uses aggregation, instead
of inheritance, to compose all game entities as sets of component
instances. All the scene data is in the attributes of the components,
which are automatically synchronized over the network among all the
participants using a client-server setup. Additionally, so-called
entity-actions can be called on the entities -- either locally or over
the network, it is a simple remote procedure call (RPC) mechanism. In
this paper, we evaluate the model by analyzing game development done
using it, and compare the approach with the alternative of just using
a networking library to create connections and do messaging in own
game code.

The evaluation is made using the open source Tundra SDK from the
realXtend initiative. Tundra has been built from the start using this
entity-component model, also for the basic core functionality, and it
is the extensibility mechanism that Tundra provides for additional
functionality as well. We give a brief overview of Tundra as a
platform overall, but the focus is on the networking and the
abstractions provided for application developers. In addition to
reviewing the ease of development, we also analyze the efficiency and
robustness of how the abstract entity-component model with the
automatic synchronization maps to concrete network load.

The article is organized as follows: next we review background and
related work from the literature. Then the design of the
entity-component model is described, and illustrated with two
application examples: 1. A complete treatment of the source code of a
minimal networked multiplayer Pong and 2. Selected details from a
complex watershed environment which hosts two interconnected
multiplayer minigames. Then the underlying networking layer is
analyzed to see how the higher level game codes translate to actual
traffic, how much bandwidth is used (etc? XXX). (Finally ..?)

Background / related
====================

- use of other multiplayer engines: FPS, but also the unity plugins and bigworld etc.
 * the APIs of those, the app dev model: are e.g. connections dealt with at all typically etc? how is data synched (or is it even needed in those, server logic?, scripts?). how do messaging things work (room for improvement in Tundra perhaps?)


.. position in that field somehow, i figure

Game development using the Entity-Component model
=================================================

The entity-component model is an abstract design, not tied to any
specific platform. It is presented here first on the conceptual level,
and illustrated with examples. Finally the implementation of the model
in the Tundra SDK is described, both to analyze how the design works
out in a concrete platform and to identify possible improvements for
the conceptual models and the implementation there.

The abstract model
------------------

The core of the entity-component model is very simple: An entity is
just an identity, without any type or data (apart from the id). It is
used to aggregate components, which have attributes for synchronized &
persistent data, and code to implement the functionality of the
component. An application is a collection if entities.

This aggregation based approach steps away from the inheritance oriented
class hierarchies which were typical in games earlier, to avoid
problems with deep class hierarchies and difficulties of sharing a
piece of functionality across otherwise remote types in a hierarchy
[ecref]. It provides a uniform way of programming a piece of
functionality for all types of entities.

For example, all positioned entities in a 3d scene can have a
Placeable component which contains the scene node transform (position,
orientation and scale). Then any code that deals with positions just
works for all kinds of entities -- lamps, cameras, players or whatever
-- as the placeable component is the same in all of them, and the
entities are not typed. The other functionalities of an entity are
implemented in other components, for example a light of camera
component, but that is independent of the placeable aspect.

Furthermore, all the component data is handled in a unified way with
the generic attribute mechanism. A component specifies the attributes
it contains. The generic systems then take care of synchronizing the
data across the network, and of persisting it (saving to file or
database). No special network messages are required to implement
features, such as having coloured lights or sound sources with varying
audio volume levels -- the light and sound components just define
their data as attributes. Changes in attribute data are communicated
with generic attribute synchronization messages which are specific for
the data type (float, string, ..) but independent of the containing
component.

Additionally, so-called entity-actions can be registered as callback
functions in the entities. They can be called both locally and
remotely and are a simple form of remote procedure calls (RPC). The
entity-actions are called indirectly: the callback handlers are
implemented in components, but the calls are on the entity. That is to
be able to provide a uniform interface to different but related
functionality: For example, a Hide action can be registered so that a
UI button or some game logic code can hide a set of entities. The
details of how to hide a certain kind of an entity depends on the
components it uses to display: for example whether it is a mesh, a
particle system, a piece of text or some UI element. By implementing
the Hide action in all the different components but routing the call
via the entities the same interface works for all implementations.


Example 1: Pong as the Hello World of multiplayer games
-------------------------------------------------------

Pong is a minimal multiplayer game, so let's use it as a simple
example of making a networked game using the entity-component
model. We are using the realXtend Tundra SDK for the evaluation here
and it is a 3d scenegraph engine with rigid body physics simulations
so the game environment and mechanisms are built with those.

The Pong scene consists of -- similarily to the game of tennis -- the
playing field, two paddles for the players and the ball. In this
example the static scene is created with a 3d modeling program (in
this case Blender3d). The scene is exported from Blender to Tundra
SDK, at which point it is converted to the entity-component model: all
the visible entities have a Placeable component for being in the
scene, Mesh for the visual geometry and Rigidbody for the physics
simulation.

To make the game logic, an additional invisible entity is added, let's
call it PongGame. We write the code in Javascript, for which the
mechanism in Tundra is to add a Script component with a reference to
the .js file as an attribute. We want to show a basic GUI in the
clients to visualize the game state: whether a game is running or not,
and what is the score. So let's add also a custom component with that
data in attributes, PongGameState with Boolean:Running and integer
attributes for player 1 and 2 scores. That way the data is
automatically synchronized to clients as well so they can easily use
it in the GUI code. The physics simulation bouncing the ball is ran on
the server side by default, and that is where we want to have all the
logic code of checking when a player scores, starting and stopping
games etc.

In addition to having the logic code and the game state data, we need
to handle clients / players joining and leaving the game. Joining is
triggered with a GUI button in a client, which sends an entity-action
called "JoinGame" to the PongGame application entity, to be handled on
the server side. 

The game does not need to know about clients logging into the server,
as we can have any number of spectators there. As joining the game is
made as a separate action, the game does not need to care when new
bare client connections are established. But we need to handle
disconnects when some player connection is dropped in the middle of a
running game. Network connections in Tundra are outside the entity
model, but hooks for dealing with them are provided in the builtin
core API instead. In this case, the server api object has an event
called UserDisconnected to which we can connect our handler.

We begin the game, for simplicity, when two players have joined
in. They are assigned controls for their own paddles, for example the
mouse y coordinate can be mapped to the corresponding position along
the side of the table. We can manipulate the paddle position directly
in the client by the same code which reads the mouse position. This is
optimal for the control feel to avoid any lag in the visual response
for the hand movements, but can be problematic when the physics are
executed on the server side and there is network latency. The player
can see the ball passing through her paddle, if the server did not
receive the paddle movement in time. Another possibility is to
communicate the controls to the server, move the paddles there, and
thereby get the visual feedback in the client only after the full
roundtrip. This could allow the player to compensate for the latency,
but also make the controlling more difficult due to the delay. For a
study of different strategies for dealing with latency in the game of
pong, see [PongPaper].

The positions of all objects, the transform attributes of the
placeable components in them, are synchronized automatically so all
the participants get the paddle and ball positions automatically. The
bouncing of the ball is handled automatically by the physics
engine. The game code only needs to:

1. Start the game, when two players join, by giving the ball some initial velocity

2. Handle player controls of the paddles during the game

3. Check for the winning condition (ball passes either side) and keep score

4. Handle the user actions to join and thereby start the game, and the
different cases when the game is stopped (win, user decides to stop,
or connection drops).

Arguably this way to implement a networked multiplayer game of pong is
very simple, and succesfully hides all the details of networking from
the game developer. (e.g. the example there does a bit more manually,
even though is largely similar:
http://www.unionplatform.com/?page_id=1229&page=2)


Example 2: Swarming plankton as food for fish in the sea
--------------------------------------------------------

A simple way to make a trivial pong implementation may be nice, but
does the approach work for real, more complex games? We and others
have implemented a range of applications using the entity-component
model on the Tundra SDK, and this section is to analyze issues
encountered with more complex functionality. The particular case is
from an open source application made at the end of the original
realXtend project, as a public demo of the Tundra SDK. That is the
Smithsonian Latino Virtual Museum's Virtual Watershed Initiative, and
in particular the experimental Anchovy game made to the sea bay there.

The whole watershed environment hosts a range of animals of different
scale, from white-tailed deer and opossum to osprey, sea bass and the
anchovy. The idea is that by taking the role of an animal they player
(a child visiting the museum for example) can learn about biology. In
the anchovy game, the player controls the little fish from a 3rd
person angle, trying to find food such as plankton in the sea. The
idea is to have quite a lot of little plankton clouds there, but so
that when multiple players consume it the amount decreases.

To be able to render a lot of little plankton, we use particle
systems. The individual particles in the particle systems move
slightly at random, to give a feel of them floating around in the
water. To have enough particles to fill parts of the sea bay, we
easily need tens of particle systems with hundreds of particles in
each. Synchronizing all those little movements would take an immense
amount of bandwidth, also considering that many other things are
going on in the scene as well. To cut down the traffic, not only are the
individual particles local only, but also the movement of a single
particle system is not communicated. Instead, we form clusters of 5
particle systems which move around as a loose group, and synchronize
only the positions of such clusters. This way we can have lots of
plankton, in approximately the same positions for the different
players. Also the amount of plankton left in a cluster is
synchronized. The idea is that the different players see the plankton
clouds in same areas of the sea bay, and see them diminish when eaten,
but with relatively little network traffic.

That system is implemented by having the game code (Javascript) create
the particle systems in local-only entities, which are not
synchronized over the network at all. Only the clusters are normal
replicated Tundra entities, for which the movement synchronization
works.

The fish themselves are normal replicated entities for which the
server is authorative. That required an additional trick to be able to
implement the collision detection for plankton eating using the
physics engine: By default, physics are executed on the server and
authorative there. However, as the plankton particles do not even
exist there but are on the clients only, we added a local invisible
mouth entity to the otherwise networked fish. This way client side
physics works for detecting collisions of the fish mouths and the
plankton.

Creating this setup obviously required designing and implementing the
code with networking in mind -- in this case, the system definitely
does not hide all the intricacies of networked games from the
developer. The same uniform programming model is applied, certain
entities are just configured to the local-only mode. Also the fact
that in the Tundra SDK we have the same API both in the server and
client executables (the core is the same) enabled an incremental
development path here: first all the functionality was server side,
but as the amount of networking grew to be too much, it was quite
straightforward to change the same code to be executed on the client
side only instead.


The implementation in Tundra SDK
--------------------------------

- API
- Module System
- Core functionality: Ogre3d, Qt, kNet

The realXtend Tundra SDK provides a decent API and a solid platform
for networked 3d applications. It originates from the realXtend
virtual worlds project, but has always been developed to be used for
games as well.  **and has been largely developed by a local game
company, Ludocraft Ltd., also after the initial project -- their
recent Circus demo is also the best simple Tundra game demo now.

Tundra applications are written against the Tundra Core API and
utilizing the Entity-Component scene model. The platform takes cares
of the networking basics, so that an application developer does not
necessarily need to even know about connections, not to mention
dealing with implementing own server and client applications
somehow. When the application is run on a server, all clients due to
the nature of the shared environment participate in the same session
and see everything identically (and when they don't its' a bug and we
must file an issue :p) <-- scrap that stupidity, it's just like
scripting in any scriptable MMO .. or modding a FPS, using engine like
Unreal or Quake. so can just put briefly and ref to something perhaps
too, for clarity hopefully).

---

Case at hand: is it good to dev an app, a multiplayer networked game, with the entity model and the api overall? -- research question
how to answer?
illustrate a set of examples -- two were already in the IEEE paper, and are kind of nice?
XXXwhat here -- short treatment of those, and then some new example(s)? analysis of the Circus code? -- make this 'the circus .. and lvm, paper' ?

Pong - the Hello World of networked multiplayer?


Notes / References
==================

-- about that work -- in a diff paper from the group: "From the result we prove that the decorator feedback only had the positive effect on the lower delay condition but not in the high delay condition."
"""

Greger Wikstrand, Lennart Schedin and Fredrik Elg [9] gave three
hypotheses before they did their Pong game experiment in a simulated
mobile phone: ”Delay effort”, ”De- lay action” and ”Delay
performance”. The experiment put eyes on significant effects on four
independent variables: enjoyment, mental effort, net distance and
paddle move- ---


Avango is a framework for building distributed virtual reality applications. It provides a field/fieldcontainer based application layer similar to VRML. Within this layer a scene graph, based on OpenGL Performer, input sensors, and output actuators are implemented as runtime loadable modules (or plugins). A network layer provides automatic replication/distribution of the application graph using a reliable multi-cast system. Applications in Avango are written in Scheme and run in the scripting layer. The scripting layer provides complete access to fieldcontainers and their fields; this way distributed collaborative scenarios as well as render-distributed applications (or even both at the same time) are supported. Avango was originally developed at the VR group at GMD, now Virtual Environments Group at Fraunhofer IAIS and was open-sourced in 2004. An in-depth description can be found in here.

* a publication:     Improving the AVANGO VR/AR Framework — Lessons Learned Download, presented at the  5. GI VR/AR workshop. The slides Download are also available. 
http://www.avango.org/raw-attachment/wiki/Res/Improving_the_AVANGO_VR-AR_Framework--Lessons_Learned.pdf

* http://www.avango.org/wiki/Concepts
Avango concepts seem quite similar to tundra - 'fields' is a 
bit like our attrs, are autoserialized etc., and there are 
connections which are perhaps similar to qt signal conns .. the 
example there is a proximity sensor

---

Pong with a multiplayer Flash platform:
multiplayer pong example & tutorial
http://www.unionplatform.com/?page_id=1229

"Union Pong consists of a server-side 
room module written in Java, and a Flash client-side application written in pure ActionScript with Union's Reactor 
framework. The room module is responsible for controlling the game's flow, scoring, and physics simulation." jne
- client attribuutteja näemmä settailee
-  näemmä aika paljon pitää tuolla ite hanskailla attribuuttien muutoksien lähettelyä ja vastaanottoa



