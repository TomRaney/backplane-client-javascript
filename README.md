Backplane 2 JavaScript Client (v2.0.4)
======================================

This library integrates JavaScript applications with the
[Backplane server protocol](https://github.com/janrain/janrain-backplane-2).

Quick Start
-----------

To begin interacting with a Backplane server, simply register a function to be called
once the Backplane library has completed initialization and call Backplane.init().

{code}
 Backplane(initComplete);
 Backplane.init({
    serverBaseURL: "https://my.backplaneserver.com/v2",
    busName: "foo",
    channelExpires: "",
    block: 25
  });

 function initComplete() {
    Backplane.subscribe(function() { console.info("Cool, got a message"); });

    // We can safely retrieve the channel at this point.

    var validChannelID = Backplane.getChannelID();
 }

 // Another application may decide to register a callback as well.
 Backplane(anotherCallback);

 function anotherCallback() {
    // Notice that this function was registered after the Backplane.init() call.
    // If the Backplane library is already initialized at this point, this function
    // is called immediately.

    // If an application wanted to retrieve ALL unexpired and cached messages
    // already retrieved by the library on the current channel, it would make this call.
    // This is useful if your application is not installed on every page in which Backplane
    // is installed.

    var messageHeaders = Backplane.getCachedMessages();

    // it also a good idea to register a callback function to handle new messages.

    Backplane.subscribe(myAppMessageHandler);

    // Lastly, if the application is keeping state attached to the Backplane channel, then
    // it is a good opportunity in this function body to verify that the channel has not changed.

    var validChannelID = Backplane.getChannelID();
    // ... do something with the channel ID.

    // If the Backplane channel DOES change, all init complete functions will be called again.

 }
 {code}

 TODO
 ----

 Updating library to build with Maven and unit tests...

