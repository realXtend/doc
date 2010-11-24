vwrap
=====

.. raw::

   22:39  * antont is reading http://tools.ietf.org/html/draft-ietf-vwrap-foundation-00 for the article
   22:39 < antont> wrote their journal article earlier
   22:39 < antont> err, read even
   22:39 < antont> vwrap is basically orthogonal to our EC stuff
   22:40 < antont> i.e. vwrap is about authentication and trust and caps etc. and teleports etc
   22:41 < antont> there is nothing in vwrap about scenes nor the actual inworld functionality. whereas our article and tundra are only about inworld functionality (and custom UIs) and the scene model
   22:41 < antont> so we can say that ok fine vwrap is that other stuff, we can perhaps apply that, but this is for the scene :)
   22:43 < antont> this vwrap article described the SL model nicely .. so we can refer to that and say that we don't want those hardcoded in the core, and then prove with the examples that it's not necessary.. 

   http://internetmessagingtechnology.org/pubs/VWRAP-for-Virtual-Worlds-Interoperability-mic2010010073.pdf

   they said in that article that they first tried to have a generic MMOX 
   (massive multiplayer online interoperability or so) group with also MMO 
   game companies, but learned that things are so diverse that was not 
   possible to standardize
   22:45 < antont> so now vwrap focuses on SL style only
   22:46 < antont> i guess we can argue that with the rex ECA style we can have something more generic while it's still practical, and people thinking of standards can consider that
   22:46 < antont> ah and they said 'too immature to standardize', not that something more generic would be impossible to standardize later on
   22:47 < antont> but anyhow standards or not, at least we have a working practical nice thing now that can use

sirikata
========

after these very nice, recent cool articles:

[1] Daniel Horn, Ewen Cheslack-Postava, Tahir Azim, Michael J. Freedman, Philip Levis, "Scaling Virtual Worlds with a Physical Metaphor", IEEE Pervasive Computing, vol. 8, no. 3, pp. 50-54, July-Sept. 2009, doi:10.1109/MPRV.2009.54
http://www.cs.princeton.edu/~mfreed/docs/vworlds-ieee09.pdf

2] Bhupesh Chandra, Ewen Cheslack-Postava, Behram F. T. Mistree, Philip Levis, and David Gay. "Emerson: Scripting for Federated Virtual Worlds", Proceedings of the 15th International Conference on Computer Games: AI, Animation, Mobile, Interactive Multimedia, Educational & Serious Games (CGAMES 2010 USA).
http://sing.stanford.edu/pubs/cgames10.pdf

an ambitious research project with a model that targets large, scalable,
federated worlds (sirikata-scalability-article). modelled around objects 
that communicate with each other by sending messages (emersonpaper).
PhD researchers etc., years of work with no end user releases yet ..
but is maturing.

in contrast, realXtend is quite straightforward, practical, and
simple.  has not tried to find ultimate solutions to federation and
scalability, but started by adding useful features to the already
existing and working, albeit arguably fundamentally flawed in their
current form, Second Life (tm) and Opensimulator technologies. also
the next generation architecture effort, writing of the Naali
application from scratch, despite having very ambitious goals of
getting a multiprotocol, modular customizable state of the art viewer
client application, has been very pragmatic. we first implemented the
basic features against the existing servers, using the old protocol,
and released 0.1 in less than a year. all the work is done in
companies who use the technology to deliver applications to customers
and develop own products using it. since 0.2 in spring 2010, we have
released a new end user version with substantial new features after
each 3 week development sprint, and the development companies have
already used the platform to do business, while there are also users
out there building their own worlds.

realXtend work so far in general, and this article accordingly, does
not yet address scalability to large worlds or federation of services
hosted by multiple parties into a single space. instead, the focus is
somewhat orthogonal: how to make application functionality, and how
the platform arguably makes it simple now with the entity-component
mechanism. by using an analogy from the web sites, the focus is on
making it possible (and easy!) to make one web site, or even a single
web page, that works well -- not about making distributed systems
where all the web servers in the world can potentially talk with each
other in a large seamless space. this is not to say that large worlds
or federation and trust mechanisms are not of interest, just that we
have started from the opposite end: enabling making single standalone
applications on servers, and a generic client application, comparable
with a web browser, that can be used to separately connect and run any
of these services. we are already busy with writing minigames and
applications using the technology described here, both as open source
examples and projects, and in proprietary projects in the
companies. this potentially leads to contributions to standard
processes and to service architectures, at least by giving real world
applications which can be used as requirements to analyze suitability
of new platforms.

(another try, repeating the beginnig :) sirikata / meru apps modelled
around object hosts, which run objects in whatever way they want, and
a messaging system for the objects to talk with each other. realxtend
apps syntensity style single app code for client-server apps, where
the same code partly ran in both, other parts only in the server or
clients. a generic mechanism provided for having the data, which is
then automatically synchronized and persisted -- applications don't
typically need to invent their own messaging for just the data. a
simple entity-action mechanism, which perhaps is very similar to the
messaging in Sirikata / Emerson -- this is something to be analyzed!
In talks with a Sirikata developer, the idea was that something like
the new realXtend style attribute autosync could and perhaps should be
implemented on top of the lower level Sirikata constructs as an
application level / scripting level support feature.

Naali is agnostic about the space partitioning -- we intentionally did
not start by implementing the Second Life fixed size 256m regions as
is. Currently Naali has no notion of regions. (the sirikata thing or
something else like MXP could probably be implemented ok .. hopefully
the sl multiregion thing too, and that all these could be optional in
different modules).
