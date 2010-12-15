======================
Worlds on Your Desktop
======================
----------------------------------------------
hyperlinked virtual worlds made simple for everyone
----------------------------------------------

*RealXtend makes it possible for users to quickly create highly detailed interactive virtual worlds, and easily share it with their friends over the internet.  The system is hyper-extensible, each component of a virtual world can be mapped to a web address (URL), collaboration among users is greatly simplified and destributed how they choose.  Interactivity is easily scripted using familiar languages (javascript, python).  The project is fully open source, no-strings attached.*

(This document was generated on |date| at |time|.)

.. |date| date::
.. |time| date:: %H:%M

.. contents::

Introduction
============

RealXtend is an open source project aiming to speed up the development
of standards for 3D virtual worlds. We fully leverage open source standards including: HTTP, COLLADA, XMPP, OGRE 3D, Qt GUI, OpenSimulator, and Blender.
Begining as a collaboration of several small companies that utilize the base technology in different
application fields, but which coordinate the development of the common code base
together. This has culminated in a new virtual world application
called Naali, the Finnish word for the arctic fox, referring to the
Finnish origins of the project and the goal to make a generic platform
for virtual worlds akin to Firefox for HTML-based applications.

For users unfamiliar with creating 3d virtual worlds, or game
programming, the tool allows easy reuse of premade models and scripts
from libraries on the web. Any asset reference in realXtend can be an
URL, and the Naali GUI supports simple drag&drop of 3d models from web
pages to the 3D scene. A virtual world can be snapped together like Lego bricks, instantly viewed, its a simple and fun process for users of all ages.
Editing can be done locally, and shared any time later simply by publishing.
The entire scene can be published, or on a per-object or per-component basis.  This is in contrast to Second Life (tm) (SL) where all edits and additions happen on the
servers - the client application being no more than an interface to server side
functionality.  

Naali is a single application that can run completely standalone, and does not suffer from the pains of setting up an SQL server just to do local editing (as OpenSim users currently do).  Developers will find Naali to be highly extensible with dynamically loadable/unloadable modules.  For example, an entirely new scripting language could be loaded as a module without needing to recompile all of Naali.  Naali uses the Apache license and is permissive for businesses to create commerical software based on it.  In contrast again to the Second Life viewer which only recently allowed for limited commerical reuse (LGPL).

Under the hood, Naali uses the so-called Entity-Component (EC) model as a basis to construct scenes. (a common model in modern networked games)
Entities are simply unique identitities, with no data or typing. They aggregate components, which can be of any type and store
arbitrary data. Applications built using Naali can add their own components to have the
data they need for their own functionality; technically speaking, the code that handles the
data exists in preinstalled custom modules or in scripts loaded at
runtime as a part of the application data. 

The Naali platform provides the basic functionality for all ECs: persistence, network synchronization
among all the participants via a server and a user interface for manipulating
components and their attributes.  In addition, Naali introduces a new concept called "Entity Actions",
which are a simple form of remote procedure call (RPC). These are demonstrated in two examples later in this article.

A scene is defined by the entities it has, and there is nothing
hardcoded about them at the application level. This differs greatly from the current
OpenSimulator paradigm when using the SL protocol - where the
model is largely predefined and hardcoded within the applications. And so there always is a certain kind of a terrain, a sky with a sun,
and each client connection gets an avatar to which the controls are
mapped [VWRAP]_. We argue that there is no need to embed assumptions about the
features of the world in the base platform and protocols. There
already exists many examples that prove our point, one is the open source
Celestia universe simulator that does not have any hardcoded land or
sky.  Naali is a true platform that does not get in the way of the application developer;
they can create anything from a medical simulator for teachers, to action packed networked games - and always with a custom interface that excatly fits the application's purpose.

To demonstrate the feasibility of our generic approach, there is a
growing set of application examples in the Naali example scenes
directory available on GitHub [naali-scenes]_. We present two of them
below to illustrate how the EC model works in practice. First there is
an implementation of a SL-like Avatar, implemented using a set of ECs
and Javascript code that run both on the server and the clients.
The play-back of the Avatar walking animation is achieved without the base platform or the protocol having the concept of an Avatar at all. 
The second example is a simple presentation
application where we use custom data to share the presentation outline for
all participants, and to let the presenter control the view for the others
as the presentation proceeds.

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
for all object interactions [sirikata_scripting]_.   Naali is unique in that the Entity-Component model includes automatically synchronized attributes, and this lessens the need for developers to invent their own network protocols.

The aggregation, not inheritance, using EC model was adopted from game
engine literature [ec-links]_. Running the same Javascript code
partially both on the server and clients is basically identicaly to a
gaming oriented virtual world platform called Syntensity [syntensity]_.

What differentiates realXtend Naali now is the combination of relative
maturity, simplicity, power and the permissive open source license. It
is already deployed to customers by some of the development
companies, and provides a powerful usable GUI for editing the
component data also for your own custom components. 
The platform code base is made up of well organized C++ modules, with optional Python and
Javascript support. Thanks to the OGRE graphics engine, it is scaleable all the way from the Nokia N900 mobile phone (using OpenGL ES),
to powerful desktops that may even have multiple video outputs to utilize the built-in CAVE rendering support.

A virtual world contained by a document object model in an XML file is nothing new,
VRML, X3D, and COLLADA are good examples.
The unique concept behind the realXtend file format is to not specify the contents, 
instead the format is simply a mechanism for the applications to store the
component data that they require. An essential element of the format are the script
references that implement the functionality of the applications themselves,
similar to how HTML documents have Javascript references. But also
this is not specified in the file format, it is just how the bundled
Script component works. For static content, we support using
e.g. COLLADA assets directly. (W.I.P NOTE: check how x3d and friends
do scripting).

The realXtend platform is currently by no means a complete solution
for all the problems of virtual world architecture. Naali does not
currently address scaling at all, nor is federated content from
several possible untrusted sources supported.  Our focus has been a
modular, highly flexible, extensible system.

In the future, we look forward to continuing
collaboration with e.g. the OpenSimulator and Sirikata communities to
address the trust and scalability issues. Opensim is already used to
host large grids by numerous people, and the architecture in Sirikata
seems promising for the long run [sirikata-scaling]_.

Status of implementations
-------------------------

In December 2009, the generic Entity-Component approach was proposed to OpenSimulator
core and accepted [adam-ecplan]_. However, the implementation is still in the very early
stages, and only the first steps have been taken to allow refactoring the
framework be generalized enough so that new EC features can be loaded as optional
modules. In the mean time, a workaround using the Naali client application
both when running against Opensim using the realXtend add-on module; works in a
limited fashion; however, as the Second Life protocol and OpenSim internals
still assume the hardcoded SL model, it is possible to add arbitrary
client side functionality and have the data automatically stored and
synchronized over the internet. (the combination of opensim+modrex is called Taiga)

Currently, the generic application platform fully works when using the
"Tundra server", which a simple server module added to Naali
itself. This allows Naali to run as standalone application for local authoring, or
for single user applications, but also for using it as a server to
host worlds on the net instead of using OpenSimulator. With Tundra
LLUDP is no longer used, and all basic functionality is achieved with
the generic EC synchronization. For the transport layer, we are using
a new protocol called kNet, which can run either on top of UDP or
TCP. kNet is similar to eNet but performed better in tests with
regards to flow control. The Tundra server lacks many basic features
and may never get some of the advanced OpenSimulator features, like
running untrusted user authored scripts and combining multiple regions
to form a large grid. Tundra is however is already useful for local
authoring and deploying applications like simple games to production
use. Finnaly, it serves as an example of how the generic approach to
virtual world functionality can be simple yet practical. We hope this
is taken into consideration in upcoming standardization processes, for
example if VWRAP proceeds to address in-world scene functionality.

References
==========

.. [NPSNET-V] Andrzej Kapolka, Don McGregor, and Michael Capps. 2002. A unified component framework for dynamically extensible virtual environments. In Proceedings of the 4th international conference on Collaborative virtual environments (CVE '02). ACM, New York, NY, USA, 64-71. DOI=10.1145/571878.571889 http://doi.acm.org/10.1145/571878.571889 

.. [opensim-on-a-stick] http://becunningandfulloftricks.com/2010/10/07/ a-virtual-world-in-my-hands-running-opensim-and-imprudence-on-a-usb-key/

.. [naali-scenes] https://github.com/realXtend/naali/blob/tundra/bin/scenes/

.. [tundra-avatar] Application XML and usage info at https://github.com/realXtend/naali/tree/tundra/bin/scenes/Avatar/ , Javascript sources in https://github.com/realXtend/naali/tree/tundra/bin/jsmodules/avatar/

.. [adam-ecplan] Adam Frisby on Opensim-dev, Refactoring SceneObjectGroup - Introducing Components. The plan PDF is attached in the email, http://lists.berlios.de/pipermail/opensim-dev/2009-December/008098.html

.. [VWRAP] Joshua Bell, Morgaine Dinova, David Levine, "VWRAP for Virtual Worlds Interoperability," IEEE Internet Computing, pp. 73-77, January/February, 2010 

.. [sirikata-scaling] Daniel Horn, Ewen Cheslack-Postava, Tahir Azim, Michael J. Freedman, Philip Levis, "Scaling Virtual Worlds with a Physical Metaphor", IEEE Pervasive Computing, vol. 8, no. 3, pp. 50-54, July-Sept. 2009, doi:10.1109/MPRV.2009.54 http://www.cs.princeton.edu/~mfreed/docs/vworlds-ieee09.pdf

.. [sirikata_scripting] Bhupesh Chandra, Ewen Cheslack-Postava, Behram F. T. Mistree, Philip Levis, and David Gay. "Emerson: Scripting for Federated Virtual Worlds", Proceedings of the 15th International
   Conference on Computer Games: AI, Animation, Mobile, Interactive
   Multimedia, Educational & Serious Games (CGAMES 2010 USA).
   http://sing.stanford.edu/pubs/cgames10.pdf

.. [ec-links] Mick West, Evolve Your Hierarchy -- Refactoring Game Entities with Components http://cowboyprogramming.com/2007/01/05/evolve-your-heirachy/

.. [syntensity] http://www.syntensity.com/
