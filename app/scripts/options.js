(function() {
  var $, getSettings;

  $ = jQuery;

  getSettings = function() {
    var dfd;
    dfd = $.Deferred();
    chrome.storage.sync.get(['settings', 'bindings'], function(data) {
      return dfd.resolve(data);
    });
    return dfd.promise();
  };

  getSettings().then(function(data) {
    console.log('here is your data');
    return console.log(data);
  });

}).call(this);
