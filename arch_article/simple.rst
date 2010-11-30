======================
Worlds on Your Desktop
======================
----------------------------------------------
making rich virtual worlds as simple documents
----------------------------------------------

*What if you could open an arbitrary, visually appealing and highly
interactive virtual world quickly by just clicking a file? Edit it
locally, save changes, and publish it on the net to run as a shared
environment where anyone can log in? Add your own custom data and
functionality using familiar scripting languages? You can! Using
no-strings-attached open source software.*

.. contents::

Introduction
------------

RealXtend is an open source project aiming to speed up the development
of standards for 3d virtual worlds. The idea is to apply standards
like HTTP, Collada and XMPP and libraries such as the Ogre3d graphics
engine, Qt GUI toolkit and the Opensimulator world server to build a
generic application platform. It is a collaboration of several small
companies that utilize the base technology in different application
fields, but which coordinate the development of the common core
together. The work culminates in a new virtual world application
called Naali, the Finnish word for the arctic fox, referring to the
Finnish origins of the project and the aim to make a generic platform
for virtual worlds akin to Firefox for HTML based applications.

For users with no previous experience in virtual worlds, 3d or game
programming, the tool allows easy reuse of premade models and scripts
from libraries on the web. Any asset reference in RealXtend can be an
URL, and the Naali GUI supports simple drag&drop of 3d models from web
pages to the 3d scene. You can build your world simply in the local
application, like you can use a web browser to view HTML files and
test the functionality without needing to setup any servers. The full
scene or a selected part of it can be saved to a file, for local use
later or for sharing with others.

This is unlike Second Life where all creating happens on the servers,
the client application is only an interface to the server side
functionality. With Opensimulator people often run a SL compatible
server locally to achieve this local building [opensim-on-a-stick]_.
But as Opensim is currently SQL based it can't open documents quite as
straightforwardly, as it has to import everything to a database
first. Also with the SL viewer and OpenSim you always need to have
those two applications running, whereas Naali can run standalone as
well.

For developers the key in RealXtend, in contrast with the Second Life
viewer and vanilla Opensimulator, is the modularity and
extensibility. Naali is a modular application where essential parts
like support for different scripting languages, networking protocols,
UI elements or your own arbitrary module can be enabled/disabled
without recompiling. Also it is licensed under the permissive
BSD-style Apache license to allow e.g. game companies to ship their
own versions based on it, whereas the SL viewer used to be GPL and was
recently switched to LGPL for the newer versions. LGPL does provide
interesting possiblities now as it allows library linking -- perhaps
Naali and SL viewer can share parts in the future. But no matter what
the underlying technology is, what we propose here as a way to achieve
extensibility on virtual world platforms is a simple generic model for
scenes and applications.

Naali uses a so-called Entity-Component (EC) model for the
scenes. Entities are simply identitities, with no data nor
typing. They aggregate components, which can be of any kind and store
arbitrary data. Applications can add their own components to have the
data they need for their own functionality, the code that handles the
data being in preinstalled custom modules or in scripts loaded at
runtime as a part of the application data. The platform provides the
basic functionality for all ECs: persistence, network synchronization
among all the participants via a server and a GUI for manipulating
components and their attributes. A scene is defined by the entities it
has -- there is nothing hardcoded about them. This differs essentially
from the current Opensimulator usage when using the Second Life (SL)
protocol where the model is largely assumed and hardcoded in the
applications. In that model there always is a certain kind of a
terrain, a sky with a sun, and each client connection gets an avatar
to which the controls are mapped.

We argue that there is no need to embed assumptions about the features
of the world in the base platform and protocols. There already are
rich useful very different virtual worlds: The open source Celestia
universe simulator obviously does not have hardcoded land and sky,
when you are moving from Earth to Moon and all the way to
Andromeda. Teachers of medicine do not want anything extra around when
they build a RealXtend world to teach anatomy by putting the organs to
right places in a human body. Games typically require custom controls,
and any application benefits from being able to define the UI exactly
as fit for that putpose. To demonstrate the feasibility of a generic
approach, there is a growing set of application examples in the Naali
example scenes directory available on GitHub [naali-scenes]_. We
present two of them here to illustrate how the EC model works in
practice. First there is an implementation of a Second Life (tm) style
avatar, implemented using a set of ECs and Javascript code to run both
on the server and the clients to implement the functionality, for
example to play back the walking animation as the avatar moves. This
is achieved without the base platform nor the protocol having the
concept of an avatar. The other example is a simple presentation
application where we use custom data to share the presentation outline
for all participants, and to let the presenter control the view for
the others as the presentation proceeds.

Making of Avatars
=================

.. include:: avapp.rst

A Simple Presentation Tool
==========================

.. include:: presapp.rst

Discussion
==========

Related work
------------

We are certainly not the first to propose genericity to virtual world
base architectures. For example in the NPSNET-V work, extreme
extensibility is achieved by the whole system being built around a
minimal microkernel on which arbitrary code can be added at runtime
using the mechanisms in the Java programming language [NPSNET-V]_. A
contemporary example is the Meru architecture from the Sirikata
project, where a space server only knows the locations of the
objects. Separate object hosts, either running on the same server or
any client / peer, can run arbitrary code to implement the objects in
the federated world [sirikata-scaling]_. Messaging is used exclusively
for all object interactions [sirikata_scripting]_. The idea with the
Entity-Component mechanism here is, instead, to lessen the need to
invent own protocols for all networked application behaviour when for
simple usage can just use the automatically synchronized
attributes. In preliminary talks with some Sirikata developers we
concluded that they want to keep base level clean from such high level
functionality, but that things like the attribute autosync would be
desireable in application level support scripts. 

The aggregation, not inheritance, using EC model was adopted from game
engine literature [ec-links]_. Running

What differentiates RealXtend Naali now is the combination of relative
maturity, simplicity, power and the permissive open source license. It
is already being deployed to customers by some of the development
companies, and provides a powerful usable GUI for editing the
component data also for your own custom components. It is a quite
straightforward modular c++ application with optional Python and
Javascript support. Thanks to the Ogre3d graphics engine, it runs both
on e.g. the N900 mobile phone with OpenGL ES and on powerful PCs with
multiple video outputs with the built-in CAVE rendering support.

The document oriented approach of having worlds as files is of course
precented in 3d file format standards like VRML, X3D and Collada. The
idea with the RealXtend files is to not specify the contents of the
files, but they are only a mechanism for the applications to put the
component data that they need. An essential element are the script
references that implement the functionality of the applications,
similar to how HTML documents have Javascript references. But also
this is not specified in the file format, it is just how the bundled
Script component works. For static content, we support using
e.g. Collada assets directly. (W.I.P NOTE: check how x3d and friends
do scripting).

Status of implementations
-------------------------

The generic Entity-Component approach was proposed to Opensimulator
core and accepted as the plan already in December 2009
[adam-ecplan]_. The implementation is however still in very early
stages, only the first steps have been taken to allow refactoring the
framework be generalized and the features built with ECs in optional
modules. It can be used, however, with the Naali client application
both when running against Opensim using the RealXtend add-on module
(the combination of opensim+modrex is called Taiga). This works in a
limited fashion, as the Second Life protocol and OpenSim internals
still assume the hardcoded SL model, but you can still add arbitrary
client side functionality and have the data automatically stored and
synchronized over the net.

The generic application platform works currently fully when using the
so called Tundra server, which a simple server module added to Naali
itself. This allows Naali to run as standalone for local authoring, or
for single user applications, but also for using it as a server to
host worlds on the net instead of using Opensimulator. With Tundra
LLUDP is no longer used, but all basic functionality is achieved with
the generic EC synchronization. For the transport layer, we are using
a new protocol called kNet which can run either on top of UDP or
TCP. kNet is similar to eNet but performed better in tests with
regards to flow control. The Tundra server lacks many basic features
and may never get some of the advanced Opensimulator features, like
running untrusted user authored scripts and combining multiple regions
to form a large grid. Tundra is however is already useful for local
authoring and deploying applications like simple games to production
use. And it serves as an example of how a generic approach to allow
virtual worlds functionality can be simple yet practical. We hope this
is taken into consideration in upcoming standardization processes, for
example if VWRAP proceeds to address in-world scene functionality.

References
==========

[opensim-on-a-stick] http://becunningandfulloftricks.com/2010/10/07/a-virtual-world-in-my-hands-running-opensim-and-imprudence-on-a-usb-key/
[naali-scenes] https://github.com/realXtend/naali/blob/tundra/bin/scenes/
[adam-ecplan] 
