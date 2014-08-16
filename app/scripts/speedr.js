(function() {
  Math.easeInOutQuad = function(time, begin, change, duration) {
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * time * time + begin;
    } else {
      return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;
    }
  };

  window.User = {
    settings: {
      fontFamily: 'Source Sans Pro',
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
      wpm: 350,
      wordsDisplayed: 8,
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

  window.App = {
    text: {
      sentences: []
    },
    utility: {
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
      toggleClass: function(element, className) {
        var elementClasses;
        elementClasses = element.className;
        if (elementClasses.indexOf(className) === -1) {
          return element.className += ' ' + className;
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
        App.scrolling = true;
        animateScroll = function() {
          var val;
          currentTime += increment;
          val = Math.easeInOutQuad(currentTime, start, change, duration);
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
      }
    },
    parse: {
      selection: function() {
        App.text.original = window.getSelection().toString();
        return this.text();
      },
      text: function() {
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
    },
    speedr: {
      create: function() {
        var box, countdown, doc, elementFunction, item, menu, menuItem, menuItems, overlay, pointer, settings, theme, wordContainer, wordWrapper, _i, _len;
        App.active = true;
        doc = document;
        settings = User.settings;
        theme = User.themes[settings.primaryTheme];
        overlay = doc.createElement('div');
        overlay.id = 'js-speedr-container';
        overlay.className = 'speedr-container fade-in';
        box = doc.createElement('div');
        box.id = 'js-speedr-box';
        box.className = 'speedr-box flip-in';
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
        menu.className = 'speedr-menu speedr-small-text';
        menuItems = ['Alpha', 'Settings', 'Close'];
        for (_i = 0, _len = menuItems.length; _i < _len; _i++) {
          menuItem = menuItems[_i];
          switch (menuItem) {
            case 'Alpha':
              elementFunction = function() {
                return App.utility.openUrl('alpha.html');
              };
              break;
            case 'Settings':
              elementFunction = function() {
                return App.utility.openUrl('options.html');
              };
              break;
            case 'Close':
              elementFunction = App.speedr.destroy;
          }
          item = doc.createElement('li');
          item.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';';
          item.appendChild(doc.createTextNode(menuItem));
          item.addEventListener('click', elementFunction);
          menu.appendChild(item);
        }
        box.appendChild(menu);
        if (settings.showControls) {
          box.appendChild(App.speedrExtras.controls());
        }
        if (settings.showMenuButton) {
          box.appendChild(App.speedrExtras.menuButton());
        }
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        if (settings.showMinimap) {
          App.speedrExtras.minimap.create(settings, theme, box);
        }
        if (settings.showCountdown) {
          box.appendChild(App.speedrExtras.countdown(settings, theme));
          App.actions.updateCountdownBar();
        }
        if (settings.showStatus) {
          box.appendChild(App.speedrExtras.status());
          App.actions.updateStatus();
        }
        if (settings.showWPM) {
          box.appendChild(App.speedrExtras.wpm(theme));
          App.actions.updateWPM();
        }
        return App.utility.runOnceAfterAnimation(box, function() {
          overlay.className = overlay.className.replace(' fade-in', '');
          return box.className = box.className.replace(' flip-in', '');
        });
      },
      destroy: function() {
        var doc, newBox, oldBox, overlay;
        doc = document;
        oldBox = doc.getElementById('js-speedr-box');
        newBox = oldBox.cloneNode(true);
        newBox.className += ' flip-out';
        oldBox.parentNode.replaceChild(newBox, oldBox);
        overlay = doc.getElementById('js-speedr-container');
        overlay.className += ' fade-out';
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
          html = "<div data-before=\"" + (word.slice(0, orp)) + "\" data-after=\"" + (word.slice(orp + 1)) + "\"><span style=\"color: " + theme.highlightColor + ";\">" + word[orp] + "</span></div>";
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
      loop: {
        toggle: function() {
          if (App.pause) {
            return App.speedr.loop.startPrepare();
          } else {
            return App.speedr.loop.stop();
          }
        },
        stop: function() {
          var bar, doc, newSpeed, oldSpeed, settings, toggleClass;
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
            doc.getElementById('js-play-pause').innerText = App.i === App.text.parsed.length - 1 ? 'Restart' : 'Play';
          }
          if (App.scrollWatcher) {
            return clearTimeout(App.scrollWatcher);
          }
        },
        startPrepare: function() {
          var doc, settings, toggleClass;
          doc = document;
          settings = User.settings;
          toggleClass = App.utility.toggleClass;
          if (settings.showControls) {
            doc.getElementById('js-play-pause').innerText = 'Pause';
          }
          if (App.i === App.text.parsed.length - 1) {
            App.speedr.loop.reset();
          }
          App.i++;
          App.pause = false;
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
            return App.speedrExtras.minimap.scrollWatcher();
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
            App.speedrExtras.minimap.update();
            if (App.scrollWatcher) {
              return App.speedrExtras.minimap.updateScroll();
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
            App.minimapElements[i].className = 'speedr-read';
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
      }
    },
    speedrExtras: {
      controls: function() {
        var button, buttons, controls, controlsLeft, controlsRight, doc, element, elementFunction, i, playPause, text, _i, _len;
        doc = document;
        controls = doc.createElement('div');
        controls.className = 'speedr-controls speedr-small-text';
        controlsLeft = doc.createElement('div');
        controlsLeft.className = 'speedr-controls-side';
        controlsRight = doc.createElement('div');
        controlsRight.className = 'speedr-controls-side';
        buttons = ['prev-Para', 'prev-Sent', 'prev-Word', 'play-Pause', 'next-Word', 'next-Sent', 'next-Para'];
        for (i = _i = 0, _len = buttons.length; _i < _len; i = ++_i) {
          button = buttons[i];
          switch (button) {
            case 'prev-Para':
              elementFunction = function() {
                return App.actions.navigateText('prev', 'paragraph');
              };
              break;
            case 'prev-Sent':
              elementFunction = function() {
                return App.actions.navigateText('prev', 'sentence');
              };
              break;
            case 'prev-Word':
              elementFunction = function() {
                return App.actions.navigateText('prev', 'word');
              };
              break;
            case 'play-Pause':
              elementFunction = App.speedr.loop.toggle;
              break;
            case 'next-Word':
              elementFunction = function() {
                return App.actions.navigateText('next', 'word');
              };
              break;
            case 'next-Sent':
              elementFunction = function() {
                return App.actions.navigateText('next', 'sentence');
              };
              break;
            case 'next-Para':
              elementFunction = function() {
                return App.actions.navigateText('next', 'paragraph');
              };
          }
          text = button.split('-').pop();
          element = doc.createElement('div');
          element.className = 'speedr-button';
          element.appendChild(doc.createTextNode(text));
          element.addEventListener('click', elementFunction, false);
          if (i < 3) {
            controlsLeft.appendChild(element);
          } else if (i > 3) {
            controlsRight.appendChild(element);
          } else {
            element.id = 'js-play-pause';
            element.className += ' play-pause';
            element.innerText = 'Play';
            playPause = element;
          }
        }
        controls.appendChild(controlsLeft);
        controls.appendChild(playPause);
        controls.appendChild(controlsRight);
        return controls;
      },
      countdown: function(settings, theme) {
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
      },
      menuButton: function() {
        var doc, menu;
        doc = document;
        menu = doc.createElement('div');
        menu.id = 'js-speedr-menu-button';
        menu.className = 'speedr-menu-button speedr-small-text speedr-button-fade';
        menu.appendChild(doc.createTextNode('Menu'));
        menu.addEventListener('click', App.actions.toggleMenu);
        return menu;
      },
      minimap: {
        create: function(settings, theme, box) {
          var contents, doc, minimap;
          doc = document;
          minimap = doc.createElement('div');
          minimap.id = 'js-speedr-minimap';
          minimap.className = 'speedr-minimap';
          minimap.style.cssText = 'background-color: ' + theme.boxColor + '; width: ' + settings.minimapWidth + 'px; height: ' + settings.boxHeight + 'px; border-left-color: ' + theme.borderColor + ';';
          contents = this.createContents();
          minimap.appendChild(contents);
          box.appendChild(minimap);
          if (contents.offsetHeight > minimap.offsetHeight) {
            return App.scrollWatcher = true;
          }
        },
        createContents: function() {
          var contents, doc, i, paragraphElement, word, wordElement, wordText, _i, _len, _ref;
          doc = document;
          contents = doc.createElement('div');
          contents.className = 'contents';
          paragraphElement = doc.createElement('p');
          _ref = App.text.parsed;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            word = _ref[i];
            wordElement = doc.createElement('span');
            wordText = doc.createTextNode(word.text.replace(/\S/g, '.'));
            wordElement.appendChild(wordText);
            paragraphElement.appendChild(wordElement);
            paragraphElement.appendChild(doc.createTextNode(' '));
            if (word.paragraphEnd) {
              contents.appendChild(paragraphElement);
              paragraphElement = doc.createElement('p');
            }
            App.minimapElements[i] = wordElement;
          }
          App.minimapElements[0].className = 'speedr-read';
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
            _results.push(App.minimapElements[num].className = num <= i ? 'speedr-read' : '');
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
            App.speedrExtras.minimap.updateScroll();
          }
          return App.scrollWatcher = setTimeout(App.speedrExtras.minimap.scrollWatcher, App.interval * 5);
        }
      },
      status: function() {
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
      },
      wpm: function(theme) {
        var wpm;
        wpm = document.createElement('div');
        wpm.id = 'js-speedr-wpm';
        wpm.className = 'speedr-wpm speedr-small-text';
        wpm.style.backgroundColor = theme.boxColor;
        return wpm;
      }
    },
    actions: {
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
          totalWpm = "" + wpm + " WPM";
          totalWords = App.utility.formatNumber(wordsLeft);
        } else {
          totalWpm = "" + (wpm * wordsDisplayed) + " WPM (" + wpm + "&times;" + wordsDisplayed + ")";
          totalWords = wordsLeft !== 0 ? "~" + (App.utility.formatNumber(wordsLeft * wordsDisplayed)) : "0";
        }
        timeLeft = timeLeft === '0.00' ? '0' : "~" + timeLeft;
        wordPlurality = totalWords === '1' ? 'word' : 'words';
        doc.getElementById('js-speedr-time-left').innerHTML = timeLeft + ' s @ ' + totalWpm;
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
        return countdown.style.height = Math.ceil(settings.boxHeight / 2) - Math.ceil((settings.fontSize * 1.25 + 12) / 2) + 'px';
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
        User.settings.wordsDisplayed = settings.wordsDisplayed + words;
        App.i = 0;
        App.text.parsed = [];
        App.parse.text();
        App.speedr.showWord();
        if (settings.showWPM) {
          this.updateWPM();
        }
        if (settings.showStatus) {
          this.updateStatus();
        }
        if (settings.showMinimap) {
          if (App.scrollWatcher) {
            App.speedrExtras.minimap.updateScroll();
          }
          return App.speedrExtras.minimap.updateContents();
        }
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
        if (settings.showMinimap) {
          App.speedrExtras.minimap.update();
          if (App.scrollWatcher) {
            return App.speedrExtras.minimap.updateScroll();
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
        var box, countdownBar, currentTheme, doc, highlighted, menu, menuItem, menuItems, minimap, newTheme, pointer, settings, theme, word, wordContainer, wpm, _i, _len;
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
        highlighted.style.color = theme.highlightColor;
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
          minimap.style.backgroundColor = theme.boxColor;
          minimap.style.borderLeftColor = theme.borderColor;
        }
        if (settings.showCountdown === true) {
          countdownBar = doc.getElementById('js-speedr-countdown-bar');
          countdownBar.style.backgroundColor = theme.highlightColor;
        }
        User.settings.primaryTheme = newTheme;
        User.settings.secondaryTheme = currentTheme;
        return App.chrome.settings.save().speedrExtras;
      }
    },
    chrome: {
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
          App.speedr.create();
          App.speedr.showWord();
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
      case 'more words':
        if (App.active) {
          App.actions.changeWordsDisplayed(+1);
          return false;
        }
        break;
      case 'less words':
        if (App.active) {
          App.actions.changeWordsDisplayed(-1);
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
          App.actions.navigateText('prev', 'word');
          return false;
        }
        break;
      case 'prev sentence':
        if (App.active) {
          App.actions.navigateText('prev', 'sentence');
          return false;
        }
        break;
      case 'prev paragraph':
        if (App.active) {
          App.actions.navigateText('prev', 'paragraph');
          return false;
        }
        break;
      case 'next word':
        if (App.active) {
          App.actions.navigateText('next', 'word');
          return false;
        }
        break;
      case 'next sentence':
        if (App.active) {
          App.actions.navigateText('next', 'sentence');
          return false;
        }
        break;
      case 'next paragraph':
        if (App.active) {
          return App.actions.navigateText('next', 'paragraph');
        }
        break;
      case 'toggle menu':
        if (App.active) {
          return App.actions.toggleMenu();
        }
        break;
      case 'toggle theme':
        if (App.active) {
          return App.actions.toggleTheme();
        }
    }
  };

  App.init();

}).call(this);
