========================================================================
Lessons learned from using a networked entity system in game development
========================================================================

Abstract
========

In this work we analyze the usage of a previously presented networked
entity system for developing networked games. The source codes of the
example cases are studied to observe the entity system usage in
practice. The main goal is to evaluate the entity system on a
conceptual level: does it succeed to provide a productive API for
networked game development? What enhancements and supporting
functionality could further aid application programming? (XXX NOTE:
put the answers / conclusions to here when they exist, questions
perhaps to introduction?)

The entity system is implemented in the open source Tundra SDK which
is used in the evaluation. Observations from game codes are divided
into conceptual level entity system remarks, and issues related to the
concrete particular implementation in Tundra currently.

Introduction
============

Networked application programming is generally more complex than
standalone software development. The developer typically needs to deal
with additional concepts, such as connections, and error handling and
even conflicting situations in the distributed execution. Application
programming interface (API) (ref stated along lines of: 'information
hiding is' .. the basic thing in lib/api design)

An entity system for networked application development has been put
forth in [Alatalo2011]. This article draws lessons learned from how
the system has been put to practice in a few different game
development projects. The analysis is done by studying the source
codes of the games, and by describing issues encountered in the
development.

How can a conceptual design of an entity system be really evaluated?
How can we know whether and how well a platform supports actual
networked game development? These are not easy questions, but the
answers would really help us concretely in game and platform
development. We do not claim to provide final answers here. The area
of software and API complexity analysis has however made interesting
progress recently [TLS paper, the others too?]. (XXX are we lame and:
after the initial qualitative ad-hoc analysis here, we review
possibilities for more analysis in the future with some of the metrics
proposed in the literature -- or can we rock and already apply the
techniques here?)

The rest of the article is organized as follows: First we give a brief
overview of the networked entity system in question, and of the
implementation of it in the Tundra SDK. (also related reseach
otherwise -- what exactly here, api analysis techniques? networked
programming libs? alternative models too such as the messaging in
sirikata?). Then a set of example projects are studied. (and again say
but briefly how the analysis is done). Finally, conclusions are drawn
from the observations both to evaluate the conceptual level entity
model, and to identify possible improvements and desireable support
functionality to be developed in the surrounding platform.

Background and related work
===========================

- entity system desc (copy-paste from original draft, short, refer to IEEE IC)
 * nice new diagram perhap, to summarize ECA+A

- what is there besides entities in the Tundra API -- and what is
  Tundra overall (again hopefully copy-paste from 1st draft)

- other platforms and analysis?

- of software complexity and api analysis research, techniques, metrix
 * can we apply here, what and how?

Tundra game projects dissected
==============================

- pong and chesapeake / plankton case still
 * concepts of local/remote
   - physics authorativity in Pong
   - the whole net load avoiding, described with the diag in plankton case
- circus -- what about it? there is gameobject.js and gamestate.js
- mixed reality city game, with websockets too
  * an example where the extensibility seems to work (Q: is there
    state sync, what does 'addPolice' action actually do etc? - how is
    the Graffity info in the system?
- others?

Results
=======

...

References
==========

...

