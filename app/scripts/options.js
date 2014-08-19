(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  settings: {
    fontFamily: 'Open Sans Light',
    primaryTheme: 'Solarized (Light)',
    secondaryTheme: 'Solarized (Dark)',
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
    showTooltips: true,
    showContext: true,
    wpm: 350,
    wordsDisplayed: 1,
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
  themes: {
    'Solarized (Light)': {
      primaryText: '#444',
      secondaryText: '#657b83',
      boxColor: '#fdf6e3',
      borderColor: 'rgba(175, 150, 190, .2)',
      highlightColor: '#dc322f'
    },
    'Solarized (Dark)': {
      primaryText: '#93a1a1',
      secondaryText: '#657b83',
      boxColor: '#073642',
      borderColor: 'rgba(175, 150, 190, .2)',
      highlightColor: '#cb4b16'
    }
  },
  bindings: {
    ' ': 'toggle',
    '%': 'prev word',
    '\'': 'next word',
    '&': 'bigger',
    '(': 'smaller',
    'shift+&': 'more words',
    'shift+(': 'less words',
    'Q': 'close',
    'R': 'reset',
    'alt+V': 'open',
    'ctrl+%': 'prev paragraph',
    'ctrl+\'': 'next paragraph',
    'shift+%': 'prev sentence',
    'shift+\'': 'next sentence',
    'Û': 'slower',
    'Ý': 'faster',
    'M': 'toggle menu',
    'I': 'toggle theme'
  }
};



},{}],2:[function(require,module,exports){
module.exports = {
  generateKeyCombo: function(event) {
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
  },
  parseKeyCode: function(key) {
    var keyChar, keyCodes;
    keyCodes = {
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
    keyChar = keyCodes.hasOwnProperty(key) ? keyCodes[key] : key;
    return keyChar.charAt(0).toUpperCase() + keyChar.slice(1);
  }
};



},{}],3:[function(require,module,exports){
'use strict';
var $, App, Defaults, User, Utility, generateKeyCombo, generateKeyElements, keyBindingListener, keyDownNullifier, parseBindings, parseKeyCode, parseSettings, populateBindings, populateDefaults, populateSettings, removeKeyBindingListeners, showDuplicateBindings, validateBindings, validateSettings;

$ = jQuery;

Utility = require('./common/utility.coffee');

Defaults = require('./common/defaults.coffee');

User = {};

App = {};

generateKeyCombo = Utility.generateKeyCombo;

parseKeyCode = Utility.parseKeyCode;

populateDefaults = function() {
  populateSettings(Defaults.settings);
  return populateBindings(Defaults.bindings);
};

populateSettings = function(object) {
  var setting, type, value, _results;
  _results = [];
  for (setting in object) {
    value = object[setting];
    type = typeof value;
    switch (type) {
      case 'number':
        _results.push($('input[name=' + setting + ']').val(value));
        break;
      case 'boolean':
        _results.push($('input[name=' + setting + ']').prop('checked', value));
        break;
      case 'string':
        _results.push($('input[name=' + setting + '][value="' + value + '"]').prop('checked', true));
        break;
      default:
        _results.push(void 0);
    }
  }
  return _results;
};

populateBindings = function(object) {
  var action, binding, bindingContainer, element, key, keys, _results;
  _results = [];
  for (binding in object) {
    action = object[binding];
    element = $('.js-binding-' + action.replace(' ', '-'));
    bindingContainer = element.find('.binding');
    keys = binding.split('+');
    bindingContainer.empty();
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

generateKeyElements = function(keyBinding) {
  var key, keys, keysContainer, _i, _len;
  keys = keyBinding.split('+');
  keysContainer = '';
  for (_i = 0, _len = keys.length; _i < _len; _i++) {
    key = keys[_i];
    keysContainer += '<span class="keyboard-key">' + parseKeyCode(key) + '</span>';
  }
  return keysContainer;
};

keyBindingListener = function(event) {
  var binding, bindingGroup, keyBinding;
  if (!(event.keyCode === 18 || event.keyCode === 17 || event.keyCode === 16 || event.keyCode === 13 || event.keyCode === 8 || event.keyCode === 91 || event.keyCode === 93)) {
    binding = $('.binding-text-waiting');
    bindingGroup = binding.parents('.binding-group');
    keyBinding = generateKeyCombo(event);
    bindingGroup.attr('data-binding', keyBinding);
    binding.removeClass('binding-text binding-text-empty binding-text-waiting');
    binding.html(generateKeyElements(keyBinding));
    removeKeyBindingListeners();
    return validateBindings();
  }
};

keyDownNullifier = function() {
  return false;
};

removeKeyBindingListeners = function() {
  $(window).unbind('keyup', keyBindingListener);
  $(window).unbind('keydown', keyDownNullifier);
  return App.setBinding = false;
};

showDuplicateBindings = function(bindingGroups) {
  var binding, element, elements, _results;
  _results = [];
  for (binding in bindingGroups) {
    elements = bindingGroups[binding];
    if (elements.length > 1) {
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          _results1.push($(element).find('.error').text('Duplicate binding detected!'));
        }
        return _results1;
      })());
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

validateSettings = function() {
  var passes;
  passes = true;
  $('.settings-section').find('.error').empty();
  $('input[type=text]').each(function() {
    var error, value;
    value = $(this).val();
    error = $(this).siblings('.error');
    if (value.length > 0 && /^[0-9]+$/.test(value) === false) {
      console.log(error);
      error.text('Please enter a numeric value');
      passes = false;
    }
  });
  return passes;
};

validateBindings = function() {
  var bindingGroups, bindings, passes;
  bindingGroups = {};
  bindings = {};
  passes = true;
  $('.binding-group').each(function() {
    var action, binding;
    binding = $(this).attr('data-binding');
    $(this).find('.error').empty();
    if (!bindingGroups.hasOwnProperty(binding)) {
      if (binding !== void 0) {
        bindingGroups[binding] = [this];
        $(this).attr('class').match(/js-binding-(\S+)/);
        action = RegExp.$1.replace('-', ' ');
        return bindings[binding] = action;
      }
    } else {
      bindingGroups[binding].push(this);
      passes = false;
    }
  });
  showDuplicateBindings(bindingGroups);
  if (passes === true) {
    return bindings;
  } else {
    return false;
  }
};

parseBindings = function() {
  var bindings;
  bindings = validateBindings();
  if (bindings !== false) {
    return User.bindings = bindings;
  } else {
    return false;
  }
};

parseSettings = function() {
  var settings;
  if (validateSettings() === true) {
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
  } else {
    return false;
  }
};

$('.js-edit').click(function() {
  var binding, bindingGroup;
  if (App.setBinding === true) {
    removeKeyBindingListeners();
    $('.binding-text-waiting').parents('.binding-group').find('.js-clear').trigger('click');
  }
  App.setBinding = true;
  bindingGroup = $(this).parents('.binding-group');
  binding = bindingGroup.find('.binding');
  binding.removeClass('binding-text-empty').addClass('binding-text binding-text-waiting').empty();
  $(window).on('keyup', keyBindingListener);
  return $(window).on('keydown', keyDownNullifier);
});

$('.js-clear').click(function() {
  var binding, bindingGroup;
  bindingGroup = $(this).parents('.binding-group');
  binding = bindingGroup.find('.binding');
  bindingGroup.attr('data-binding', null);
  binding.removeClass('binding-text-waiting').addClass('binding-text binding-text-empty').empty();
  validateBindings();
  return $(window).unbind('keyup', keyBindingListener);
});

$('.js-default').click(function() {
  var action, binding, bindingAction, bindingGroup, bindings, keyBinding;
  bindings = Defaults.bindings;
  bindingGroup = $(this).parents('.binding-group');
  binding = bindingGroup.find('.binding');
  bindingGroup.attr('class').match(/js-binding-(\S+)/);
  action = RegExp.$1.replace('-', ' ');
  for (keyBinding in bindings) {
    bindingAction = bindings[keyBinding];
    if (bindingAction === action) {
      bindingGroup.attr('data-binding', keyBinding);
      binding.removeClass('binding-text binding-text-empty');
      binding.html(generateKeyElements(keyBinding));
    }
  }
  return validateBindings();
});

$('#js-save-settings').click(function() {
  var flashMessage, submit;
  flashMessage = $('#js-flash-message');
  submit = $(this);
  if (parseSettings() !== false && parseBindings() !== false) {
    chrome.storage.sync.set(User, function() {
      flashMessage.addClass('fade-in-out');
      return flashMessage.text('Nice! Your preferences have been saved!');
    });
  } else {
    flashMessage.addClass('fade-in-out');
    flashMessage.text('You have some errors! Try checking your settings again.');
    submit.addClass('shake');
    submit.one('webkitAnimationEnd animationend', function() {
      return submit.removeClass('shake');
    });
  }
  return flashMessage.one('webkitAnimationEnd animationend', function() {
    return flashMessage.removeClass('fade-in-out').empty();
  });
});

$('#js-restore-defaults').click(function() {
  populateDefaults();
  validateSettings();
  return validateBindings();
});

chrome.storage.sync.get(['settings', 'bindings'], function(data) {
  if (data.settings) {
    populateSettings(data.settings);
  }
  if (data.bindings) {
    return populateBindings(data.bindings);
  }
});

populateDefaults();



},{"./common/defaults.coffee":1,"./common/utility.coffee":2}]},{},[3]);