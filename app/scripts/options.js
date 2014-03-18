(function() {
  var $, Bindings, User, appendKeyBindings, appendUserSettings, generateKeyCombo, parseKeyBinding, replaceWhiteSpace, saveBindings, saveSettings;

  $ = jQuery;

  User = {
    settings: {
      wpm: 350,
      minimap: true,
      controls: true,
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
      ' ': 'toggle',
      '%': 'prev word',
      '&': 'bigger',
      '\'': 'next word',
      '(': 'smaller',
      'Q': 'close',
      'R': 'reset',
      'alt+V': 'open',
      'ctrl+%': 'prev paragraph',
      'ctrl+\'': 'next paragraph',
      'shift+%': 'prev sentence',
      'shift+\'': 'next sentence',
      'Û': 'slower',
      'Ý': 'faster'
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
    '\u00C0': '`',
    '\u00BD': '-',
    '\u00BB': '=',
    '\u00DB': '[',
    '\u00DD': ']',
    '\u00DC': '\\',
    '\u00BA': ';',
    '\u00DE': '\'',
    '\u00BC': ',',
    '\u00BE': '.',
    '\u00BF': '/',
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
    var action, binding, humanBinding, _ref, _results;
    _ref = User.bindings;
    _results = [];
    for (binding in _ref) {
      action = _ref[binding];
      action = replaceWhiteSpace(action);
      humanBinding = parseKeyBinding(binding).toLowerCase();
      _results.push($('#js-' + action).attr('data-binding', binding).val(humanBinding));
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

  saveSettings = function() {
    var newSettings;
    newSettings = {};
    $('.settings-section').find('input').each(function() {
      var setting, type;
      setting = $(this).attr('id').replace('js-', '');
      type = $(this).attr('type');
      if (type === 'text') {
        newSettings[setting] = parseInt($(this).val(), 10);
      } else if (type === 'checkbox') {
        newSettings[setting] = $(this).prop('checked');
      }
    });
    return newSettings;
  };

  saveBindings = function() {
    var newBindings;
    newBindings = {};
    $('.bindings-section').find('input').each(function() {
      var binding, setting;
      setting = $(this).attr('id').replace('js-', '').replace('-', ' ');
      binding = $(this).attr('data-binding');
      newBindings[binding] = setting;
    });
    return newBindings;
  };

  chrome.storage.sync.get(['settings', 'bindings'], function(data) {
    if (data.settings) {
      User.settings = data.settings;
    }
    if (data.bindings) {
      User.bindings = data.bindings;
    }
    appendUserSettings();
    return appendKeyBindings();
  });

  $('input.binding').keydown(function(event) {
    var humanKeyCombo, keyCombo;
    keyCombo = generateKeyCombo(event);
    humanKeyCombo = parseKeyBinding(keyCombo).toLowerCase();
    $(this).attr('data-binding', keyCombo).val(humanKeyCombo);
    return false;
  });

  $('#js-save-settings').click(function() {
    var newSettings;
    newSettings = {
      settings: saveSettings(),
      bindings: saveBindings()
    };
    return chrome.storage.sync.set(newSettings, function() {
      return alert('Settings successfully saved!');
    });
  });

}).call(this);
