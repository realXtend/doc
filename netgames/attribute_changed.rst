17:21 < antont> .. am reading Circus's gameobject.js
17:22 < antont>             this.dynamicComponent_.SetAttribute(name, user.score);
17:22 < antont>             me.Exec(4, "ScoreChanged", id, user.score);
17:23 < antont> hm
17:23 < Stinkfist> and?
17:23 < antont> was thinking through the reason for the entity action
17:23 < antont> first i thought it was to notify that particular single client
17:23 < Stinkfist> hard to tell from that code snippet
17:24 < Stinkfist> and been a while since last looked those scripts
17:24 < antont> hm well perhaps it is actually
17:24 < Stinkfist> 4 == Peers
17:24 < antont> if the client then checks in OnScoreChanged or so if the id matches own
17:25 < antont> i think it could be done just by listening to OnAttributeChanged, but that is not tied directly to that particular attribute instance
17:26 < antont> so is a kind of a workaround
17:27 < antont> .. i wonder if user.score.Changed.connect(scoreChangeHandler) would be nice .. being able to listen a particular attribute instance directly
17:28 < antont> certainly not bad with entity-actions, but this is now thinking vs. an optional ideal case
17:28 < Stinkfist>      ///\todo In the future, provide a method of listening to a change of specific Attribute, instead of having to /// always connect to 
                   the above function and if(...)'ing if it was the change we were interested in.
17:28 < antont> right
17:28 < Stinkfist> from IComponent.h
17:28  * antont makes note
