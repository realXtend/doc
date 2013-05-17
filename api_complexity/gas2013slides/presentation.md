**Comparative API Complexity Analysis of Two Platforms for Networked Multiplayer Games using a Reference Game**

<em>

* Toni Alatalo, Erno Kuusela, Rauli Puupera, Timo Ojala
  - University of Oulu, Finland
  - Playsign Ltd., Oulu, Finland

</em>

toni@playsign.net

!

Motivation
===

* plenty of libraries for making games, networking and multiplayer games

* how does a developer know what is a good and suitable one?

* how should we develop our API in realXtend.org?

!

Idea: Surrogate Analysis
===

* let's compare implementations of the same game on different platforms

* previously done with Object Points measurements in *Sobernig et al (2012)*

* here: two pre-existing implementations of **Multiplayer Pong** (minimal case)

!

The size / scope diff is clear:

<img src="uml-tundrapong.png"/
style="position: relative;
float: left;
width: 45%;
margin: 10;
"/>

<img src="uml-unionpong.png"/
style="position: relative; 
clear: left;
width: 45%;
margin: 10;
"/>

<div style="text-align:center;">
2 vs. 13+ classes
</div>

!

SW Complexity
===

<img src="metricsdata.png"/
style="
display: block; 
margin-left: auto; 
margin-right: auto;
width: 80%;
"/>

!

refgames.org
===

* let's collect a good body of data! ..or?

* more platforms with Pong:
   * Union 2.0, Unity3D + multiplayer plugin, Unreal Engine, now.js, Google's new multiplayer support, ..

* some other game(s), more features?

* quality analysis combined?

!

Thanks!
===

<br/>

<div style="text-align:center;">

--^ [[ ~ ]] ^--(()
<br/>
... . . .. == ||

</div>

<br/>
<br/>

<div style="
text-align:right;
">

.. and do check the realXtend Tundra & WebTundra demo later.

</div>