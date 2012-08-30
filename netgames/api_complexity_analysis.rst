===============================================
A comparison of networked game development APIs
===============================================

.. |date| date::
.. |time| date:: %H:%M

.. rubric::
   This document was generated on |date| at |time|.

Networked game programming is complex compared to single player
games. Several libraries and platforms exist to ease the
development. In this exploratory study, we propose a technique for
evaluating how much a networked game development platform succeeds in
hiding complexity. We apply Sneed's Object-Points (OP) analysis to two
pre-existing implementations of the same minimal networked multiplayer
game: Pong. The OP technique succesfully illustrates the different
amounts of complexity the developer has to manage on the two
alternative platforms. We have automated the source-code based
analysis process, and suggest using it both for longitudal studies of
API development and for comparing alternative API approaches.

Introduction
============

Higher level abstractions in software are a common way to attempt to
ease application development. Regarding networking, libraries exist to
simplify managing connections and messaging. On a even higher level,
distributed object systems automate remote calls and data
synchronization. For an application developer, these systems are
provided as a set of abstractions forming the application development
interface (API).

It has been noted how making good APIs is hard -- and that creating a
bad one is easy [api-matters]_. Even a small quirk in an API can
accumulate to substantial problems in larger bodies of application
code. API design has a significant impact on software quality, and
increased API complexity is associated with increased software failure
rate [cmu-api_failures]_.

An entity system for networked application development has been put
forth in [Alatalo2011]. Developed in the open source Tundra SDK, it
strives to apply best practices from game engine design literature,
notably the aggregation using entity-component model. Specifically for
networking, it features attribute autosynchronization, a simple form
of transparent remote procedure calls (entity actions) and efficient
customized movement messages with inter- and extrapolation logic (dead
reckoning). The purpose of the abstract entity model, and the whole
concrete platform, is to make multiplayer game development easy and
productive. The goal in this study is to evaluate whether and how the
Tundra API, and with it a a few common practices in modern game and
networking libraries, succeed in that.

How can a conceptual design of an entity system be really evaluated?
How can we know how well a platform supports actual networked game
development? These are not easy questions, but the answers would
really help us concretely in game and platform development. We do not
claim to provide final answers to all of it here. The area of software
and API complexity analysis has however made interesting progress
recently [api-complexity-analysis]_ [cmu-api_failures]_. By applying a
software complexity analysis technique, we investigate one particular
aspect of the quality of networked application platforms: the API
complexity for a networked game developer.

We analyze API complexity by borrowing an approach from a previous
study in a slightly different field. We conduct a comparative study of
two alternative APIs for networked game development by analyzing the
complexity of the same game implemented on the two platforms. The game
is Pong, which is proposed as a minimal hello-world style example of a
multiplayer game.

The article is organized as follows: Next, we provide background
information on API complexity research, the selected game case and the
alternative networked game development platforms. Then the conducting
and the results of the Object-Points analysis is presented. Finally,
results are discussed both to evaluate the applicability of the
analysis method, and in light of explaining factors from the APIs.

.. (the point about leakages only in discussion? or somehow here too
   still? was:) The purpose is to identify leakage points in the
   abstractions in that entity system and propose areas for
   improvement.

Background
==========

The research methodology - of API complexity research
-----------------------------------------------------

Recently, software complexity analysis techniques have been applied to
statistical (quantitative) studies of API
complexity. [cmu-api_failures]_ studies 2 large corporate software
projects and 9 open source projects and finds a link between API
complexity and increases in failure proneness of the software (bug
reports from the field). The masses of source code are quantified with
measures such as API size and dispersion. Building on existing work,
API complexity is calculated simply from the number of public methods
and attributes. In the discussion it is noted how this is severely
limited: for example, it fails to take into account pre- and
post-invocation assumptions of the API and possibly required sequences
of invocation [cmu-api_failures]_.

We do not have external statistics data from hours used for
development or reported software failures of games to study. Also
simplistic measures, suitable for analyzing large bodies of source
code, would miss the subtle issues which raise in networked
programming on a framework which attempts to hide the intricacies of
networking from the application developer. It would be interesting to
organize an experiment where a number of test teams develop the same
networked game on alternative platforms, from the same specifications,
and the development time and number of mistakes would be
analyzed. That is however out of the scope here.

In a different approach, a study of 4 alternative implementations, on
different frameworks, of the same application uses Object-Points (OP)
analysis to quantify the code bases for the comparison
[api-complexity-analysis]_. OP has originally been developed for
estimating development effort, but there the authors adopt it to
calculate the complexity of existing software for complexity
comparisons. Number of classes, their members and operation calls are
counted and assigned adjustment weights in the
calculation. Intermediate UML models are used as the data source which
allows comparing programs in different languages
[api-complexity-analysis]_. This kind of fine grained OP analysis is
applicable for our purposes here. It does not capture all the elements
of API complexity, but gives useful metrics for
comparisons. Importantly, as is also noted in the earlier API
complexity study, the Sneed measure allows direct tracking from
indicator values to program structures
[api-complexity-analysis]_. This is elemental for the purposes of API
evaluation and design -- for example if many codebases get a high
proportion of their complexity value due to a specific part of the
API, it can then be examined qualitatively.


The game of Pong
----------------

We propose using Pong as a minimal networked multiplayer game. It is
tiny in functionality, but still demonstrates key issues with
networking and games with the combination of the clients controlling
their own paddles and the ball bouncing in the shared space. Pong has
been used in networked game research earlier, recently in an
interesting study of latency compensation techniques
[pong-ping]_. Also even a minimal game suffices to reveal the amount
of software needed for all the basics: establishing connections,
handling players joining in and dropping out, and just getting the
networked software up and running.

For further studies, devising a set of different kind of small games,
and perhaps some larger sufficiently complex game, would really allow
rich comparative API analysis.

Platforms: realXtend Tundra SDK and Union Platform
--------------------------------------------------

For this initial study, we selected two relatively high-level
networked game platforms: realXtend Tundra SDK (open source) and the
Union Platform (closed source proprietary). They bear several key
similarities and differences which are interesting for the study:

Both Tundra and Union are specifically for networking, and expose it
to the developer on an abstract application level. That is, the games
do not know anything about sockets or network hosts. Instead, an
abstract container object is provided (Room in Union, Scene in
Tundra). Application logic listens to events from the container, for
example when a new client joins the shared session/space.

Also, both platforms provide an automated mechanism for synchronizing
state over the network. The shared state is in special attributes
(objects of type Attribute), which are in the container (in Union
directly in the Room object, in Tundra in entities in the Scene). The
attributes are automatically shared among all the participants, and
provide events for interested parties to get notified of changes. This
way it is simple to for example set the game score points on the
server, and show it in the GUI in clients.

However, there is one fundamental difference in the platforms and how
they are used in the Pong examples studied here. TundraPong is a
script running on the Tundra platform. UnionPong is a new client
application, to which the networking has been added by using Union's
Reaktor Flash library. The Tundra game utilizes a complete static
scene datafile where the game logic just starts moving objects
around. It runs on an existing client-server system, and utilizes
several default components from the platform: notably all the data for
the appearance and spatial instancing. In contrast, UnionPong not only
has code to create the appearance of the game court (as it is called
in Court.as), but also to define what data is required for a spatial
moving object (PongObject has x, y, direction, speed, width and
height). Tundra, again, has the position in the builtin predefined
Placeable component and the size and shape information for collisions,
and the speed vector for movement, in the physics module's Rigidbody
component. Also with networking there is a great difference: OnionPong
sends own custom movement messages for all the movement, and has also
custom server side code to do ball bouncing, whereas on Tundra the
default movement replication and physics collisions are used.

So it is clear at the start that UnionPong is more complex, due to
having much more of the implementation in the game/application
code. The analysis is still interesting as it helps to answer the
questions at hand: a) how much do the alternative APIs manage to hide
complexity and b) how well does the selected analysis technique apply
to networked game API evaluation.

For more results, at least these two additional Pong implementations
should be added to the analysis in future work: 

1. An alternative TundraPong style game where the defaults from an
underlying platform are used to the fullest, for example with the
Unreal engine.

2. A version made with a different networked programming paradigm,
such as the Emerson language which is a Javascript variant by the
Sirikata project for networked applications, without attribute
autosynchronization but using messaging exclusively instead
[sirikata-scripting]_.

The analysis here is limited to the two platforms simply because we do
not have more implementations (Pong source codes) to study yet. The
Tundra one was initiated by the author (only the scene and trivial
computer opponent logic as a test), and later completed by an
independent developer (he made all the networking and game control
code). The Union one we found with an Internet search.


Application of Object-Point analysis
====================================

The chosen Sneed's Object-Point (OP) analysis was conducted by
automating the collection of most of the key data to derive the
variables in the equation. We apply the technique following what has
been used for API complexity analysis before in
[api-complexity-analysis]_

To read the *static class data* for the **Class Points** (CP), we
utilize existing source code parsing and annotation systems in API
documentation tools. The first alternative implementations of a
minimal networked game on different modern high-level APIs studied
here are written as a a) Javascript application and b) a combination
of Actionscript (as3) for the client and Java for the server
module. We developed parsers for the internal / intermediate
representation of class and method signatures of JsDoc JSON and
AsDoc XML. (The single Java class for b) server we may analyze
manually). The class information is read in a Python application to an
internal model which contains the data for the Sneed points
calculation, implemented in another module in the same Python
application.

For the *dynamic function call* information, to calculate the
**Message Points** (MP) in the overall OP analysis, we use the Closure
Javascript compiler to traverse the source code to collect function
calls and their argument counts. Basic filtering with AWK is used to
filter in the relevant information from the Closure tree. To be able
to analyze also Actionscript code, we do text processing to strip AS
extensions to the basic ECMA/Javascript (remove public/private
definitions and type declarations). A simple parser made with Python
is used to read the function call data required to calculate MPs. This
completes the automated data collection and processing developed for
the OP calculations here.

The software to run the calculations, together with the datasets used
in the analysis here, is available from
https://github.com/realXtend/doc/tree/master/netgames/tools/
(pointcounter.py is the executable, with the formula for OP = CP + MP).

TODO: add the equation + legend here

Results
=======

+-----------+--------------+---------------+
|           |              |      UnionPong|
|           |**TundraPong**|         Client|
|           |              +-----+---------+
|           |              |Full | Net     |
+-----------+--------------+-----+---------+
|Class      |              |     |         |
|Points     |       74     | 221 |   147   |
+-----------+--------------+-----+---------+
|Message    |              |     |         |
|Points     |              |     |         |
+-----------+--------------+-----+---------+
|Object     |              |     |         |
|Points     |              |     |         |
+-----------+--------------+-----+---------+

Tundra PongMultiplayer: game.js 
UnionPlatform Pong tutorial: client 14x .as3
+ UnionPong/Java/PongRoomModule.java

Only the networking code
------------------------

- Selected classes, explain the criteria.

unionpongnet = ["GameManager", "GameStates", "KeyboardController",
"PongClient", "PongObject", "RoomAttributes", "RoomMessages",
"UnionPong"]

KeyboardController is included because it is exactly what sends the
remote control messages from the player to the server (modifies
client.paddle's attributes and says client.commit()).

client 8x .as: 147.0


Discussion
==========

How should we interpret this result? There are several things to
consider, these are visited in the following: 1. validity of the
analysis technique, the automated (partial) Object-Point
analysis 2. nature, suitability and use of scripting vs. application
development libraries 3. observations of the high-level network
programming APIs studied here. 4. limitations: the many areas of
analysis outside the focus here (scalability, efficiency of the
networking etc)

1. Validity of the analysis
---------------------------

We apply Sneed's Object-Point analysis, following how it has been
adopted to API complexity evaluation in [api-complexity-analysis]_, as
closely as we could with the automated source code analysis. The
validity must thus be evaluated from two viewpoints: a) applicability
of OPs to API complexity analysis in general and b) the deviations
from the intended calculation due to limits of the analysis software.

The OP sums of the full examples have an order of magnitude
(right? XXX) sized difference in the proposed complexity of the two
implementations of the same game. Noting the aforementioned
substantial difference in the nature and scope of the implementations,
the ratio of 74:273 (XXX fix when nums update) seems correct for
codebases of 2 sizeable and 14(+1) mostly small classes respectively.

TODO: what was left out from analysis (was anything, in the end? XXX)

2. On scripting vs own client development
-----------------------------------------

TODO

- as the data points out, implementing something on an existing
  platform can be comparatively very little work

- making an own application (client) is easily powerful and
  straightforward for own custom things, however

- same existing modules/components can be used either way,
  though. still simpler when don't need to deal with application init
  and connecting etc.

- does the complexity lurk somewhere still?

3. Observations of the high-level network programming APIs
----------------------------------------------------------

The APIs under study here are very similar regarding the
networking. They both have an abstract container for the state: a Room
in Union, and a Scene in Tundra. Application can put own custom state
information as special attributes in that container, and the system
takes care of automatically synchronizing changes to that data.

Both use callbacks heavily, for example both to listen to new clients
entering the service (an event of Room in Union's Reaktor and in the
RoomModule on the Union server separately, an event of the Server core
API object in Tundra on server side) and to attribute changes coming
in over the network.

They both also allow sending simple ad-hoc custom messages, which the
Tundra version uses for game events such as informing of a victory
(with the associated data), and UnionPong uses for all networking
(also paddle and ball movements).

With this in mind, we would expect the difference in the complexity
sum derive from the scope of the implementations used in the analysis.

TODO: return to this when the numbers from network-code-only analysis are in too?!?

4. Limitations
--------------

the many areas of analysis outside the focus here (scalability,
efficiency of the networking etc)

TODO

Conclusions
===========

TODO

(We are happy and curious about using this tool for many kinds of
comparisons: longitudal studies of a single API over time, comparisons
of e.g. networking stacks when using different protocols for similar
functionality, ... or?)

Similarities and differences of using a platform as ready made client
software, on which just run scripts, vs. libraries to create own
applications, are interesting to study more. Same software components
(libraries, modules etc) can be used in both configurations -- what is
more suitable may well depend on the particular case.

(XXX Q: where does complexity lurk? should we consider the leaks here?
does Onion have something to handle them? at least had the Attribute
setting exception in the java server XXX)

References
==========

.. [api-matters] Michi Henning, API Design Matters, Communications of the ACM Vol. 52 No. 5 http://cacm.acm.org/magazines/2009/5/24646-api-design-matters/fulltext

.. [cmu-api_failures] Marcelo Cataldo1, Cleidson R.B. de Souza2 (2011). The Impact of API Complexity on Failures: An Empirical Analysis of Proprietary and Open Source Software Systems. http://reports-archive.adm.cs.cmu.edu/anon/isr2011/CMU-ISR-11-106.pdf

.. [api-complexity-analysis] Comparing Complexity of API Designs: An Exploratory Experiment on DSL-based Framework Integration. http://www.sba-research.org/wp-content/uploads/publications/gpce11.pdf

.. [pong-ping] High and Low Ping and the Game of Pong. http://www.cs.umu.se/~greger/pong.pdf

.. [sirikata-scripting] Bhupesh Chandra, Ewen Cheslack-Postava, Behram F. T. Mistree, Philip Levis, and David Gay. "Emerson: Scripting for Federated Virtual Worlds", Proceedings of the 15th International
   Conference on Computer Games: AI, Animation, Mobile, Interactive
   Multimedia, Educational & Serious Games (CGAMES 2010 USA).
   http://sing.stanford.edu/pubs/cgames10.pdf
