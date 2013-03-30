var sampleMessage = {
    "messageURL": "https://my.backplaneserver.com/v2/message/2013-03-25T00:29:05.006Z-MQfqHSDhfx",
    "source": "http://sample.com",
    "type": "identity/login",
    "bus": "foo",
    "channel": "BRezd0sqvLQA6Nw8Mk4NiZFpxl9aEoHt",
    "sticky": "true",
    "expire": "2113-03-25T08:29:05Z"
    };

var responseFrame =
{
    "nextURL": "https://my.backplaneserver.com/v2/messages?since=2013-03-25T01:39:04.282Z-2Jm6So8s9V",
    "messages": [
        {
            "messageURL": "https://my.backplaneserver.com/v2/message/2013-03-25T01:39:04.282Z-2Jm6So8s9V",
            "source": "http://sample.com",
            "type": "identity/login",
            "bus": "foo",
            "channel": "4hwcaHefXabfNWLpbCFnx7MdH0b5U9ES",
            "sticky": "true",
            "expire": "2113-03-25T08:29:05Z"
        }
    ],
    "moreMessages": false
};

describe('Backplane', function() {
    it('check messageURL to nextURL', function() {

        var messageURL = "https://my.backplaneserver.com/v2/message/2013-03-21T22:34:01.867Z-uDuDFMjcAw";
        var nextURL = "https://my.backplaneserver.com/v2/messages?since=2013-03-21T22:34:01.867Z-uDuDFMjcAw";
        var baseURL = Backplane.normalizeURL("https://my.backplaneserver.com/v2/");
        var result = Backplane.convertMessageURLtoNextURL(messageURL, baseURL);
        expect(result).toEqual(nextURL);
    });

    it('test subscribe', function() {
        var id = Backplane.subscribe(function() {});
        // no channel yet
        expect(id).toBeFalsy();
        expect(Backplane.runRequests).toBeFalsy();
        Backplane.channelName = "foo";
        Backplane.request = jasmine.createSpy("request spy");
        id = Backplane.subscribe(function() {});
        expect(Backplane.request).toHaveBeenCalled();
        expect(id).toBeGreaterThan(0);
        expect(Backplane.runRequests).toBeTruthy();
    });


    it('test getMessages', function() {
        var localStorageFake = {};
        Storage.prototype.setItem = function(key, value) {
            localStorageFake[key] = value;
        }
        Storage.prototype.getItem = function(key) {
            console.info(key);
            console.info(localStorageFake[key]);
            return localStorageFake[key];
        }
        Storage.prototype.removeItem = function(key) {
            delete localStorageFake[key];
        }
        Backplane.invalidateCache();
        var messages = Backplane.getCachedMessages();
        expect(messages.length).toEqual(0);
        Backplane.addMessageToLongTermCache(sampleMessage);
        messages = Backplane.getCachedMessages();
        expect(messages.length).toEqual(1);
        // putMessage should be idempotent
        Backplane.addMessageToLongTermCache(sampleMessage);
        messages = Backplane.getCachedMessages();
        expect(messages.length).toEqual(1);

        Backplane.invalidateCache();
    });

    it('test response', function() {
        Backplane.request = jasmine.createSpy("request spy");
        Backplane.invalidateCache();
        Backplane.response(responseFrame);
        var messages = Backplane.getCachedMessages();
        expect(messages.length).toEqual(1);

    });
   
    it('test cache sync', function() {
        Backplane.invalidateCache();
        Backplane.addMessageToLongTermCache(sampleMessage);
        Backplane.syncMemoryCache();
        messages = Backplane.getCachedMessages();
        expect(messages.length).toEqual(Backplane.memoryCachedMessagesIndex.length);
    });

    it('test subscribe/unsubscribe', function() {
       Backplane.subscribers={};
       var id = Backplane.subscribe(function() {});
       expect(Backplane.checkSubscribers()).toEqual(true);
       Backplane.unsubscribe(id);
       expect(Backplane.checkSubscribers()).toEqual(false);
    });

});

