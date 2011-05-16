realXtend and the web
=====================

realXtend uses web technologies extensively: http is typically used
for static data transfer (3d models, textures images etc), the default
startup GUI is a web page, and web pages can be added and used
interactively in shared sessions within the 3d worlds. The new viewer
GUI looks like a browser, and even works so that you can add new
browser tabs where use html+js pages normally. This is easy thanks to
the integrated WebKit in Qt.

We have also made an experimental WebGL + WebSockets client, called
WebNaali. It does rudimentary Tundra Entity-Component synchronization,
the reference avatar applications works with it.
