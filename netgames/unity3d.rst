just links and notes about networking with unity3d

http://www.pepwuper.com/unity3d-multiplayer-game-development-unity-networking-photon-and-ulink-comparison/

""" 
uLink is more similar to Unity Networking than to Photon. It is
also fully integrated into Unity and has Network View components,
State Synchronization and Remote Procedure Calls. In fact, it is
possible to automatically replace Unity Networking with uLink using
uLink converter – that’s how similar the two technologies are. So,
what’s the difference?

uLink is supposed to be much more scalable and optimized than Unity
Networking.  certain built in concepts make multiplayer development
easier, for example:

        in uLink settings there is a checkbox “Authoritative server”. If the checkbox is clicked, uLink refuses to execute RPCs or sync states between the clients. Clients can only call RPCs on the server and only the server can sync object states to the clients.

        Game Objects can be instantiated on all clients and on the server with a single call, but different prefabs can be used depending on where the object is instantiated. 

...
"""


