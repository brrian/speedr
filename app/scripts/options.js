(function() {
  var $, Bindings, User, appendKeyBindings, appendUserSettings, generateKeyCombo, getSettings, parseKeyBinding, replaceWhiteSpace;

  $ = jQuery;

  User = {
    settings: {
      wpm: 350,
      minimap: true,
      fontSize: 33,
      delayOnPunctuation: false,
      punctuationDelayTime: 1000,
      delayOnSentence: false,
      sentenceDelayTime: 150,
      pauseOnParagraph: false,
      delayOnParagraph: false,
      paragraphDelayTime: 300,
      delayOnLongWords: false,
      longWordLength: 8,
      longWordDelayTime: 100
    },
    bindings: {
      'alt+v': 'open',
      'q': 'close',
      ' ': 'toggle',
      'û': 'slower',
      'ý': 'faster',
      'r': 'reset',
      '&': 'bigger',
      '(': 'smaller',
      '%': 'prev word',
      'shift+%': 'prev sentence',
      'ctrl+%': 'prev paragraph',
      '\'': 'next word',
      'shift+\'': 'next sentence',
      'ctrl+\'': 'next paragraph'
    }
  };

  Bindings = {
    ' ': 'space',
    '\t': 'tab',
    'p': 'f1',
    'q': 'f2',
    'r': 'f3',
    's': 'f4',
    't': 'f5',
    'u': 'f6',
    'v': 'f7',
    'w': 'f8',
    'x': 'f9',
    'y': 'f10',
    'z': 'f11',
    '{': 'f12',
    'À': '`',
    '½': '-',
    '»': '=',
    'Û': '[',
    'Ý': ']',
    'Ü': '\\',
    'º': ';',
    'Þ': '\'',
    '¼': ',',
    '¾': '.',
    '¿': '/',
    '$': 'home',
    '#': 'end',
    '!': 'page up',
    '"': 'page down',
    '.': 'delete',
    '&': 'up',
    '(': 'down',
    '%': 'left',
    '\'': 'right',
    'o': 'num /',
    'j': 'num *',
    'm': 'num -',
    'k': 'num +',
    'n': 'num .',
    '`': 'num 0',
    'a': 'num 1',
    'b': 'num 2',
    'c': 'num 3',
    'd': 'num 4',
    'e': 'num 5',
    'f': 'num 6',
    'g': 'num 7',
    'h': 'num 8',
    'i': 'num 9'
  };

  getSettings = function() {
    var dfd;
    dfd = $.Deferred();
    chrome.storage.sync.get(['settings', 'bindings'], function(data) {
      if (data.settings) {
        User.settings = data.settings;
      }
      if (data.bindings) {
        User.bindings = data.bindings;
      }
      return dfd.resolve();
    });
    return dfd.promise();
  };

  appendUserSettings = function() {
    var setting, value, _ref, _results;
    _ref = User.settings;
    _results = [];
    for (setting in _ref) {
      value = _ref[setting];
      if (typeof value === 'boolean') {
        _results.push($('#js-' + setting).prop('checked', value));
      } else if (typeof value === 'number') {
        _results.push($('#js-' + setting).val(value));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  replaceWhiteSpace = function(word) {
    word = word.split(' ');
    return word.join('-');
  };

  parseKeyBinding = function(binding) {
    var bindingArray, lastKey;
    bindingArray = binding.split('+');
    lastKey = bindingArray[bindingArray.length - 1];
    if (Bindings.hasOwnProperty(lastKey)) {
      bindingArray[bindingArray.length - 1] = Bindings[lastKey];
    }
    return bindingArray.join('+');
  };

  appendKeyBindings = function() {
    var action, binding, _ref, _results;
    _ref = User.bindings;
    _results = [];
    for (binding in _ref) {
      action = _ref[binding];
      action = replaceWhiteSpace(action);
      binding = parseKeyBinding(binding);
      _results.push($('#js-' + action).val(binding));
    }
    return _results;
  };

  generateKeyCombo = function(event) {
    var keyCombo;
    keyCombo = '';
    if (event.ctrlKey) {
      keyCombo += 'ctrl+';
    }
    if (event.altKey) {
      keyCombo += 'alt+';
    }
    if (event.shiftKey) {
      keyCombo += 'shift+';
    }
    return keyCombo += String.fromCharCode(event.keyCode);
  };

  getSettings().then(appendUserSettings(), appendKeyBindings());

  $('input.binding').keydown(function(event) {
    var humanKeyCombo, keyCombo;
    keyCombo = generateKeyCombo(event);
    humanKeyCombo = parseKeyBinding(keyCombo).toLowerCase();
    $(this).attr('data-binding', keyCombo).val(humanKeyCombo);
    return false;
  });

  console.log(User);

}).call(this);
