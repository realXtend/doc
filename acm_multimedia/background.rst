Background
==========

realXtend as a project started in late 2007, with the goal of
advancing Second Life(™) style virtual world technologies in an open
source manner. Some of the main developers are small game companies,
which have simultaneously had the goal of making the platform suitable
for networked multiplayer games. The first prototype, published in
early 2008, was made by modifying the open source Second Life viewer
and the independent SL-compatible Opensimulator server. New features
included replacing the renderer with Ogre3d, and using that to bring
arbitrary meshes from modeling applications. Also we introduced a
global avatar system, so that the same avatar could be used in any
world. This initial prototype was developed further in several
releases during 2008-2009.

The next generation realXtend project started in the beginning of
2009. The purpose was to get a clean core platform with extensibility,
so that developing arbitrary applications would be well
supported. Most problematic part with the initial prototype was the
Second Life(™) viewer and protocol, which are not very
extensible. Adding new features was in some cases very difficult. On
the server side, Opensimulator has a good module system for
extensions, but when using the SL protocol, many functionalities are
hardcoded already in the protocol level. For example, that every
client connection has an avatar, and that the terrain is of a certain
kind, and there is always a sky and water. Hence we had eventually
decided to write a new viewer application from scratch. This wasn't as
big a leap as it may sound, as both the old rexviewer prototype and
the new one use the same Ogre3d graphics engine as is. That means we
would easily get the rendering, and that existing content would still
work.

As the first step, we wrote a modular c++ framework, decided to use an
extensible scene model utilizing the Entity-Component model, and
implemented basic functionality using those against the existing
protocol and servers. This resulted in first releases of the Naali(*)
viewer, between 0.0.1 in June 2009 and 0.1 in January 2010. Naali is
the Finnish word for the Artic Fox, referring to the northern origins
of the project and the aim of being the Firefox of virtual
worlds. Naali was designed to be (somewhat) protocol and server
agnostic. On the server side, the realXtend specific modifications had
been already ported to a clean add-on module, ModRex. This required
several modifications in Opensimulator core, which were made by the
same Opensim developer who was porting the features to the
module. This enables realXtend to relatively easily upgrade to new
versions of Opensimulator, as there is no extra merging work. The
combination of Opensim and ModRex is called Taiga.

However, by summer 2010 we reached the point where the difficulty of adding new, and custom, functionality to applications was the bottleneck in efficient application development on the platform. After some study of several alternatives, such as continuing the efforts to get Opensimulator core refactored to an extensible scene model, and using some existing world server, we decided to add a server module to the Naali framework. This became Tundra, which is since early 2011 how most developers work on realXtend.