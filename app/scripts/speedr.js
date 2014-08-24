(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  settings: {
    fontFamily: 'Open Sans Light',
    primaryTheme: 'Speedr (Light)',
    secondaryTheme: 'Solarized (Dark)',
    boxWidth: 600,
    boxHeight: 300,
    minimapWidth: 175,
    countdownSpeed: 750,
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
    punctuationDelayTime: 60,
    delayOnSentence: false,
    sentenceDelayTime: 80,
    pauseOnParagraph: false,
    delayOnParagraph: false,
    paragraphDelayTime: 100,
    delayOnLongWords: true,
    longWordLength: 9,
    longWordDelayTime: 80
  },
  themes: {
    'Speedr (Light)': {
      primaryText: '#444',
      secondaryText: '#666',
      boxColor: '#f2f0ec',
      borderColor: 'rgba(175, 150, 190, .2)',
      highlightColor: '#dc322f'
    },
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
    '\u00DB': 'slower',
    '\u00DD': 'faster',
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
window.User = require('./common/defaults.coffee');

window.App = {
  text: {
    sentences: []
  },
  utility: require('./speedr/utility.coffee'),
  parse: require('./speedr/parse.coffee'),
  speedr: require('./speedr/speedr.coffee'),
  addons: {
    controls: require('./speedr/addons/controls.coffee'),
    context: require('./speedr/addons/context.coffee'),
    countdown: require('./speedr/addons/countdown.coffee'),
    menuButton: require('./speedr/addons/menuButton.coffee'),
    minimap: require('./speedr/addons/minimap.coffee'),
    status: require('./speedr/addons/status.coffee'),
    tooltips: require('./speedr/addons/tooltips.coffee'),
    wpm: require('./speedr/addons/wpm.coffee')
  },
  actions: require('./speedr/actions.coffee'),
  chrome: require('./speedr/chrome.coffee'),
  init: function() {
    App.speedr.reset();
    App.chrome.settings.get();
    return App.chrome.extension.init();
  }
};

window.onkeydown = require('./speedr/keyDownListener.coffee');

App.init();



},{"./common/defaults.coffee":1,"./speedr/actions.coffee":4,"./speedr/addons/context.coffee":5,"./speedr/addons/controls.coffee":6,"./speedr/addons/countdown.coffee":7,"./speedr/addons/menuButton.coffee":8,"./speedr/addons/minimap.coffee":9,"./speedr/addons/status.coffee":10,"./speedr/addons/tooltips.coffee":11,"./speedr/addons/wpm.coffee":12,"./speedr/chrome.coffee":13,"./speedr/keyDownListener.coffee":14,"./speedr/parse.coffee":16,"./speedr/speedr.coffee":17,"./speedr/utility.coffee":18}],4:[function(require,module,exports){
module.exports = {
  calculateInterval: function() {
    return App.interval = 60000 / User.settings.wpm;
  },
  updateStatus: function() {
    var doc, timeLeft, totalWords, totalWpm, wordPlurality, wordsDisplayed, wordsLeft, wpm;
    doc = document;
    wpm = User.settings.wpm;
    wordsDisplayed = User.settings.wordsDisplayed;
    wordsLeft = App.text.parsed.length - App.i - 1;
    timeLeft = (wordsLeft / wpm * 60).toFixed(2);
    if (wordsDisplayed === 1) {
      totalWpm = "" + wpm + " wpm";
      totalWords = App.utility.formatNumber(wordsLeft);
    } else {
      totalWpm = "" + (wpm * wordsDisplayed) + " wpm (" + wpm + "&times;" + wordsDisplayed + ")";
      totalWords = wordsLeft !== 0 ? "~" + (App.utility.formatNumber(wordsLeft * wordsDisplayed)) : "0";
    }
    timeLeft = timeLeft === '0.00' ? '0' : "~" + timeLeft;
    wordPlurality = totalWords === '1' ? 'word' : 'words';
    doc.getElementById('js-speedr-time-left').innerHTML = timeLeft + 's @ ' + totalWpm;
    return doc.getElementById('js-speedr-words-left').innerHTML = "" + totalWords + " " + wordPlurality + " left";
  },
  updateWPM: function() {
    var wpm;
    wpm = document.getElementById('js-speedr-wpm');
    if (User.settings.wordsDisplayed === 1) {
      return wpm.innerHTML = User.settings.wpm + ' wpm';
    } else {
      return wpm.innerHTML = "" + (User.settings.wpm * User.settings.wordsDisplayed) + " wpm (" + User.settings.wpm + "&times;" + User.settings.wordsDisplayed + ")";
    }
  },
  updateCountdownBar: function() {
    var countdown, settings;
    settings = User.settings;
    countdown = document.getElementById('js-speedr-countdown-bar').offsetParent;
    return countdown.style.height = Math.ceil(settings.boxHeight / 2) - Math.ceil((settings.fontSize * 1.4 + 12) / 2) + 'px';
  },
  changeWPM: function(wpm) {
    var settings;
    settings = User.settings;
    if (settings.wpm === 0 && wpm < 0) {
      return;
    }
    User.settings.wpm = User.settings.wpm + wpm;
    this.calculateInterval();
    if (settings.showWPM) {
      this.updateWPM();
    }
    if (settings.showStatus) {
      this.updateStatus();
    }
    return App.chrome.settings.save();
  },
  changeFontSize: function(px) {
    var settings, wordContainer;
    settings = User.settings;
    if ((settings.fontSize + px) < 8) {
      return;
    }
    User.settings.fontSize = settings.fontSize + px;
    wordContainer = document.getElementById('js-speedr-word');
    wordContainer.style.fontSize = User.settings.fontSize + 'px';
    if (settings.showCountdown) {
      App.actions.updateCountdownBar();
    }
    return App.chrome.settings.save();
  },
  changeWordsDisplayed: function(words) {
    var settings;
    settings = User.settings;
    if ((settings.wordsDisplayed + words) < 1) {
      return;
    }
    if (App.pause === false) {
      App.speedr.loop.stop();
    }
    User.settings.wordsDisplayed = settings.wordsDisplayed + words;
    App.i = 0;
    App.text.parsed = [];
    App.parse.loop();
    App.speedr.showWord();
    if (settings.showWPM) {
      this.updateWPM();
    }
    if (settings.showStatus) {
      this.updateStatus();
    }
    if (settings.showMinimap) {
      if (App.scrollWatcher) {
        App.addons.minimap.updateScroll();
      }
      App.addons.minimap.updateContents();
    }
    return App.chrome.settings.save();
  },
  navigateText: function(direction, type) {
    var i, settings;
    i = App.i;
    settings = User.settings;
    if (App.pause === false) {
      App.speedr.loop.stop();
    }
    if (i === 0 && direction === 'prev') {
      return;
    }
    if (i === App.text.parsed.length - 1 && direction === 'next') {
      return;
    }
    switch (type) {
      case 'word':
        App.i = direction === 'prev' ? i - 1 : i + 1;
        break;
      case 'sentence':
        App.i = direction === 'prev' ? App.utility.findPrevOfType('sentenceStart') : App.utility.findNextOfType('sentenceStart');
        break;
      case 'paragraph':
        App.i = direction === 'prev' ? App.utility.findPrevOfType('paragraphStart') : App.utility.findNextOfType('paragraphStart');
    }
    App.speedr.showWord();
    App.wordCount = App.i;
    if (settings.showStatus) {
      App.actions.updateStatus();
    }
    if (settings.showContext && App.addons.context.activeContext) {
      document.querySelector('.speedr-context').innerText = App.text.sentences[App.text.parsed[App.i].sentenceArrayMarker];
    }
    if (settings.showMinimap) {
      App.addons.minimap.update();
      if (App.scrollWatcher) {
        return App.addons.minimap.updateScroll();
      }
    }
  },
  getWordCount: function() {
    var count;
    count = App.i - App.wordCount;
    App.wordCount = App.i;
    return App.chrome.wordCount.save(count);
  },
  toggleMenu: function() {
    var doc, toggleClass;
    doc = document;
    toggleClass = App.utility.toggleClass;
    if (User.settings.showMenuButton) {
      toggleClass(doc.getElementById('js-speedr-menu-button'), 'speedr-menu-button-active');
    }
    return toggleClass(doc.getElementById('js-speedr-menu'), 'speedr-menu-active');
  },
  toggleTheme: function() {
    var box, contents, countdownBar, currentTheme, doc, highlighted, menu, menuItem, menuItems, minimap, minimapHeight, minimapWidth, newTheme, pointer, settings, theme, word, wordContainer, wpm, _i, _len;
    doc = document;
    settings = User.settings;
    currentTheme = settings.primaryTheme;
    newTheme = settings.secondaryTheme;
    theme = User.themes[newTheme];
    box = doc.getElementById('js-speedr-box');
    box.style.color = theme.primaryText;
    box.style.backgroundColor = theme.boxColor;
    wordContainer = box.getElementsByClassName('speedr-word-container')[0];
    wordContainer.style.borderBottomColor = theme.borderColor;
    word = doc.getElementById('js-speedr-word');
    word.style.color = theme.primaryText;
    highlighted = word.getElementsByTagName('span')[0];
    if (highlighted) {
      highlighted.style.color = theme.highlightColor;
    }
    pointer = wordContainer.getElementsByClassName('speedr-pointer')[0];
    pointer.style.borderTopColor = theme.highlightColor;
    menu = doc.getElementById('js-speedr-menu');
    menuItems = menu.getElementsByTagName('li');
    for (_i = 0, _len = menuItems.length; _i < _len; _i++) {
      menuItem = menuItems[_i];
      menuItem.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';';
    }
    if (settings.showWPM === true) {
      wpm = doc.getElementById('js-speedr-wpm');
      wpm.style.backgroundColor = theme.boxColor;
    }
    if (settings.showMinimap === true) {
      minimap = doc.getElementById('js-speedr-minimap');
      minimapWidth = minimap.offsetWidth;
      minimapHeight = minimap.offsetHeight;
      minimap.style.cssText = "width: " + minimapWidth + "px; height: " + minimapHeight + "; background-color: " + theme.boxColor + "; border-left-color: " + theme.borderColor + "; box-shadow: -3px 0 0 " + theme.boxColor;
      contents = minimap.querySelector('.contents');
      contents.style.backgroundImage = "linear-gradient(to right, " + theme.secondaryText + " 50%, rgba(255, 255, 255, 0) 20%)";
    }
    if (settings.showCountdown === true) {
      countdownBar = doc.getElementById('js-speedr-countdown-bar');
      countdownBar.style.backgroundColor = theme.highlightColor;
    }
    User.settings.primaryTheme = newTheme;
    User.settings.secondaryTheme = currentTheme;
    return App.chrome.settings.save();
  }
};



},{}],5:[function(require,module,exports){
module.exports = {
  init: function() {
    var speedrWord;
    speedrWord = document.getElementById('js-speedr-word');
    speedrWord.addEventListener('mouseover', (function(_this) {
      return function() {
        if (App.pause) {
          return _this.timeout = setTimeout(function() {
            return _this.create();
          }, 600);
        }
      };
    })(this));
    return speedrWord.addEventListener('mouseout', (function(_this) {
      return function() {
        clearTimeout(_this.timeout);
        if (_this.activeContext) {
          return _this.destroy();
        }
      };
    })(this));
  },
  create: function() {
    var context, position, sentence;
    sentence = App.text.sentences[App.text.parsed[App.i].sentenceArrayMarker];
    position = document.getElementById('js-speedr-box').getBoundingClientRect();
    context = document.createElement('span');
    context.className = 'speedr-context speedr-tooltip-fly-up';
    context.innerText = sentence;
    context.style.cssText = "max-width: " + (User.settings.boxWidth * .9) + "px; bottom: " + (position.bottom + 10) + "px;";
    document.body.appendChild(context);
    this.activeContext = context;
    return App.utility.runOnceAfterAnimation(context, function() {
      return context.className = context.className.replace(' speedr-tooltip-fly-up', '');
    });
  },
  destroy: function() {
    this.activeContext.className += ' speedr-fade-out-quick';
    return App.utility.runOnceAfterAnimation(this.activeContext, (function(_this) {
      return function() {
        _this.activeContext.remove();
        return _this.activeContext = void 0;
      };
    })(this));
  }
};



},{}],6:[function(require,module,exports){
module.exports = function() {
  var action1, action2, actions, button, buttons, controlButton, controls, controlsLeft, controlsRight, doc, i, playPause, _i, _len;
  doc = document;
  controls = doc.createElement('div');
  controls.className = 'speedr-controls';
  controlsLeft = doc.createElement('div');
  controlsLeft.className = 'speedr-controls-left';
  controlsRight = doc.createElement('div');
  controlsRight.className = 'speedr-controls-right';
  buttons = ['speed', 'words', 'font', 'word', 'sentence', 'paragraph'];
  for (i = _i = 0, _len = buttons.length; _i < _len; i = ++_i) {
    button = buttons[i];
    controlButton = doc.createElement('div');
    controlButton.className = 'speedr-button';
    controlButton.innerText = button;
    actions = doc.createElement('div');
    actions.className = 'speedr-button-actions';
    action1 = doc.createElement('span');
    action1.className = 'speedr-button-action js-speedr-tooltip';
    action2 = doc.createElement('span');
    action2.className = 'speedr-button-action js-speedr-tooltip';
    switch (button) {
      case 'speed':
        action1.innerText = 'faster';
        action1.setAttribute('data-tooltip', "Increase speed" + (App.utility.getBinding('faster')));
        action1.addEventListener('click', function() {
          return App.actions.changeWPM(25);
        });
        action2.innerText = 'slower';
        action2.setAttribute('data-tooltip', "Decrease speed" + (App.utility.getBinding('slower')));
        action2.addEventListener('click', function() {
          return App.actions.changeWPM(-25);
        });
        break;
      case 'words':
        action1.innerText = 'more';
        action1.setAttribute('data-tooltip', "Show more words" + (App.utility.getBinding('more words')));
        action1.addEventListener('click', function() {
          return App.actions.changeWordsDisplayed(1);
        });
        action2.innerText = 'less';
        action2.setAttribute('data-tooltip', "Show less words" + (App.utility.getBinding('less words')));
        action2.addEventListener('click', function() {
          return App.actions.changeWordsDisplayed(-1);
        });
        break;
      case 'font':
        action1.innerText = 'bigger';
        action1.setAttribute('data-tooltip', "Increase font size" + (App.utility.getBinding('bigger')));
        action1.addEventListener('click', function() {
          return App.actions.changeFontSize(2);
        });
        action2.innerText = 'smaller';
        action2.setAttribute('data-tooltip', "Decrease font size" + (App.utility.getBinding('smaller')));
        action2.addEventListener('click', function() {
          return App.actions.changeFontSize(-2);
        });
        break;
      case 'word':
        action1.innerText = 'previous';
        action1.setAttribute('data-tooltip', "Previous word" + (App.utility.getBinding('prev word')));
        action1.addEventListener('click', function() {
          return App.actions.navigateText('prev', 'word');
        });
        action2.innerText = 'next';
        action2.setAttribute('data-tooltip', "Next word" + (App.utility.getBinding('next word')));
        action2.addEventListener('click', function() {
          return App.actions.navigateText('next', 'word');
        });
        break;
      case 'sentence':
        action1.innerText = 'previous';
        action1.setAttribute('data-tooltip', "Previous sentence" + (App.utility.getBinding('prev sentence')));
        action1.addEventListener('click', function() {
          return App.actions.navigateText('prev', 'sentence');
        });
        action2.innerText = 'next';
        action2.setAttribute('data-tooltip', "Next sentence" + (App.utility.getBinding('next sentence')));
        action2.addEventListener('click', function() {
          return App.actions.navigateText('next', 'sentence');
        });
        break;
      case 'paragraph':
        action1.innerText = 'previous';
        action1.setAttribute('data-tooltip', "Previous paragraph" + (App.utility.getBinding('prev paragraph')));
        action1.addEventListener('click', function() {
          return App.actions.navigateText('prev', 'paragraph');
        });
        action2.innerText = 'next';
        action2.setAttribute('data-tooltip', "Next paragraph" + (App.utility.getBinding('next paragraph')));
        action2.addEventListener('click', function() {
          return App.actions.navigateText('next', 'paragraph');
        });
        actions.className += ' speedr-button-actions--right';
    }
    actions.appendChild(action1);
    actions.appendChild(action2);
    controlButton.appendChild(actions);
    if (i < 3) {
      controlsLeft.appendChild(controlButton);
    } else {
      controlsRight.appendChild(controlButton);
    }
  }
  playPause = doc.createElement('div');
  playPause.id = 'js-play-pause';
  playPause.className = 'speedr-button speedr-button--centered js-speedr-tooltip';
  playPause.innerText = 'start';
  playPause.setAttribute('data-tooltip', "Start" + (App.utility.getBinding('toggle')));
  playPause.addEventListener('click', App.speedr.loop.toggle);
  controls.appendChild(playPause);
  controls.appendChild(controlsLeft);
  controls.appendChild(controlsRight);
  return controls;
};



},{}],7:[function(require,module,exports){
module.exports = function(settings, theme) {
  var bar, countdown, doc;
  doc = document;
  countdown = doc.createElement('div');
  countdown.className = 'speedr-countdown';
  bar = doc.createElement('div');
  bar.id = 'js-speedr-countdown-bar';
  bar.className = 'speedr-countdown-bar';
  bar.style.cssText = 'background-color: ' + theme.highlightColor + '; transition-duration: ' + settings.countdownSpeed + 'ms, 200ms;';
  countdown.appendChild(bar);
  return countdown;
};



},{}],8:[function(require,module,exports){
module.exports = function() {
  var doc, menu;
  doc = document;
  menu = doc.createElement('div');
  menu.id = 'js-speedr-menu-button';
  menu.className = 'speedr-menu-button speedr-button-fade js-speedr-tooltip';
  menu.setAttribute('data-tooltip', "Toggle Menu" + (App.utility.getBinding('toggle menu')));
  menu.appendChild(doc.createTextNode('menu'));
  menu.addEventListener('click', App.actions.toggleMenu);
  return menu;
};



},{}],9:[function(require,module,exports){
var Minimap;

Minimap = {
  create: function(settings, theme, box) {
    var contents, doc, minimap;
    doc = document;
    minimap = doc.createElement('div');
    minimap.id = 'js-speedr-minimap';
    minimap.className = 'speedr-minimap';
    minimap.style.cssText = "background-color: " + theme.boxColor + "; width: " + settings.minimapWidth + "px; height: " + settings.boxHeight + "px; border-left-color: " + theme.borderColor + "; box-shadow: -3px 0 0 " + theme.boxColor + ";";
    contents = this.createContents();
    minimap.appendChild(contents);
    box.appendChild(minimap);
    if (contents.offsetHeight > minimap.offsetHeight) {
      return App.scrollWatcher = true;
    }
  },
  createContents: function() {
    var contents, doc, i, paragraphElement, theme, word, wordElement, _i, _len, _ref;
    doc = document;
    theme = User.themes[User.settings.primaryTheme];
    contents = doc.createElement('div');
    contents.className = 'contents';
    contents.style.backgroundImage = "linear-gradient(to right, " + theme.secondaryText + " 50%, rgba(255, 255, 255, 0) 20%)";
    paragraphElement = doc.createElement('p');
    paragraphElement.className = 'speedr-minimap-para';
    _ref = App.text.parsed;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      word = _ref[i];
      wordElement = doc.createElement('span');
      wordElement.className = 'speedr-minimap-word';
      wordElement.style.cssText = "width: " + ((word.text.length - 1) * 4) + "px;";
      paragraphElement.appendChild(wordElement);
      paragraphElement.appendChild(doc.createTextNode(' '));
      if (word.paragraphEnd) {
        contents.appendChild(paragraphElement);
        paragraphElement = doc.createElement('p');
        paragraphElement.className = 'speedr-minimap-para';
      }
      App.minimapElements[i] = wordElement;
    }
    App.minimapElements[0].className = 'speedr-minimap-word--read';
    return contents;
  },
  updateContents: function() {
    var contents, minimap, oldContents;
    minimap = document.getElementById('js-speedr-minimap');
    oldContents = minimap.getElementsByClassName('contents')[0];
    contents = this.createContents();
    return minimap.replaceChild(contents, oldContents);
  },
  update: function() {
    var i, num, _i, _ref, _results;
    i = App.i;
    _results = [];
    for (num = _i = 0, _ref = App.text.parsed.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; num = 0 <= _ref ? ++_i : --_i) {
      _results.push(App.minimapElements[num].className = num <= i ? 'speedr-minimap-word--read' : 'speedr-minimap-word');
    }
    return _results;
  },
  updateScroll: function() {
    var activeOffset, i, minimap;
    i = App.i;
    minimap = document.getElementById('js-speedr-minimap');
    activeOffset = App.minimapElements[i].offsetTop;
    if (App.scrolling === false || App.scrolling === void 0) {
      if (User.settings.boxHeight - (activeOffset - minimap.scrollTop) < 50) {
        App.utility.scrollTo(minimap, activeOffset, 1000);
      }
      if (App.pause === true && activeOffset < minimap.scrollTop) {
        return App.utility.scrollTo(minimap, activeOffset - User.settings.boxHeight + 60, 1000);
      }
    }
  },
  scrollWatcher: function() {
    if (!App.scrolling) {
      App.addons.minimap.updateScroll();
    }
    return App.scrollWatcher = setTimeout(App.addons.minimap.scrollWatcher, App.interval * 5);
  }
};

module.exports = Minimap;



},{}],10:[function(require,module,exports){
module.exports = function() {
  var doc, status, timeLeft, wordsLeft;
  doc = document;
  status = doc.createElement('div');
  status.id = 'js-speedr-status';
  status.className = 'speedr-status speedr-small-text';
  wordsLeft = doc.createElement('span');
  wordsLeft.id = 'js-speedr-words-left';
  wordsLeft.className = 'speedr-status-item';
  status.appendChild(wordsLeft);
  timeLeft = doc.createElement('span');
  timeLeft.id = 'js-speedr-time-left';
  timeLeft.className = 'speedr-status-item';
  status.appendChild(timeLeft);
  return status;
};



},{}],11:[function(require,module,exports){
module.exports = {
  init: function() {
    var tooltip, tooltips, _i, _len, _results;
    tooltips = document.getElementsByClassName('js-speedr-tooltip');
    _results = [];
    for (_i = 0, _len = tooltips.length; _i < _len; _i++) {
      tooltip = tooltips[_i];
      tooltip.addEventListener('mouseover', (function(_this) {
        return function() {
          var target;
          target = event.target;
          return _this.timeout = setTimeout(function() {
            return _this.create(target);
          }, 500);
        };
      })(this));
      tooltip.addEventListener('mouseout', (function(_this) {
        return function() {
          clearTimeout(_this.timeout);
          if (_this.activeTooltip) {
            return _this.destroy();
          }
        };
      })(this));
      _results.push(tooltip.addEventListener('click', (function(_this) {
        return function() {
          if (_this.activeTooltip) {
            return _this.destroy();
          }
        };
      })(this)));
    }
    return _results;
  },
  create: function(element) {
    var arrow, position, theme, tooltip;
    theme = User.themes[User.settings.primaryTheme];
    position = element.getBoundingClientRect();
    tooltip = document.createElement('span');
    tooltip.className = 'speedr-tooltip speedr-tooltip-fly-up';
    tooltip.innerText = element.getAttribute('data-tooltip');
    tooltip.style.cssText = "top: " + position.top + "px; left: " + (position.left + (position.width / 2)) + "px; background-color: " + theme.highlightColor + ";";
    arrow = document.createElement('span');
    arrow.className = 'speedr-tooltip-arrow';
    arrow.style.borderTopColor = theme.highlightColor;
    tooltip.appendChild(arrow);
    this.activeTooltip = tooltip;
    document.body.appendChild(tooltip);
    return App.utility.runOnceAfterAnimation(tooltip, function() {
      return tooltip.className = tooltip.className.replace(' speedr-tooltip-fly-up', '');
    });
  },
  destroy: function(tooltip) {
    if (tooltip == null) {
      tooltip = this.activeTooltip;
    }
    tooltip.className += ' speedr-fade-out-quick';
    App.utility.runOnceAfterAnimation(tooltip, function() {
      return tooltip.remove();
    });
    return this.activeTooltip = void 0;
  }
};



},{}],12:[function(require,module,exports){
module.exports = function(theme) {
  var wpm;
  wpm = document.createElement('div');
  wpm.id = 'js-speedr-wpm';
  wpm.className = 'speedr-wpm';
  wpm.style.backgroundColor = theme.boxColor;
  return wpm;
};



},{}],13:[function(require,module,exports){
module.exports = {
  settings: {
    get: function() {
      return chrome.storage.sync.get(['settings', 'bindings'], function(data) {
        if (data.settings) {
          App.chrome.settings.store(data.settings, 'settings');
          App.actions.calculateInterval();
        }
        if (data.bindings) {
          return User.bindings = data.bindings;
        }
      });
    },
    save: function() {
      return chrome.storage.sync.set(User);
    },
    store: function(object, area) {
      var setting, value, _results;
      area = User[area];
      _results = [];
      for (setting in object) {
        value = object[setting];
        _results.push(area[setting] = value);
      }
      return _results;
    }
  },
  wordCount: {
    save: function(count) {
      return chrome.storage.sync.get('wordCount', function(data) {
        var wordCount;
        wordCount = data.wordCount || 0;
        return chrome.storage.sync.set({
          wordCount: wordCount + count
        });
      });
    }
  },
  extension: {
    init: function() {
      return chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.command) {
          case 'request.selection':
            return sendResponse(window.getSelection().toString().slice(0, 75));
          case 'parse.selection':
            if (!App.active) {
              return App.speedr.init(window.getSelection().toString());
            } else {
              return App.speedr.loop.toggle();
            }
            break;
          case 'parse.selection.start':
            App.speedr.init(window.getSelection().toString());
            return setTimeout(App.speedr.loop.toggle, 400);
        }
      });
    }
  }
};



},{}],14:[function(require,module,exports){
module.exports = function(event) {
  var keyCombo;
  keyCombo = App.utility.generateKeyCombo(event);
  switch (User.bindings[keyCombo]) {
    case "open":
      if (!App.active && window.getSelection().type === "Range") {
        App.speedr.init(window.getSelection().toString());
        return false;
      }
      break;
    case "close":
      if (App.active) {
        App.speedr.destroy();
        return false;
      }
      break;
    case "slower":
      if (App.active) {
        App.actions.changeWPM(-25);
        return false;
      }
      break;
    case "faster":
      if (App.active) {
        App.actions.changeWPM(25);
        return false;
      }
      break;
    case "bigger":
      if (App.active) {
        App.actions.changeFontSize(2);
        return false;
      }
      break;
    case "smaller":
      if (App.active) {
        App.actions.changeFontSize(-2);
        return false;
      }
      break;
    case "more words":
      if (App.active) {
        App.actions.changeWordsDisplayed(1);
        return false;
      }
      break;
    case "less words":
      if (App.active) {
        App.actions.changeWordsDisplayed(-1);
        return false;
      }
      break;
    case "toggle":
      if (App.active) {
        App.speedr.loop.toggle();
        return false;
      }
      break;
    case "reset":
      if (App.active) {
        App.speedr.loop.reset();
        return false;
      }
      break;
    case "prev word":
      if (App.active) {
        App.actions.navigateText("prev", "word");
        return false;
      }
      break;
    case "prev sentence":
      if (App.active) {
        App.actions.navigateText("prev", "sentence");
        return false;
      }
      break;
    case "prev paragraph":
      if (App.active) {
        App.actions.navigateText("prev", "paragraph");
        return false;
      }
      break;
    case "next word":
      if (App.active) {
        App.actions.navigateText("next", "word");
        return false;
      }
      break;
    case "next sentence":
      if (App.active) {
        App.actions.navigateText("next", "sentence");
        return false;
      }
      break;
    case "next paragraph":
      if (App.active) {
        return App.actions.navigateText("next", "paragraph");
      }
      break;
    case "toggle menu":
      if (App.active) {
        return App.actions.toggleMenu();
      }
      break;
    case "toggle theme":
      if (App.active) {
        return App.actions.toggleTheme();
      }
  }
};



},{}],15:[function(require,module,exports){
module.exports = {
  toggle: function() {
    if (App.pause) {
      return App.speedr.loop.startPrepare();
    } else {
      return App.speedr.loop.stop();
    }
  },
  stop: function() {
    var bar, doc, newSpeed, oldSpeed, playButton, settings, toggleClass;
    doc = document;
    settings = User.settings;
    toggleClass = App.utility.toggleClass;
    App.pause = true;
    clearTimeout(App.loop);
    App.i--;
    App.actions.getWordCount();
    if (settings.showStatus) {
      App.actions.updateStatus();
      toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden');
    }
    if (settings.showCountdown) {
      clearTimeout(App.countdownTimeout);
      bar = doc.getElementById('js-speedr-countdown-bar');
      oldSpeed = bar.style.transitionDuration;
      newSpeed = 150;
      bar.style.transitionDuration = newSpeed + 'ms, 200ms';
      toggleClass(bar, 'speedr-countdown-bar-zero');
      setTimeout(function() {
        return bar.style.transitionDuration = oldSpeed;
      }, newSpeed);
    }
    if (settings.showControls) {
      playButton = doc.getElementById('js-play-pause');
      if (App.i === App.text.parsed.length - 1) {
        playButton.innerText = 'restart';
        playButton.setAttribute('data-tooltip', "Restart" + (App.utility.getBinding('reset')));
      } else {
        playButton.innerText = 'start';
        playButton.setAttribute('data-tooltip', 'Start');
      }
    }
    if (App.scrollWatcher) {
      return clearTimeout(App.scrollWatcher);
    }
  },
  startPrepare: function() {
    var doc, playButton, settings, toggleClass;
    doc = document;
    settings = User.settings;
    toggleClass = App.utility.toggleClass;
    if (settings.showControls) {
      playButton = doc.getElementById('js-play-pause');
      playButton.innerText = 'stop';
      playButton.setAttribute('data-tooltip', "Stop" + (App.utility.getBinding('toggle')));
    }
    if (App.i === App.text.parsed.length - 1) {
      App.speedr.loop.reset();
    }
    App.i++;
    App.pause = false;
    if (settings.showContext && App.addons.context.activeContext) {
      App.addons.context.destroy();
    }
    if (settings.showStatus) {
      toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden');
    }
    if (settings.showCountdown) {
      toggleClass(doc.getElementById('js-speedr-countdown-bar'), 'speedr-countdown-bar-zero');
      return App.countdownTimeout = setTimeout(this.start, settings.countdownSpeed);
    } else {
      return this.start();
    }
  },
  start: function() {
    App.loop = App.speedr.loop.create();
    if (App.scrollWatcher) {
      return App.addons.minimap.scrollWatcher();
    }
  },
  reset: function() {
    var settings;
    settings = User.settings;
    if (App.pause === false) {
      App.speedr.loop.stop();
    }
    App.wordCount = 0;
    App.speedr.showWord(App.i = 0);
    if (settings.showStatus) {
      App.actions.updateStatus();
    }
    if (settings.showMinimap) {
      App.addons.minimap.update();
      if (App.scrollWatcher) {
        return App.addons.minimap.updateScroll();
      }
    }
  },
  create: function() {
    var delay, i, matches, multiplier, nextWord, regex, settings, word;
    settings = User.settings;
    delay = 0;
    i = App.i;
    word = App.text.parsed[i];
    nextWord = App.text.parsed[i + 1];
    App.speedr.showWord(i);
    App.i++;
    if (settings.showMinimap) {
      App.minimapElements[i].className = 'speedr-minimap-word--read';
    }
    if (nextWord) {
      if (settings.delayOnPunctuation && word.hasPunctuation) {
        delay = settings.punctuationDelayTime;
      }
      if (settings.delayOnSentence && nextWord.sentenceStart === i + 1) {
        delay = settings.sentenceDelayTime;
      }
      if (settings.delayOnLongWords) {
        if (settings.wordsDisplayed === 1 && word.text.length > settings.longWordLength) {
          multiplier = 1;
        } else {
          regex = new RegExp("\\w{" + settings.longWordLength + ",}", "g");
          matches = word.text.match(regex);
          multiplier = matches ? matches.length : 0;
        }
        delay += settings.longWordDelayTime * multiplier;
      }
      if (word.paragraphEnd) {
        if (settings.pauseOnParagraph) {
          return App.speedr.loop.stop();
        }
        if (settings.delayOnParagraph) {
          delay = settings.paragraphDelayTime;
        }
      }
      return App.loop = setTimeout(App.speedr.loop.create, App.interval + delay);
    } else {
      App.speedr.loop.stop();
      if (App.scrollWatcher) {
        return clearTimeout(App.scrollWatcher);
      }
    }
  }
};



},{}],16:[function(require,module,exports){
module.exports = {
  text: function(text) {
    App.text.original = text;
    return this.loop();
  },
  loop: function() {
    var counter, paragraph, paragraphStart, paragraphs, sentence, sentenceCounter, sentenceStart, sentences, word, wordObj, words, _i, _j, _k, _len, _len1, _len2, _results;
    counter = 0;
    sentenceCounter = 0;
    paragraphs = this.splitIntoParagraphs(App.text.original);
    _results = [];
    for (_i = 0, _len = paragraphs.length; _i < _len; _i++) {
      paragraph = paragraphs[_i];
      sentences = this.splitIntoSetences(paragraph);
      paragraphStart = counter;
      App.text.sentences.push.apply(App.text.sentences, sentences);
      for (_j = 0, _len1 = sentences.length; _j < _len1; _j++) {
        sentence = sentences[_j];
        words = this.splitIntoWords(sentence);
        sentenceStart = counter;
        for (_k = 0, _len2 = words.length; _k < _len2; _k++) {
          word = words[_k];
          wordObj = {
            text: word,
            hasPunctuation: /[\.,!\?]/.test(word) ? true : false,
            paragraphStart: paragraphStart,
            sentenceStart: sentenceStart,
            sentenceArrayMarker: sentenceCounter
          };
          App.text.parsed.push(wordObj);
          counter++;
        }
        sentenceCounter++;
      }
      _results.push(App.text.parsed[counter - 1].paragraphEnd = true);
    }
    return _results;
  },
  splitIntoParagraphs: function(text) {
    return text.split(/[\r\n]/g).filter(function(paragraph) {
      return paragraph.length > 0;
    });
  },
  splitIntoSetences: function(paragraph) {
    var sentences;
    sentences = paragraph.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) || [paragraph];
    return sentences.map(function(sentence) {
      return sentence.trim();
    });
  },
  splitIntoWords: function(sentence) {
    var regex;
    regex = new RegExp("((?:(?:\\S+\\s){" + User.settings.wordsDisplayed + "})|(?:.+)(?=\\n|$))", "g");
    return sentence.match(regex);
  }
};



},{}],17:[function(require,module,exports){
module.exports = {
  init: function(text) {
    App.parse.text(text);
    App.speedr.create();
    return App.speedr.showWord();
  },
  create: function() {
    var box, countdown, doc, elementFunction, item, menu, menuItem, menuItems, overlay, pointer, settings, theme, wordContainer, wordWrapper, _i, _len;
    App.active = true;
    doc = document;
    settings = User.settings;
    theme = User.themes[settings.primaryTheme];
    overlay = doc.createElement('div');
    overlay.id = 'js-speedr-container';
    overlay.className = 'speedr-container speedr-fade-in';
    box = doc.createElement('div');
    box.id = 'js-speedr-box';
    box.className = 'speedr-box speedr-flip-in';
    box.style.cssText = 'color: ' + theme.secondaryText + '; background-color: ' + theme.boxColor + '; width: ' + settings.boxWidth + 'px; height: ' + settings.boxHeight + 'px;';
    wordContainer = doc.createElement('div');
    wordContainer.className = 'speedr-word-container';
    wordContainer.style.cssText = 'font-family: ' + settings.fontFamily + '; font-size: ' + settings.fontSize + 'px; border-bottom-color: ' + theme.borderColor + ';';
    wordWrapper = doc.createElement('div');
    wordWrapper.id = 'js-speedr-word';
    wordWrapper.className = 'speedr-word';
    wordWrapper.style.color = theme.primaryText;
    wordContainer.appendChild(wordWrapper);
    pointer = doc.createElement('span');
    pointer.className = 'speedr-pointer';
    pointer.style.cssText = 'border-top-color: ' + theme.highlightColor + ';';
    wordContainer.appendChild(pointer);
    box.appendChild(wordContainer);
    countdown = doc.createElement('div');
    countdown.className = 'speedr-countdown';
    menu = doc.createElement('ul');
    menu.id = 'js-speedr-menu';
    menu.className = 'speedr-menu';
    menuItems = ['settings', 'close'];
    for (_i = 0, _len = menuItems.length; _i < _len; _i++) {
      menuItem = menuItems[_i];
      item = doc.createElement('li');
      switch (menuItem) {
        case 'settings':
          elementFunction = function() {
            return App.utility.openUrl('options.html');
          };
          break;
        case 'close':
          elementFunction = App.speedr.destroy;
          item.className = 'js-speedr-tooltip';
          item.setAttribute('data-tooltip', "Close Speedr" + (App.utility.getBinding('close')));
      }
      item.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';';
      item.appendChild(doc.createTextNode(menuItem));
      item.addEventListener('click', elementFunction);
      menu.appendChild(item);
    }
    box.appendChild(menu);
    if (settings.showControls) {
      box.appendChild(App.addons.controls());
    }
    if (settings.showMenuButton) {
      box.appendChild(App.addons.menuButton());
    }
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    if (settings.showMinimap) {
      App.addons.minimap.create(settings, theme, box);
    }
    if (settings.showCountdown) {
      box.appendChild(App.addons.countdown(settings, theme));
      App.actions.updateCountdownBar();
    }
    if (settings.showStatus) {
      box.appendChild(App.addons.status());
      App.actions.updateStatus();
    }
    if (settings.showWPM) {
      box.appendChild(App.addons.wpm(theme));
      App.actions.updateWPM();
    }
    if (settings.showTooltips) {
      App.addons.tooltips.init();
    }
    if (settings.showContext) {
      App.addons.context.init();
    }
    return App.utility.runOnceAfterAnimation(box, function() {
      overlay.className = overlay.className.replace(' speedr-fade-in', '');
      return box.className = box.className.replace(' speedr-flip-in', '');
    });
  },
  destroy: function() {
    var doc, newBox, oldBox, overlay;
    doc = document;
    oldBox = doc.getElementById('js-speedr-box');
    newBox = oldBox.cloneNode(true);
    newBox.className += ' speedr-flip-out';
    oldBox.parentNode.replaceChild(newBox, oldBox);
    overlay = doc.getElementById('js-speedr-container');
    overlay.className += ' speedr-fade-out';
    if (User.settings.showTooltips && App.addons.tooltips.activeTooltip) {
      App.addons.tooltips.destroy();
    }
    if (User.settings.showContext && App.addons.context.activeContext) {
      App.addons.context.destroy();
    }
    App.utility.runOnceAfterAnimation(newBox, function() {
      newBox.remove();
      return overlay.remove();
    });
    return App.speedr.reset();
  },
  showWord: function(marker) {
    var html, orp, theme, word, wordBox;
    if (marker == null) {
      marker = App.i;
    }
    theme = User.themes[User.settings.primaryTheme];
    word = App.text.parsed[marker].text;
    if (User.settings.wordsDisplayed === 1) {
      orp = Math.round((word.length + 1) * 0.4) - 1;
      html = "<div data-before=\"" + (word.slice(0, orp).replace(/["“”]/g, '&quot;')) + "\" data-after=\"" + (word.slice(orp + 1).replace(/["“”]/g, '&quot;')) + "\"><span style=\"color: " + theme.highlightColor + ";\">" + word[orp] + "</span></div>";
    } else {
      html = "<div>" + word + "</div>";
    }
    wordBox = document.getElementById('js-speedr-word');
    return wordBox.innerHTML = html;
  },
  reset: function() {
    App.active = false;
    App.pause = true;
    App.text.sentences = [];
    App.text.parsed = [];
    App.interval = App.actions.calculateInterval();
    App.i = 0;
    App.wordCount = 0;
    return App.minimapElements = {};
  },
  loop: require('./loop.coffee')
};



},{"./loop.coffee":15}],18:[function(require,module,exports){
var common;

common = require('./../common/utility.coffee');

module.exports = {
  formatNumber: function(number) {
    return Number(number).toLocaleString('en');
  },
  findNextOfType: function(type) {
    var currentTypeStart, i;
    i = App.i;
    currentTypeStart = App.text.parsed[i][type];
    while (true) {
      i++;
      if (App.text.parsed[i][type] !== currentTypeStart) {
        break;
      }
      if (App.text.parsed[i + 1] === void 0) {
        i = App.text.parsed.length - 1;
        break;
      }
    }
    return i;
  },
  findPrevOfType: function(type) {
    var i;
    i = App.i;
    if (i === App.text.parsed[i][type]) {
      return App.text.parsed[i - 1][type];
    } else {
      return App.text.parsed[i][type];
    }
  },
  toggleClass: function(element, className) {
    var elementClasses;
    elementClasses = element.className;
    if (elementClasses.indexOf(className) === -1) {
      return element.className += " " + className;
    } else {
      return element.className = elementClasses.replace(className, '');
    }
  },
  runOnceAfterAnimation: function(element, callback) {
    var prefix, prefixes, _i, _len, _results;
    prefixes = ['webkitAnimationEnd', 'animationend'];
    _results = [];
    for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
      prefix = prefixes[_i];
      _results.push(element.addEventListener(prefix, function() {
        event.target.removeEventListener(event.type, arguments.callee);
        return callback(event);
      }));
    }
    return _results;
  },
  scrollTo: function(element, to, duration) {
    var animateScroll, change, currentTime, easeInOutQuad, increment, start;
    start = element.scrollTop;
    change = to - start;
    currentTime = 0;
    increment = 20;
    App.scrolling = true;
    easeInOutQuad = function(time, begin, change, duration) {
      if ((time = time / (duration / 2)) < 1) {
        return change / 2 * time * time + begin;
      } else {
        return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;
      }
    };
    animateScroll = function() {
      var val;
      currentTime += increment;
      val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        return setTimeout(animateScroll, increment);
      } else {
        return App.scrolling = false;
      }
    };
    return animateScroll();
  },
  openUrl: function(href) {
    return chrome.runtime.sendMessage({
      url: href
    });
  },
  getBinding: function(action) {
    var binding, humanReadableBinding, key, keyAction, keyBinding, keys, _i, _len, _ref;
    humanReadableBinding = ' :';
    _ref = User.bindings;
    for (keyBinding in _ref) {
      keyAction = _ref[keyBinding];
      if (keyAction === action) {
        binding = keyBinding;
        break;
      }
    }
    if (binding) {
      keys = binding.split('+');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        humanReadableBinding += " " + (this.parseKeyCode(key));
      }
    } else {
      humanReadableBinding = '';
    }
    return humanReadableBinding.trim();
  },
  generateKeyCombo: common.generateKeyCombo,
  parseKeyCode: common.parseKeyCode
};



},{"./../common/utility.coffee":2}]},{},[3]);