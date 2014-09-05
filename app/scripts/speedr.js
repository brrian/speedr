(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  settings: {
    fontFamily: 'Open Sans',
    fontWeight: 'lighter',
    fontSize: 45,
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

window.Speedr = {
  text: {
    sentences: []
  },
  utility: require('./speedr/utility.coffee'),
  parse: require('./speedr/parse.coffee'),
  box: require('./speedr/box.coffee'),
  loop: require('./speedr/loop.coffee'),
  stats: require('./speedr/stats.coffee'),
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
    Speedr.box.reset();
    return Speedr.chrome.settings.get.then(Speedr.chrome.extension.init);
  }
};

window.onkeydown = require('./speedr/keyDownListener.coffee');

Speedr.init();



},{"./common/defaults.coffee":1,"./speedr/actions.coffee":4,"./speedr/addons/context.coffee":5,"./speedr/addons/controls.coffee":6,"./speedr/addons/countdown.coffee":7,"./speedr/addons/menuButton.coffee":8,"./speedr/addons/minimap.coffee":9,"./speedr/addons/status.coffee":10,"./speedr/addons/tooltips.coffee":11,"./speedr/addons/wpm.coffee":12,"./speedr/box.coffee":13,"./speedr/chrome.coffee":14,"./speedr/keyDownListener.coffee":15,"./speedr/loop.coffee":16,"./speedr/parse.coffee":17,"./speedr/stats.coffee":18,"./speedr/utility.coffee":19}],4:[function(require,module,exports){
module.exports = {
  calculateInterval: function() {
    return Speedr.interval = 60000 / User.settings.wpm;
  },
  updateStatus: function() {
    var doc, timeLeft, totalWords, totalWpm, wordPlurality, wordsDisplayed, wordsLeft, wpm;
    doc = document;
    wpm = User.settings.wpm;
    wordsDisplayed = User.settings.wordsDisplayed;
    wordsLeft = Speedr.text.parsed.length - Speedr.i - 1;
    timeLeft = (wordsLeft / wpm * 60).toFixed(2);
    if (wordsDisplayed === 1) {
      totalWpm = "" + wpm + " wpm";
      totalWords = Speedr.utility.formatNumber(wordsLeft);
    } else {
      totalWpm = "" + (wpm * wordsDisplayed) + " wpm (" + wpm + "&times;" + wordsDisplayed + ")";
      totalWords = wordsLeft !== 0 ? "~" + (Speedr.utility.formatNumber(wordsLeft * wordsDisplayed)) : "0";
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
    return Speedr.chrome.settings.save();
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
      Speedr.actions.updateCountdownBar();
    }
    return Speedr.chrome.settings.save();
  },
  changeWordsDisplayed: function(words) {
    var settings;
    settings = User.settings;
    if ((settings.wordsDisplayed + words) < 1) {
      return;
    }
    if (Speedr.pause === false) {
      Speedr.loop.stop();
    }
    User.settings.wordsDisplayed = settings.wordsDisplayed + words;
    Speedr.i = 0;
    Speedr.text.parsed = [];
    Speedr.parse.loop();
    Speedr.box.showWord();
    if (settings.showWPM) {
      this.updateWPM();
    }
    if (settings.showStatus) {
      this.updateStatus();
    }
    if (settings.showMinimap) {
      if (Speedr.scrollWatcher) {
        Speedr.addons.minimap.updateScroll();
      }
      Speedr.addons.minimap.updateContents();
    }
    return Speedr.chrome.settings.save();
  },
  navigateText: function(direction, type) {
    var i, settings;
    i = Speedr.i;
    settings = User.settings;
    if (Speedr.pause === false) {
      Speedr.loop.stop();
    }
    if (i === 0 && direction === 'prev') {
      return;
    }
    if (i === Speedr.text.parsed.length - 1 && direction === 'next') {
      return;
    }
    switch (type) {
      case 'word':
        Speedr.i = direction === 'prev' ? i - 1 : i + 1;
        break;
      case 'sentence':
        Speedr.i = direction === 'prev' ? Speedr.utility.findPrevOfType('sentenceStart') : Speedr.utility.findNextOfType('sentenceStart');
        break;
      case 'paragraph':
        Speedr.i = direction === 'prev' ? Speedr.utility.findPrevOfType('paragraphStart') : Speedr.utility.findNextOfType('paragraphStart');
    }
    Speedr.box.showWord();
    if (settings.showStatus) {
      Speedr.actions.updateStatus();
    }
    if (settings.showContext && Speedr.addons.context.activeContext) {
      document.querySelector('.speedr-context').textContent = Speedr.text.sentences[Speedr.text.parsed[Speedr.i].sentenceArrayMarker];
    }
    if (settings.showMinimap) {
      Speedr.addons.minimap.update();
      if (Speedr.scrollWatcher) {
        return Speedr.addons.minimap.updateScroll();
      }
    }
  },
  toggleMenu: function() {
    var doc, toggleClass;
    doc = document;
    toggleClass = Speedr.utility.toggleClass;
    if (User.settings.showMenuButton) {
      toggleClass(doc.getElementById('js-speedr-menu-button'), 'speedr-menu-button-active');
    }
    return toggleClass(doc.getElementById('js-speedr-menu'), 'speedr-menu-active');
  },
  toggleTheme: function() {
    var box, contents, countdownBar, currentTheme, doc, highlighted, menu, menuItem, menuItems, minimap, newTheme, pointer, settings, theme, word, wordContainer, wpm, _i, _len;
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
      minimap.style.cssText = "width: " + settings.minimapWidth + "px; height: " + settings.boxHeight + "px; background-color: " + theme.boxColor + "; border-left-color: " + theme.borderColor + "; box-shadow: -3px 0 0 " + theme.boxColor;
      contents = minimap.querySelector('.contents');
      contents.style.backgroundImage = "linear-gradient(to right, " + theme.secondaryText + " 50%, rgba(255, 255, 255, 0) 20%)";
    }
    if (settings.showCountdown === true) {
      countdownBar = doc.getElementById('js-speedr-countdown-bar');
      countdownBar.style.backgroundColor = theme.highlightColor;
    }
    User.settings.primaryTheme = newTheme;
    User.settings.secondaryTheme = currentTheme;
    return Speedr.chrome.settings.save();
  }
};



},{}],5:[function(require,module,exports){
module.exports = {
  init: function() {
    var speedrWord;
    speedrWord = document.getElementById('js-speedr-word');
    speedrWord.addEventListener('mouseover', (function(_this) {
      return function() {
        if (Speedr.pause) {
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
    var context, sentence;
    sentence = Speedr.text.sentences[Speedr.text.parsed[Speedr.i].sentenceArrayMarker];
    context = document.createElement('span');
    context.className = 'speedr-context speedr-context-fly-up';
    context.textContent = sentence;
    context.style.cssText = "max-width: " + (User.settings.boxWidth * .9) + "px; bottom: " + (User.settings.boxHeight + 10) + "px;";
    document.getElementById('js-speedr-box').appendChild(context);
    this.activeContext = context;
    return Speedr.utility.runOnceAfterAnimation(context, function() {
      return context.className = context.className.replace(' speedr-context-fly-up', '');
    });
  },
  destroy: function() {
    this.activeContext.className += ' speedr-fade-out-quick';
    return Speedr.utility.runOnceAfterAnimation(this.activeContext, (function(_this) {
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
    controlButton.textContent = button;
    actions = doc.createElement('div');
    actions.className = 'speedr-button-actions';
    action1 = doc.createElement('span');
    action1.className = 'speedr-button-action js-speedr-tooltip';
    action2 = doc.createElement('span');
    action2.className = 'speedr-button-action js-speedr-tooltip';
    switch (button) {
      case 'speed':
        action1.textContent = 'faster';
        action1.setAttribute('data-tooltip', "Increase speed" + (Speedr.utility.getBinding('faster')));
        action1.addEventListener('click', function() {
          return Speedr.actions.changeWPM(25);
        });
        action2.textContent = 'slower';
        action2.setAttribute('data-tooltip', "Decrease speed" + (Speedr.utility.getBinding('slower')));
        action2.addEventListener('click', function() {
          return Speedr.actions.changeWPM(-25);
        });
        break;
      case 'words':
        action1.textContent = 'more';
        action1.setAttribute('data-tooltip', "Show more words" + (Speedr.utility.getBinding('more words')));
        action1.addEventListener('click', function() {
          return Speedr.actions.changeWordsDisplayed(1);
        });
        action2.textContent = 'less';
        action2.setAttribute('data-tooltip', "Show less words" + (Speedr.utility.getBinding('less words')));
        action2.addEventListener('click', function() {
          return Speedr.actions.changeWordsDisplayed(-1);
        });
        break;
      case 'font':
        action1.textContent = 'bigger';
        action1.setAttribute('data-tooltip', "Increase font size" + (Speedr.utility.getBinding('bigger')));
        action1.addEventListener('click', function() {
          return Speedr.actions.changeFontSize(2);
        });
        action2.textContent = 'smaller';
        action2.setAttribute('data-tooltip', "Decrease font size" + (Speedr.utility.getBinding('smaller')));
        action2.addEventListener('click', function() {
          return Speedr.actions.changeFontSize(-2);
        });
        break;
      case 'word':
        action1.textContent = 'previous';
        action1.setAttribute('data-tooltip', "Previous word" + (Speedr.utility.getBinding('prev word')));
        action1.addEventListener('click', function() {
          return Speedr.actions.navigateText('prev', 'word');
        });
        action2.textContent = 'next';
        action2.setAttribute('data-tooltip', "Next word" + (Speedr.utility.getBinding('next word')));
        action2.addEventListener('click', function() {
          return Speedr.actions.navigateText('next', 'word');
        });
        break;
      case 'sentence':
        action1.textContent = 'previous';
        action1.setAttribute('data-tooltip', "Previous sentence" + (Speedr.utility.getBinding('prev sentence')));
        action1.addEventListener('click', function() {
          return Speedr.actions.navigateText('prev', 'sentence');
        });
        action2.textContent = 'next';
        action2.setAttribute('data-tooltip', "Next sentence" + (Speedr.utility.getBinding('next sentence')));
        action2.addEventListener('click', function() {
          return Speedr.actions.navigateText('next', 'sentence');
        });
        break;
      case 'paragraph':
        action1.textContent = 'previous';
        action1.setAttribute('data-tooltip', "Previous paragraph" + (Speedr.utility.getBinding('prev paragraph')));
        action1.addEventListener('click', function() {
          return Speedr.actions.navigateText('prev', 'paragraph');
        });
        action2.textContent = 'next';
        action2.setAttribute('data-tooltip', "Next paragraph" + (Speedr.utility.getBinding('next paragraph')));
        action2.addEventListener('click', function() {
          return Speedr.actions.navigateText('next', 'paragraph');
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
  playPause.textContent = 'start';
  playPause.setAttribute('data-tooltip', "Start" + (Speedr.utility.getBinding('toggle')));
  playPause.addEventListener('click', Speedr.loop.toggle);
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
  menu.setAttribute('data-tooltip', "Toggle Menu" + (Speedr.utility.getBinding('toggle menu')));
  menu.appendChild(doc.createTextNode('menu'));
  menu.addEventListener('click', Speedr.actions.toggleMenu);
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
      return Speedr.scrollWatcher = true;
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
    _ref = Speedr.text.parsed;
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
      Speedr.minimapElements[i] = wordElement;
    }
    Speedr.minimapElements[0].className = 'speedr-minimap-word--read';
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
    i = Speedr.i;
    _results = [];
    for (num = _i = 0, _ref = Speedr.text.parsed.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; num = 0 <= _ref ? ++_i : --_i) {
      _results.push(Speedr.minimapElements[num].className = num <= i ? 'speedr-minimap-word--read' : 'speedr-minimap-word');
    }
    return _results;
  },
  updateScroll: function() {
    var activeOffset, i, minimap;
    i = Speedr.i;
    minimap = document.getElementById('js-speedr-minimap');
    activeOffset = Speedr.minimapElements[i].offsetTop;
    if (Speedr.scrolling === false || Speedr.scrolling === void 0) {
      if (User.settings.boxHeight - (activeOffset - minimap.scrollTop) < 50) {
        Speedr.utility.scrollTo(minimap, activeOffset, 1000);
      }
      if (Speedr.pause === true && activeOffset < minimap.scrollTop) {
        return Speedr.utility.scrollTo(minimap, activeOffset - User.settings.boxHeight + 60, 1000);
      }
    }
  },
  scrollWatcher: function() {
    if (!Speedr.scrolling) {
      Speedr.addons.minimap.updateScroll();
    }
    return Speedr.scrollWatcher = setTimeout(Speedr.addons.minimap.scrollWatcher, Speedr.interval * 5);
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
        return function(event) {
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
    tooltip.textContent = element.getAttribute('data-tooltip');
    tooltip.style.cssText = "top: " + position.top + "px; left: " + (position.left + (position.width / 2)) + "px; background-color: " + theme.highlightColor + ";";
    arrow = document.createElement('span');
    arrow.className = 'speedr-tooltip-arrow';
    arrow.style.borderTopColor = theme.highlightColor;
    tooltip.appendChild(arrow);
    this.activeTooltip = tooltip;
    document.body.appendChild(tooltip);
    return Speedr.utility.runOnceAfterAnimation(tooltip, function() {
      return tooltip.className = tooltip.className.replace(' speedr-tooltip-fly-up', '');
    });
  },
  destroy: function(tooltip) {
    if (tooltip == null) {
      tooltip = this.activeTooltip;
    }
    tooltip.className += ' speedr-fade-out-quick';
    Speedr.utility.runOnceAfterAnimation(tooltip, function() {
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
  init: function(text, options) {
    this.options = Speedr.utility.defaults({
      overlay: true,
      animate: true,
      sync: true,
      style: ''
    }, options || {});
    Speedr.parse.text(text);
    Speedr.box.create();
    return Speedr.box.showWord();
  },
  create: function() {
    var box, countdown, doc, elementFunction, item, menu, menuItem, menuItems, overlay, pointer, settings, theme, wordContainer, wordWrapper, _i, _len;
    Speedr.active = true;
    doc = document;
    settings = User.settings;
    theme = User.themes[settings.primaryTheme];
    box = doc.createElement('div');
    box.id = 'js-speedr-box';
    box.className = 'speedr-box';
    box.style.cssText = "color: " + theme.secondaryText + "; background-color: " + theme.boxColor + "; width: " + settings.boxWidth + "px; height: " + settings.boxHeight + "px;";
    wordContainer = doc.createElement('div');
    wordContainer.className = 'speedr-word-container';
    wordContainer.style.cssText = "font-family: " + settings.fontFamily + "; font-weight: " + settings.fontWeight + "; font-size: " + settings.fontSize + "px; border-bottom-color: " + theme.borderColor + ";";
    wordWrapper = doc.createElement('div');
    wordWrapper.id = 'js-speedr-word';
    wordWrapper.className = 'speedr-word';
    wordWrapper.style.color = theme.primaryText;
    wordContainer.appendChild(wordWrapper);
    pointer = doc.createElement('span');
    pointer.className = 'speedr-pointer';
    pointer.style.cssText = "border-top-color: " + theme.highlightColor + ";";
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
            return Speedr.utility.openUrl('options.html');
          };
          break;
        case 'close':
          elementFunction = Speedr.box.destroy;
          item.className = 'js-speedr-tooltip';
          item.setAttribute('data-tooltip', "Close Speedr" + (Speedr.utility.getBinding('close')));
      }
      item.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';';
      item.appendChild(doc.createTextNode(menuItem));
      item.addEventListener('click', elementFunction);
      menu.appendChild(item);
    }
    box.appendChild(menu);
    if (settings.showControls) {
      box.appendChild(Speedr.addons.controls());
    }
    if (settings.showMenuButton) {
      box.appendChild(Speedr.addons.menuButton());
    }
    if (this.options.style) {
      box.style.cssText += " " + this.options.style;
    }
    if (this.options.overlay) {
      overlay = doc.createElement('div');
      overlay.id = 'js-speedr-container';
      overlay.className = 'speedr-container';
      overlay.appendChild(box);
    }
    if (this.options.animate) {
      box.className += ' speedr-flip-in';
      if (overlay) {
        overlay.className += ' speedr-fade-in';
      }
      Speedr.utility.runOnceAfterAnimation(box, function() {
        box.className = box.className.replace(' speedr-flip-in', '');
        if (overlay) {
          return overlay.className = overlay.className.replace(' speedr-fade-in', '');
        }
      });
    }
    if (overlay) {
      document.body.appendChild(overlay);
    } else {
      document.body.appendChild(box);
    }
    if (settings.showMinimap) {
      Speedr.addons.minimap.create(settings, theme, box);
    }
    if (settings.showCountdown) {
      box.appendChild(Speedr.addons.countdown(settings, theme));
      Speedr.actions.updateCountdownBar();
    }
    if (settings.showStatus) {
      box.appendChild(Speedr.addons.status());
      Speedr.actions.updateStatus();
    }
    if (settings.showWPM) {
      box.appendChild(Speedr.addons.wpm(theme));
      Speedr.actions.updateWPM();
    }
    if (settings.showTooltips) {
      Speedr.addons.tooltips.init();
    }
    if (settings.showContext) {
      return Speedr.addons.context.init();
    }
  },
  destroy: function() {
    var doc, newBox, oldBox, overlay;
    doc = document;
    oldBox = doc.getElementById('js-speedr-box');
    newBox = oldBox.cloneNode(true);
    oldBox.parentNode.replaceChild(newBox, oldBox);
    overlay = doc.getElementById('js-speedr-container');
    if (Speedr.box.options.animate) {
      newBox.className += ' speedr-flip-out';
      if (overlay) {
        overlay.className += ' speedr-fade-out';
      }
      Speedr.utility.runOnceAfterAnimation(newBox, function() {
        newBox.remove();
        if (overlay) {
          return overlay.remove();
        }
      });
    } else {
      newBox.remove();
      if (overlay) {
        overlay.remove();
      }
    }
    if (User.settings.showTooltips && Speedr.addons.tooltips.activeTooltip) {
      Speedr.addons.tooltips.destroy();
    }
    if (User.settings.showContext && Speedr.addons.context.activeContext) {
      Speedr.addons.context.destroy();
    }
    return Speedr.box.reset();
  },
  showWord: function(marker) {
    var html, orp, theme, word, wordBox;
    if (marker == null) {
      marker = Speedr.i;
    }
    theme = User.themes[User.settings.primaryTheme];
    word = Speedr.text.parsed[marker].text;
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
    Speedr.active = false;
    Speedr.pause = true;
    Speedr.text.sentences = [];
    Speedr.text.parsed = [];
    Speedr.interval = Speedr.actions.calculateInterval();
    Speedr.i = 0;
    return Speedr.minimapElements = {};
  }
};



},{}],14:[function(require,module,exports){
module.exports = {
  settings: {
    get: new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(['settings', 'bindings'], function(data) {
        if (data.settings) {
          Speedr.chrome.settings.store(data.settings, 'settings');
          Speedr.actions.calculateInterval();
        }
        if (data.bindings) {
          User.bindings = data.bindings;
        }
        return resolve();
      });
    }),
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
  stats: {
    save: function(time, words) {
      return chrome.storage.sync.get('stats', function(data) {
        var date, month, stats;
        stats = data.stats || {};
        date = new Date();
        month = "" + (date.getFullYear()) + "-" + (date.getMonth() + 1);
        if (!stats.hasOwnProperty(month)) {
          stats[month] = {
            time: time,
            words: words
          };
        } else {
          stats[month].time += time;
          stats[month].words += words;
        }
        return chrome.storage.sync.set({
          stats: stats
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
            if (!Speedr.active) {
              return Speedr.box.init(window.getSelection().toString());
            } else {
              return Speedr.loop.toggle();
            }
            break;
          case 'parse.selection.start':
            Speedr.box.init(window.getSelection().toString());
            return setTimeout(Speedr.loop.toggle, 400);
        }
      });
    }
  }
};



},{}],15:[function(require,module,exports){
module.exports = function(event) {
  var action;
  action = User.bindings[Speedr.utility.generateKeyCombo(event)];
  if (!Speedr.active && action === 'open' && window.getSelection().type === 'Range') {
    Speedr.box.init(window.getSelection().toString());
    return false;
  } else if (Speedr.active) {
    switch (action) {
      case 'close':
        Speedr.box.destroy();
        return false;
      case 'slower':
        Speedr.actions.changeWPM(-25);
        return false;
      case 'faster':
        Speedr.actions.changeWPM(25);
        return false;
      case 'bigger':
        Speedr.actions.changeFontSize(2);
        return false;
      case 'smaller':
        Speedr.actions.changeFontSize(-2);
        return false;
      case 'more words':
        Speedr.actions.changeWordsDisplayed(1);
        return false;
      case 'less words':
        Speedr.actions.changeWordsDisplayed(-1);
        return false;
      case 'toggle':
        Speedr.loop.toggle();
        return false;
      case 'reset':
        Speedr.loop.reset();
        return false;
      case 'prev word':
        Speedr.actions.navigateText('prev', 'word');
        return false;
      case 'prev sentence':
        Speedr.actions.navigateText('prev', 'sentence');
        return false;
      case 'prev paragraph':
        Speedr.actions.navigateText('prev', 'paragraph');
        return false;
      case 'next word':
        Speedr.actions.navigateText('next', 'word');
        return false;
      case 'next sentence':
        Speedr.actions.navigateText('next', 'sentence');
        return false;
      case 'next paragraph':
        Speedr.actions.navigateText('next', 'paragraph');
        return false;
      case 'toggle menu':
        Speedr.actions.toggleMenu();
        return false;
      case 'toggle theme':
        Speedr.actions.toggleTheme();
        return false;
    }
  }
};



},{}],16:[function(require,module,exports){
module.exports = {
  toggle: function() {
    if (Speedr.pause) {
      return Speedr.loop.startPrepare();
    } else {
      return Speedr.loop.stop();
    }
  },
  stop: function() {
    var bar, doc, newSpeed, oldSpeed, playButton, settings, toggleClass;
    doc = document;
    settings = User.settings;
    toggleClass = Speedr.utility.toggleClass;
    Speedr.pause = true;
    clearTimeout(Speedr.loopTimeout);
    Speedr.i--;
    if (settings.showStatus) {
      Speedr.actions.updateStatus();
      toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden');
    }
    if (settings.showCountdown) {
      clearTimeout(Speedr.countdownTimeout);
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
      if (Speedr.i === Speedr.text.parsed.length - 1) {
        playButton.textContent = 'restart';
        playButton.setAttribute('data-tooltip', "Restart" + (Speedr.utility.getBinding('reset')));
      } else {
        playButton.textContent = 'start';
        playButton.setAttribute('data-tooltip', 'Start');
      }
    }
    if (Speedr.scrollWatcher) {
      clearTimeout(Speedr.scrollWatcher);
    }
    if (Speedr.box.options.sync === true) {
      return Speedr.stats.stop();
    }
  },
  startPrepare: function() {
    var doc, playButton, settings, toggleClass;
    doc = document;
    settings = User.settings;
    toggleClass = Speedr.utility.toggleClass;
    if (settings.showControls) {
      playButton = doc.getElementById('js-play-pause');
      playButton.textContent = 'stop';
      playButton.setAttribute('data-tooltip', "Stop" + (Speedr.utility.getBinding('toggle')));
    }
    if (Speedr.i === Speedr.text.parsed.length - 1) {
      Speedr.loop.reset();
    }
    Speedr.i++;
    Speedr.pause = false;
    if (settings.showContext && Speedr.addons.context.activeContext) {
      Speedr.addons.context.destroy();
    }
    if (settings.showStatus) {
      toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden');
    }
    if (settings.showCountdown) {
      toggleClass(doc.getElementById('js-speedr-countdown-bar'), 'speedr-countdown-bar-zero');
      Speedr.countdownTimeout = setTimeout(this.start, settings.countdownSpeed);
    } else {
      this.start();
    }
    if (Speedr.box.options.sync === true) {
      return Speedr.stats.start();
    }
  },
  start: function() {
    Speedr.loopTimeout = Speedr.loop.create();
    if (Speedr.scrollWatcher) {
      return Speedr.addons.minimap.scrollWatcher();
    }
  },
  reset: function() {
    var settings;
    settings = User.settings;
    if (Speedr.pause === false) {
      Speedr.loop.stop();
    }
    Speedr.box.showWord(Speedr.i = 0);
    if (settings.showStatus) {
      Speedr.actions.updateStatus();
    }
    if (settings.showMinimap) {
      Speedr.addons.minimap.update();
      if (Speedr.scrollWatcher) {
        return Speedr.addons.minimap.updateScroll();
      }
    }
  },
  create: function() {
    var delay, i, matches, multiplier, nextWord, regex, settings, word;
    settings = User.settings;
    delay = 0;
    i = Speedr.i;
    word = Speedr.text.parsed[i];
    nextWord = Speedr.text.parsed[i + 1];
    Speedr.box.showWord(i);
    Speedr.i++;
    if (settings.showMinimap) {
      Speedr.minimapElements[i].className = 'speedr-minimap-word--read';
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
          return Speedr.loop.stop();
        }
        if (settings.delayOnParagraph) {
          delay = settings.paragraphDelayTime;
        }
      }
      return Speedr.loopTimeout = setTimeout(Speedr.loop.create, Speedr.interval + delay);
    } else {
      Speedr.loop.stop();
      if (Speedr.scrollWatcher) {
        return clearTimeout(Speedr.scrollWatcher);
      }
    }
  }
};



},{}],17:[function(require,module,exports){
module.exports = {
  text: function(text) {
    Speedr.text.original = text;
    return this.loop();
  },
  loop: function() {
    var counter, paragraph, paragraphStart, paragraphs, sentence, sentenceCounter, sentenceStart, sentences, word, wordObj, words, _i, _j, _k, _len, _len1, _len2, _results;
    counter = 0;
    sentenceCounter = 0;
    paragraphs = this.splitIntoParagraphs(Speedr.text.original);
    _results = [];
    for (_i = 0, _len = paragraphs.length; _i < _len; _i++) {
      paragraph = paragraphs[_i];
      sentences = this.splitIntoSetences(paragraph);
      paragraphStart = counter;
      Speedr.text.sentences.push.apply(Speedr.text.sentences, sentences);
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
          Speedr.text.parsed.push(wordObj);
          counter++;
        }
        sentenceCounter++;
      }
      _results.push(Speedr.text.parsed[counter - 1].paragraphEnd = true);
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



},{}],18:[function(require,module,exports){
module.exports = {
  start: function() {
    this.time = new Date().getTime();
    this.index = Speedr.i;
    if (User.settings.showCountdown) {
      return this.time += User.settings.countdownSpeed;
    }
  },
  stop: function() {
    var time, words;
    time = new Date().getTime() - this.time;
    words = Speedr.i - this.index + 1;
    return Speedr.chrome.stats.save(time, words);
  }
};



},{}],19:[function(require,module,exports){
var common;

common = require('./../common/utility.coffee');

module.exports = {
  formatNumber: function(number) {
    return Number(number).toLocaleString('en');
  },
  findNextOfType: function(type) {
    var currentTypeStart, i;
    i = Speedr.i;
    currentTypeStart = Speedr.text.parsed[i][type];
    while (true) {
      i++;
      if (Speedr.text.parsed[i][type] !== currentTypeStart) {
        break;
      }
      if (Speedr.text.parsed[i + 1] === void 0) {
        i = Speedr.text.parsed.length - 1;
        break;
      }
    }
    return i;
  },
  findPrevOfType: function(type) {
    var i;
    i = Speedr.i;
    if (i === Speedr.text.parsed[i][type]) {
      return Speedr.text.parsed[i - 1][type];
    } else {
      return Speedr.text.parsed[i][type];
    }
  },
  toggleClass: function(element, className) {
    var elementClasses;
    elementClasses = element.className;
    if (elementClasses.indexOf(className) === -1) {
      return element.className += " " + className;
    } else {
      return element.className = elementClasses.replace(" " + className, '');
    }
  },
  runOnceAfterAnimation: function(element, callback) {
    var prefix, prefixes, _i, _len, _results;
    prefixes = ['webkitAnimationEnd', 'animationend'];
    _results = [];
    for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
      prefix = prefixes[_i];
      _results.push(element.addEventListener(prefix, function(event) {
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
    Speedr.scrolling = true;
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
        return Speedr.scrolling = false;
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
  defaults: function() {
    var copy, name, obj, target, _i, _len;
    target = arguments[0] || {};
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      obj = arguments[_i];
      if (obj != null) {
        for (name in obj) {
          copy = obj[name];
          if (target === copy) {
            continue;
          } else if (copy !== void 0) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  },
  generateKeyCombo: common.generateKeyCombo,
  parseKeyCode: common.parseKeyCode
};



},{"./../common/utility.coffee":2}]},{},[3]);