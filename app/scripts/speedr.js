(function() {
  var User;

  Math.easeInOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
      c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

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

  window.App = {
    utility: {
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
        return keyCombo += String.fromCharCode(event.keyCode).toLowerCase();
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
          }, false));
        }
        return _results;
      },
      scrollTo: function(element, to, duration) {
        var animateScroll, change, currentTime, increment, start;
        start = element.scrollTop;
        change = to - start;
        currentTime = 0;
        increment = 20;
        animateScroll = function() {
          var val;
          currentTime += increment;
          val = Math.easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if (currentTime < duration) {
            return setTimeout(animateScroll, increment);
          }
        };
        animateScroll();
        return App.scrolling = false;
      }
    },
    parse: {
      selection: function() {
        var counter, paragraph, paragraphStart, paragraphs, selection, sentence, sentenceStart, sentences, word, wordObj, words, _i, _j, _k, _len, _len1, _len2;
        selection = window.getSelection().toString();
        counter = 0;
        paragraphs = this.splitIntoParagraphs(selection);
        for (_i = 0, _len = paragraphs.length; _i < _len; _i++) {
          paragraph = paragraphs[_i];
          sentences = this.splitIntoSetences(paragraph);
          paragraphStart = counter;
          for (_j = 0, _len1 = sentences.length; _j < _len1; _j++) {
            sentence = sentences[_j];
            words = this.splitIntoWords(sentence);
            sentenceStart = counter;
            for (_k = 0, _len2 = words.length; _k < _len2; _k++) {
              word = words[_k];
              counter++;
              wordObj = {
                text: word,
                hasPunctuation: /[\.,!\?]/.test(word) ? true : false,
                paragraphStart: paragraphStart,
                sentenceStart: sentenceStart
              };
              App.text.push(wordObj);
            }
          }
          App.text[counter - 1].paragraphEnd = true;
        }
        App.speedr.create();
        return App.speedr.showWord();
      },
      splitIntoParagraphs: function(text) {
        return text.split(/[\r\n]/g).filter(function(paragraph) {
          return paragraph.length > 0;
        });
      },
      splitIntoSetences: function(paragraph) {
        var sentences;
        sentences = paragraph.match(/["'“]?([A-Z]((?!([A-Za-z]{2,}|\d+)[.?!]+["']?\s+["']?[A-Z]).)*)(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[A-Z]).)*)?)*((?![.?!]["']?\s+["']?[A-Z]).)*[.?!]+["'”]?/g) || [paragraph];
        return sentences.map(function(sentence) {
          return sentence.trim();
        });
      },
      splitIntoWords: function(sentence) {
        return sentence.split(' ');
      }
    },
    speedr: {
      create: function() {
        var box, button, buttons, element, elementFunction, overlay, player, wordContainer, wpm, _i, _len;
        App.active = true;
        overlay = document.createElement('div');
        overlay.id = 'js-speedr-container';
        overlay.className = 'speedr-container fade-in';
        box = document.createElement('div');
        box.id = 'js-speedr-box';
        box.className = 'speedr-box flip-in';
        wordContainer = document.createElement('div');
        wordContainer.id = 'js-speedr-word';
        wordContainer.className = 'speedr-word-container';
        wordContainer.style.fontSize = User.settings.fontSize + 'px';
        player = document.createElement('div');
        player.className = 'speedr-player';
        buttons = ['prev-paragraph', 'prev-sentence', 'prev-word', 'play-pause', 'next-word', 'next-sentence', 'next-paragraph'];
        for (_i = 0, _len = buttons.length; _i < _len; _i++) {
          button = buttons[_i];
          switch (button) {
            case 'prev-paragraph':
              elementFunction = App.actions.prevParagraph;
              break;
            case 'prev-sentence':
              elementFunction = App.actions.prevSentence;
              break;
            case 'prev-word':
              elementFunction = App.actions.prevWord;
              break;
            case 'play-pause':
              elementFunction = App.speedr.loop.toggle;
              break;
            case 'next-word':
              elementFunction = App.actions.nextWord;
              break;
            case 'next-sentence':
              elementFunction = App.actions.nextSentence;
              break;
            case 'next-paragraph':
              elementFunction = App.actions.nextParagraph;
          }
          element = document.createElement('span');
          element.className = button + ' button';
          element.addEventListener('click', elementFunction, false);
          if (button === 'play-pause') {
            element.id = 'js-play-pause';
          }
          player.appendChild(element);
          player.appendChild(document.createTextNode('\x20'));
        }
        wpm = document.createElement('div');
        wpm.id = 'js-speedr-wpm';
        wpm.className = 'speedr-wpm';
        box.appendChild(wordContainer);
        box.appendChild(player);
        box.appendChild(wpm);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        App.utility.runOnceAfterAnimation(box, function() {
          if (User.settings.minimap) {
            App.minimap.create();
          }
          overlay.className = overlay.className.replace('fade-in', '');
          return box.className = box.className.replace('flip-in', '');
        });
        return App.actions.updateWPM();
      },
      destroy: function() {
        var newBox, oldBox, overlay;
        oldBox = document.getElementById('js-speedr-box');
        newBox = oldBox.cloneNode(true);
        newBox.className += 'flip-out';
        oldBox.parentNode.replaceChild(newBox, oldBox);
        overlay = document.getElementById('js-speedr-container');
        overlay.className += ' fade-out';
        App.utility.runOnceAfterAnimation(newBox, function() {
          newBox.remove();
          return overlay.remove();
        });
        return App.speedr.reset();
      },
      showWord: function(marker) {
        var html, orp, word, wordBox;
        marker = marker || App.i;
        word = App.text[marker].text;
        orp = Math.round((word.length + 1) * 0.4) - 1;
        html = '<div>' + word.slice(0, orp) + '</div><div class="orp">' + word[orp] + '</div><div>' + word.slice(orp + 1) + '</div>';
        wordBox = document.getElementById('js-speedr-word');
        return wordBox.innerHTML = html;
      },
      reset: function() {
        App.active = false;
        App.pause = true;
        App.text = [];
        App.interval = App.actions.calculateInterval();
        App.i = 0;
        App.wordCount = 0;
        return App.minimapElements = {};
      },
      loop: {
        toggle: function() {
          if (App.pause) {
            return App.speedr.loop.start();
          } else {
            return App.speedr.loop.stop();
          }
        },
        stop: function() {
          App.pause = true;
          clearTimeout(App.loop);
          document.getElementById('js-play-pause').className = 'play-pause button';
          App.i--;
          App.actions.getWordCount();
          if (App.scrollWatcher) {
            return clearTimeout(App.scrollWatcher);
          }
        },
        start: function() {
          if (App.i === App.text.length) {
            App.speedr.loop.reset();
          }
          App.pause = false;
          App.loop = this.create();
          document.getElementById('js-play-pause').className = 'play-pause pause button';
          if (App.scrollWatcher) {
            return App.minimap.scrollWatcher();
          }
        },
        reset: function() {
          App.speedr.loop.stop();
          App.wordCount = 0;
          App.speedr.showWord(App.i = 0);
          if (User.settings.minimap) {
            App.minimap.update();
            if (App.scrollWatcher) {
              return App.minimap.updateScroll();
            }
          }
        },
        create: function() {
          var delay, i, nextWord, word;
          delay = 0;
          i = App.i;
          word = App.text[i];
          nextWord = App.text[i + 1];
          App.speedr.showWord(i);
          App.i++;
          if (User.settings.minimap) {
            App.minimapElements[i].className = 'active';
          }
          if (nextWord) {
            if (User.settings.delayOnPunctuation && word.hasPunctuation) {
              delay = User.settings.punctuationDelayTime;
            }
            if (User.settings.delayOnSentence && nextWord.sentenceStart === i + 1) {
              delay = User.settings.sentenceDelayTime;
            }
            if (User.settings.delayOnLongWords && word.text.length > User.settings.longWordLength) {
              delay += User.settings.longWordDelayTime;
            }
            if (word.paragraphEnd) {
              if (User.settings.delayOnParagraph) {
                delay = User.settings.paragraphDelayTime;
              }
              if (User.settings.pauseOnParagraph) {
                App.speedr.loop.stop();
                return;
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
      }
    },
    minimap: {
      create: function() {
        var contents, i, minimap, paragraphElement, speedrBox, word, wordElement, wordText, _i, _len, _ref;
        minimap = document.createElement('div');
        minimap.id = 'js-speedr-minimap';
        minimap.className = 'speedr-minimap flip-in-left';
        contents = document.createElement('div');
        contents.className = 'contents';
        paragraphElement = document.createElement('p');
        _ref = App.text;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          word = _ref[i];
          wordElement = document.createElement('span');
          wordText = document.createTextNode(word.text);
          wordElement.appendChild(wordText);
          paragraphElement.appendChild(wordElement);
          paragraphElement.appendChild(document.createTextNode(' '));
          if (word.paragraphEnd) {
            contents.appendChild(paragraphElement);
            paragraphElement = document.createElement('p');
          }
          App.minimapElements[i] = wordElement;
        }
        minimap.appendChild(contents);
        speedrBox = document.getElementById('js-speedr-word');
        speedrBox.insertAdjacentElement('afterEnd', minimap);
        App.utility.runOnceAfterAnimation(minimap, function() {
          return minimap.className = minimap.className.replace('flip-in-left', '');
        });
        if (contents.offsetHeight > minimap.offsetHeight) {
          return App.scrollWatcher = true;
        }
      },
      update: function() {
        var i, num, _i, _ref, _results;
        i = App.i;
        _results = [];
        for (num = _i = 0, _ref = App.text.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; num = 0 <= _ref ? ++_i : --_i) {
          _results.push(App.minimapElements[num].className = num <= i ? 'active' : '');
        }
        return _results;
      },
      updateScroll: function() {
        var activeOffset, i, minimap;
        i = App.i;
        minimap = document.getElementById('js-speedr-minimap');
        activeOffset = App.minimapElements[i].offsetTop;
        if (activeOffset - 10 < minimap.scrollTop) {
          App.scrolling = true;
          App.utility.scrollTo(minimap, activeOffset - minimap.offsetHeight + 20, 1000);
        }
        if (activeOffset + 10 > minimap.scrollTop + minimap.offsetHeight) {
          App.scrolling = true;
          return App.utility.scrollTo(minimap, activeOffset - 20, 1000);
        }
      },
      scrollWatcher: function() {
        if (!App.scrolling) {
          App.minimap.updateScroll();
        }
        return App.scrollWatcher = setTimeout(App.minimap.scrollWatcher, App.interval * 5);
      }
    },
    actions: {
      calculateInterval: function() {
        return App.interval = 60000 / User.settings.wpm;
      },
      updateWPM: function() {
        var wpm;
        wpm = document.getElementById('js-speedr-wpm');
        return wpm.innerHTML = User.settings.wpm + ' wpm';
      },
      changeWPM: function(wpm) {
        User.settings.wpm = User.settings.wpm + wpm;
        this.calculateInterval();
        this.updateWPM();
        return App.chrome.settings.save();
      },
      changeFontSize: function(px) {
        var wordContainer;
        User.settings.fontSize = User.settings.fontSize + px;
        wordContainer = document.getElementById('js-speedr-word');
        wordContainer.style.fontSize = User.settings.fontSize + 'px';
        return App.chrome.settings.save();
      },
      prevWord: function() {
        var i;
        i = App.i;
        if (i === 0) {
          return;
        }
        App.speedr.showWord(App.i = i - 1);
        if (User.settings.minimap) {
          App.minimap.update();
          if (App.scrollWatcher) {
            return App.minimap.updateScroll();
          }
        }
      },
      prevSentence: function() {
        var i;
        i = App.i;
        if (i === 0) {
          return;
        }
        App.i = i === App.text[i].sentenceStart ? App.text[i - 1].sentenceStart : App.text[i].sentenceStart;
        App.speedr.showWord();
        App.wordCount = App.i;
        if (User.settings.minimap) {
          App.minimap.update();
          if (App.scrollWatcher) {
            return App.minimap.updateScroll();
          }
        }
      },
      prevParagraph: function() {
        var i;
        i = App.i;
        if (i === 0) {
          return;
        }
        App.i = i === App.text[i].paragraphStart ? App.text[i - 1].paragraphStart : App.text[i].paragraphStart;
        App.speedr.showWord();
        App.wordCount = App.i;
        if (User.settings.minimap) {
          App.minimap.update();
          if (App.scrollWatcher) {
            return App.minimap.updateScroll();
          }
        }
      },
      nextWord: function() {
        var i;
        i = App.i;
        if (i === App.text.length - 1) {
          return;
        }
        App.speedr.showWord(App.i = i + 1);
        App.wordCount = App.i;
        if (User.settings.minimap) {
          App.minimap.update();
          if (App.scrollWatcher) {
            return App.minimap.updateScroll();
          }
        }
      },
      nextSentence: function() {
        var currentSentenceStart, i;
        i = App.i;
        currentSentenceStart = App.text[i].sentenceStart;
        if (i === App.text.length - 1) {
          return;
        }
        while (true) {
          i++;
          if (App.text[i].sentenceStart !== currentSentenceStart) {
            break;
          }
          if (App.text[i + 1] === void 0) {
            i = App.text.length - 1;
            break;
          }
        }
        App.i = i;
        App.speedr.showWord();
        App.wordCount = App.i;
        if (User.settings.minimap) {
          App.minimap.update();
          if (App.scrollWatcher) {
            return App.minimap.updateScroll();
          }
        }
      },
      nextParagraph: function() {
        var currentParagraphStart, i;
        i = App.i;
        currentParagraphStart = App.text[i].paragraphStart;
        if (i === App.text.length - 1) {
          return;
        }
        while (true) {
          i++;
          if (App.text[i].paragraphStart !== currentParagraphStart) {
            break;
          }
          if (App.text[i + 1] === void 0) {
            i = App.text.length - 1;
            break;
          }
        }
        App.i = i;
        App.speedr.showWord();
        App.wordCount = App.i;
        if (User.settings.minimap) {
          App.minimap.update();
          if (App.scrollWatcher) {
            return App.minimap.updateScroll();
          }
        }
      },
      getWordCount: function() {
        var count;
        count = App.i - App.wordCount;
        App.wordCount = App.i;
        return App.chrome.wordCount.save(count);
      }
    },
    chrome: {
      settings: {
        get: function() {
          return chrome.storage.sync.get('settings', function(data) {
            if (data.settings) {
              User.settings = data.settings;
              return App.actions.calculateInterval();
            }
          });
        },
        save: function() {
          return {
            saveSettings: function() {
              return chrome.storage.sync.set(User);
            }
          };
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
      }
    },
    init: function() {
      App.speedr.reset();
      return App.chrome.settings.get();
    }
  };

  window.onkeydown = function(event) {
    var keyCombo;
    keyCombo = App.utility.generateKeyCombo(event);
    switch (User.bindings[keyCombo]) {
      case 'open':
        if (!App.active && window.getSelection().toString().length) {
          App.parse.selection();
          return false;
        }
        break;
      case 'close':
        if (App.active) {
          App.speedr.destroy();
          return false;
        }
        break;
      case 'slower':
        if (App.active) {
          App.actions.changeWPM(-25);
          return false;
        }
        break;
      case 'faster':
        if (App.active) {
          App.actions.changeWPM(25);
          return false;
        }
        break;
      case 'bigger':
        if (App.active) {
          App.actions.changeFontSize(2);
          return false;
        }
        break;
      case 'smaller':
        if (App.active) {
          App.actions.changeFontSize(-2);
          return false;
        }
        break;
      case 'toggle':
        if (App.active) {
          App.speedr.loop.toggle();
          return false;
        }
        break;
      case 'reset':
        if (App.active) {
          App.speedr.loop.reset();
          return false;
        }
        break;
      case 'prev word':
        if (App.active) {
          App.actions.prevWord();
          return false;
        }
        break;
      case 'prev sentence':
        if (App.active) {
          App.actions.prevSentence();
          return false;
        }
        break;
      case 'prev paragraph':
        if (App.active) {
          App.actions.prevParagraph();
          return false;
        }
        break;
      case 'next word':
        if (App.active) {
          App.actions.nextWord();
          return false;
        }
        break;
      case 'next sentence':
        if (App.active) {
          App.actions.nextSentence();
          return false;
        }
        break;
      case 'next paragraph':
        if (App.active) {
          return App.actions.nextParagraph();
        }
    }
  };

  App.init();

}).call(this);
