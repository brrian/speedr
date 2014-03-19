(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendReponse) {
    if (request.url) {
      return chrome.tabs.create({
        url: request.url
      });
    }
  });

}).call(this);
