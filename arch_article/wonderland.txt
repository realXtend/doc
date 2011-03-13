OpenWonderland
==============

OpenWonderland (OWL) and realXtend are architecturally remarkably
similar. Both OWL and Naali are modular applications where all virtual
worlds functionality such as avatars and voice are implemented in
modules. OWL also has a similar mechanism ti the entity-components
described in this article: so called capabilities.

In Wonderland a capability is something that can be attached to a
object in the scene, such as making it a sit target or a cone of
silence for voice usage. Modules can add new capabilities, and contain
code both for client and server side execution. On the client they
typically implement a custom GUI for managing that capability in the
capabilities editor. There are small differences in the
implementations, for example in Naali there is the automatic property
editor for ECs so that implementing a GUI for a new component is often
not needed. Also, to our knowledge, there is no automatic attribute
synchronization but modules implement their own messaging. (NOTE: not
really known yet).

Biggest differences of OWL and realXtend are in the implementation
technologies. OWL is fully written in Java, including the core and the
rendering engine used (jMonkeyEngine, similar to Ogre3d but written in
Java). realXtend core is C++ and the main libraries used (Ogre3d, Qt)
are c++ as well. This may result in performance differences: Ogre3d
can render quite complex and graphically rich scenes, whereas at least
the current OWL scenes are relatively bare (and in my test yet got FPS
hit easily). jME is a capable engine though and JVMs with JIT have
gotten fast so there may not be a large difference in the end. In OWL
additional functionality is added in Java written modules, which can
introduce new capabilities, plugins and web services. Naali/Tundra
also support additional modules in c++, but typically applications are
implemented in Python or Javascript instead. OWL also has Javascript
scripting. OWL seems to be limited to TCP also for the realtime
interactions, whereas realXtend can use either LLUDP or the kNet UDP
too. A possible conclusion is that OWL is more suitable for slow paced
collaboration applications, which seem to be in their focus, whereas
reX can also support more graphically rich environments sometimes
needed in e.g. architecture visualization, and high paced action for
games. Naali also has a CAVE rendering module with which a powerful PC
can render several different views for a multidisplay or projection
setup.

On a high level, however, the designs seem to match so well that some
sort of collaboration may be useful in the future. For example only
sharing information about what kind of ECs / capabilities there are,
and possibly designing new ones together. It might be even feasible to
standardize the Javascript level APIs so that there would be scripting
level interoperability. For example an AI script to make a character
walk to the given sittarget and sit down there correctly is needed for
both now (OWL has sittargets and walking to the target, but no
obstacle avoidance yet -- reX has sittargets in TODO and the initial
idea of implementing them seemed to be close to what the OWL
capability has). Also camera movement logic codes for different points
of view, obstacle avoidance etc. don't need to use much from the
underlying framework, but can be quite complex in themselves for
polished functionality (smooth animations etc). If hew ave matching
data in reX ECs and OWL capabilities, and e.g. wrapper JS libraries
that expose the underlying core APIs for e.g. recasting and
manipulating the scene, scripts written for the common API can work in
these two environments and possibly others.

The most direct possibilities of unification and collaboration are in
support services, like authentication and asset storages. There an
interoperability experiment was already made in late 2010, initiated
by the Immersive Education standardization / interoperability effors
and conducted by realXtend and OpenWonderland developers. In this
experiment OWL asset storage was used to host assets that were loaded
to the Naali viewer. This is simple when just using a normal web
server with http for static data. The whole issue of managing assets
etc. is easily complex, though, so collaborating there to avoid
duplicated work can easily make sense. We have also talked about
common authentication and user profile services.
