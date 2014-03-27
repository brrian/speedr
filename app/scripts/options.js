(function() {
  'use strict';
  var $, App, Defaults, KeyCodes, User, generateKeyCombo, parseKeyCode, parseSettings, populateDefaults;

  $ = jQuery;

  User = {};

  Defaults = {
    settings: {
      fontFamily: 'EB Garamond',
      primaryTheme: 'Solarized (Light)',
      boxWidth: 500,
      boxHeight: 245,
      minimapWidth: 175,
      countdownSpeed: 1000,
      showControls: true,
      showCountdown: true,
      showMenuButton: true,
      showMinimap: true,
      showStatus: true,
      showWPM: true,
      wpm: 350,
      minimap: true,
      fontSize: 33,
      delayOnPunctuation: false,
      punctuationDelayTime: 1000,
      delayOnSentence: false,
      sentenceDelayTime: 150,
      pauseOnParagraph: true,
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
      'Ý': 'faster',
      'M': 'toggle menu'
    }
  };

  KeyCodes = {
    ' ': 'Spacebar',
    '\t': 'Tab',
    'p': 'F1',
    'q': 'F2',
    'r': 'F3',
    's': 'F4',
    't': 'F5',
    'u': 'F6',
    'v': 'F7',
    'w': 'F8',
    'x': 'F9',
    'y': 'F10',
    'z': 'F11',
    '{': 'F12',
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
    '$': 'Home',
    '#': 'End',
    '!': 'PgUp',
    '"': 'PgDn',
    '.': 'Del',
    '&': '\u2191',
    '(': '\u2193',
    '%': '\u2190',
    '\'': '\u2192',
    'o': 'Num /',
    'j': 'Num *',
    'm': 'Num -',
    'k': 'Num +',
    'n': 'Num .',
    '`': 'Num 0',
    'a': 'Num 1',
    'b': 'Num 2',
    'c': 'Num 3',
    'd': 'Num 4',
    'e': 'Num 5',
    'f': 'Num 6',
    'g': 'Num 7',
    'h': 'Num 8',
    'i': 'Num 9'
  };

  App = {};

  populateDefaults = function() {
    var action, binding, bindingContainer, element, key, keys, setting, type, value, _ref, _ref1, _results;
    _ref = Defaults.settings;
    for (setting in _ref) {
      value = _ref[setting];
      type = typeof value;
      switch (type) {
        case 'number':
          $('input[name=' + setting + ']').val(value);
          break;
        case 'boolean':
          $('input[name=' + setting + ']').prop('checked', value);
          break;
        case 'string':
          $('input[name=' + setting + '][value="' + value + '"]').prop('checked', true);
      }
    }
    _ref1 = Defaults.bindings;
    _results = [];
    for (binding in _ref1) {
      action = _ref1[binding];
      element = $('.js-binding-' + action.replace(' ', '-'));
      bindingContainer = element.find('.binding');
      keys = binding.split('+');
      element.attr('data-binding', binding);
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          bindingContainer.removeClass('binding-text binding-text-empty');
          _results1.push($('<span class="keyboard-key">' + parseKeyCode(key) + '</span>').appendTo(bindingContainer));
        }
        return _results1;
      })());
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

  parseKeyCode = function(key, keyCodes) {
    var keyChar;
    keyCodes = keyCodes || KeyCodes;
    keyChar = keyCodes.hasOwnProperty(key) ? keyCodes[key] : key;
    return keyChar.charAt(0).toUpperCase() + keyChar.slice(1);
  };

  parseSettings = function() {
    var settings;
    settings = {};
    $('.settings-section').find('input').each(function() {
      var setting, type, value;
      type = $(this).attr('type');
      setting = $(this).attr('name');
      switch (type) {
        case 'text':
          if ($(this).val()) {
            value = parseInt($(this).val(), 10);
          }
          break;
        case 'radio':
          if ($(this).prop('checked')) {
            value = $(this).val();
          }
          break;
        case 'checkbox':
          value = $(this).prop('checked');
      }
      if (value !== void 0) {
        settings[setting] = value;
      }
    });
    return User.settings = settings;
  };

  $('.js-edit').click(function() {
    var binding, bindingGroup;
    bindingGroup = $(this).parents('.binding-group');
    binding = bindingGroup.find('.binding');
    binding.removeClass('binding-text-empty').addClass('binding-text binding-text-waiting').empty();
    return $(window).on('keyup', function(event) {
      var key, keyBinding, keys, _i, _len, _results;
      keyBinding = generateKeyCombo(event);
      keys = keyBinding.split('+');
      bindingGroup.attr('data-binding', keyBinding);
      binding.removeClass('binding-text binding-text-empty');
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        _results.push($('<span class="keyboard-key">' + parseKeyCode(key) + '</span>').appendTo(binding));
      }
      return _results;
    });
  });

  $('.js-clear').click(function() {
    var binding, bindingGroup;
    bindingGroup = $(this).parents('.binding-group');
    binding = bindingGroup.find('.binding');
    bindingGroup.attr('data-binding', null);
    return binding.removeClass('binding-text-waiting').addClass('binding-text binding-text-empty').empty();
  });

  $('#js-save-settings').click(function() {
    parseSettings();
    return console.log(User.settings);
  });

  populateDefaults();

}).call(this);
