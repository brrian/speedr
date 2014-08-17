Math.easeInOutQuad = (time, begin, change, duration) ->
    if (time = time/(duration/2)) < 1
        return change/2 * time*time + begin
    else
        return -change/2 * ((time -= 1)*(time-2)-1) + begin

# Set some settings
window.User = 
    settings: 
        fontFamily: 'Source Sans Pro'

        primaryTheme: 'Solarized (Light)'
        secondaryTheme: 'Solarized (Dark)'

        boxWidth: 500
        boxHeight: 245
        minimapWidth: 175

        countdownSpeed: 1000

        showControls: true
        showCountdown: true
        showMenuButton: true
        showMinimap: true
        showStatus: true
        showWPM: true

        wpm: 350
        wordsDisplayed: 8
        fontSize: 33

        delayOnPunctuation: false
        punctuationDelayTime: 1000

        delayOnSentence: false
        sentenceDelayTime: 150

        pauseOnParagraph: false
        delayOnParagraph: false
        paragraphDelayTime: 300

        delayOnLongWords: false
        longWordLength: 8
        longWordDelayTime: 100

    themes: 
        'Solarized (Light)': 
            primaryText: '#444'
            secondaryText: '#657b83'
            boxColor: '#fdf6e3'
            borderColor: 'rgba(175, 150, 190, .2)'
            highlightColor: '#dc322f'

        'Solarized (Dark)': 
            primaryText: '#93a1a1'
            secondaryText: '#657b83'
            boxColor: '#073642'
            borderColor: 'rgba(175, 150, 190, .2)'
            highlightColor: '#cb4b16'

    bindings:
        ' ': 'toggle'
        '%': 'prev word'
        '\'': 'next word'
        '&': 'bigger'
        '(': 'smaller'
        'shift+&': 'more words'
        'shift+(': 'less words'
        'Q': 'close'
        'R': 'reset'
        'alt+V': 'open'
        'ctrl+%': 'prev paragraph'
        'ctrl+\'': 'next paragraph'
        'shift+%': 'prev sentence'
        'shift+\'': 'next sentence'
        'Û': 'slower'
        'Ý': 'faster'
        'M': 'toggle menu'
        'I': 'toggle theme'

window.App = {

    text:
        sentences: []

    utility:

        formatNumber: (number) ->
            Number(number).toLocaleString('en')

        findNextOfType: (type) ->
            i = App.i
            currentTypeStart = App.text.parsed[i][type]

            while true
                i++

                break unless App.text.parsed[i][type] is currentTypeStart

                if App.text.parsed[i + 1] is undefined
                    i = App.text.parsed.length - 1
                    break

            i

        findPrevOfType: (type) ->
            i = App.i

            if i is App.text.parsed[i][type] then App.text.parsed[i - 1][type] else App.text.parsed[i][type]

        generateKeyCombo: (event) ->
            # Create key binding
            keyCombo = ''

            if event.ctrlKey then keyCombo += 'ctrl+'
            if event.altKey then keyCombo += 'alt+'
            if event.shiftKey then keyCombo += 'shift+'

            keyCombo += String.fromCharCode(event.keyCode)

        toggleClass: (element, className) ->
            # Does this element have this class?
            elementClasses = element.className

            if elementClasses.indexOf(className) is -1
                element.className += ' ' + className
            else
                element.className = elementClasses.replace(className, '')

        runOnceAfterAnimation: (element, callback) ->
            prefixes = ['webkitAnimationEnd', 'animationend']

            for prefix in prefixes
                element.addEventListener(
                    prefix
                    ->
                        event.target.removeEventListener(event.type, arguments.callee)
                        callback(event)
                    false
                )

        scrollTo: (element, to, duration) ->
            start = element.scrollTop
            change = to - start
            currentTime = 0
            increment = 20
            App.scrolling = true

            animateScroll = ->
                currentTime += increment
                val = Math.easeInOutQuad(currentTime, start, change, duration)
                element.scrollTop = val

                if currentTime < duration then setTimeout(animateScroll, increment) else App.scrolling = false

            animateScroll()

        openUrl: (href) ->
            chrome.runtime.sendMessage(
                {url: href}
            )

        getBinding: (action) ->
            humanReadableBinding = ' :'

            for keyBinding, keyAction of User.bindings
                if keyAction is action
                    binding = keyBinding
                    break

            if binding
                keys = binding.split '+'

                for key in keys
                    humanReadableBinding += " #{@parseKeyCode key}"

            else humanReadableBinding = ''

            humanReadableBinding.trim()

        parseKeyCode: (binding) ->
            keyCodes = 
                ' ': 'Spacebar'
                '\t': 'Tab'
                'p': 'F1'
                'q': 'F2'
                'r': 'F3'
                's': 'F4'
                't': 'F5'
                'u': 'F6'
                'v': 'F7'
                'w': 'F8'
                'x': 'F9'
                'y': 'F10'
                'z': 'F11'
                '{': 'F12'
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
                '$': 'Home'
                '#': 'End'
                '!': 'PgUp'
                '"': 'PgDn'
                '.': 'Del'
                '&': '\u2191'
                '(': '\u2193'
                '%': '\u2190'
                '\'': '\u2192'
                'o': 'Num /'
                'j': 'Num *'
                'm': 'Num -'
                'k': 'Num +'
                'n': 'Num .'
                '`': 'Num 0'
                'a': 'Num 1'
                'b': 'Num 2'
                'c': 'Num 3'
                'd': 'Num 4'
                'e': 'Num 5'
                'f': 'Num 6'
                'g': 'Num 7'
                'h': 'Num 8'
                'i': 'Num 9'

            keyChar = if keyCodes.hasOwnProperty binding then keyCodes[binding] else binding

            keyChar.charAt(0).toUpperCase() + keyChar.slice(1);

    parse:
        selection: ->
            App.text.original = window.getSelection().toString()

            @text()

        text: ->
            counter = 0
            sentenceCounter = 0

            # Split the selection into paragraphs
            paragraphs = @splitIntoParagraphs App.text.original

            for paragraph in paragraphs
                sentences = @splitIntoSetences paragraph
                paragraphStart = counter

                # Add the sentence into the App.text.sentences array
                App.text.sentences.push.apply App.text.sentences, sentences

                for sentence in sentences
                    words = @splitIntoWords sentence
                    sentenceStart = counter

                    for word in words
                        wordObj =
                            text: word
                            hasPunctuation: if /[\.,!\?]/.test(word) then true else false
                            paragraphStart: paragraphStart
                            sentenceStart: sentenceStart
                            sentenceArrayMarker: sentenceCounter

                        App.text.parsed.push wordObj

                        counter++

                    sentenceCounter++

                App.text.parsed[counter - 1].paragraphEnd = true

        # Return an array of paragraphs
        splitIntoParagraphs: (text) ->
            text.split(/[\r\n]/g).filter( (paragraph) ->
                paragraph.length > 0
            )

        # Return an array of sentences
        splitIntoSetences: (paragraph) ->
            # sentences = paragraph.match(/["'“]?([A-Z]((?!([A-Za-z]{2,}|\d+)[.?!]+["']?\s+["']?[A-Z]).)*)(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[A-Z]).)*)?)*((?![.?!]["']?\s+["']?[A-Z]).)*[.?!]+["'”]?/g) || [paragraph]
            sentences = paragraph.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) || [paragraph]
            sentences.map (sentence) ->
                sentence.trim()

        # Return an array of words
        splitIntoWords: (sentence) ->
            regex = new RegExp "((?:(?:\\S+\\s){#{User.settings.wordsDisplayed}})|(?:.+)(?=\\n|$))", "g"

            sentence.match regex
            # sentence.split(' ')

    speedr:
        create: ->
            App.active = true

            # Cache some variables
            doc = document
            settings = User.settings
            theme = User.themes[settings.primaryTheme]

            # Create the overlay
            overlay = doc.createElement('div')
            overlay.id = 'js-speedr-container'
            overlay.className = 'speedr-container fade-in'

            # Create the pop up box
            box = doc.createElement('div')
            box.id = 'js-speedr-box'
            box.className = 'speedr-box flip-in'
            box.style.cssText = 'color: ' + theme.secondaryText + '; background-color: ' + theme.boxColor + '; width: ' + settings.boxWidth + 'px; height: ' + settings.boxHeight + 'px;'

            # Create the word container
            wordContainer = doc.createElement('div')
            wordContainer.className = 'speedr-word-container'
            wordContainer.style.cssText = 'font-family: ' + settings.fontFamily + '; font-size: ' + settings.fontSize + 'px; border-bottom-color: ' + theme.borderColor + ';'

            wordWrapper = doc.createElement('div')
            wordWrapper.id = 'js-speedr-word'
            wordWrapper.className = 'speedr-word'
            wordWrapper.style.color = theme.primaryText
            wordContainer.appendChild(wordWrapper)

            # Create the triangle pointer
            pointer = doc.createElement('span')
            pointer.className = 'speedr-pointer'
            pointer.style.cssText = 'border-top-color: ' + theme.highlightColor + ';'
            wordContainer.appendChild(pointer)

            # Append word container to box
            box.appendChild(wordContainer)

            # Create the countdown bar
            countdown = doc.createElement('div')
            countdown.className = 'speedr-countdown'

            # Create the menu
            menu = doc.createElement('ul')
            menu.id = 'js-speedr-menu'
            menu.className = 'speedr-menu speedr-small-text'

            menuItems = ['Alpha', 'Settings', 'Close']
            for menuItem in menuItems

                item = doc.createElement 'li'

                switch menuItem
                    when 'Alpha'
                        elementFunction = -> App.utility.openUrl('alpha.html')
                    when 'Settings'
                        elementFunction = -> App.utility.openUrl('options.html')
                    when 'Close'
                        elementFunction = App.speedr.destroy

                        item.className = 'js-speedr-tooltip'
                        item.setAttribute 'data-tooltip', "Close Speedr#{App.utility.getBinding('close')}"

                item.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';'
                item.appendChild(doc.createTextNode(menuItem))
                item.addEventListener('click', elementFunction)

                menu.appendChild(item)

            # Append menu to the box
            box.appendChild(menu)

            if settings.showControls then box.appendChild(App.speedrExtras.controls())
            if settings.showMenuButton then box.appendChild(App.speedrExtras.menuButton())

            overlay.appendChild(box)

            # Add overlay to body
            document.body.appendChild(overlay)

            # These must be run after the document has been appended
            if settings.showMinimap
                App.speedrExtras.minimap.create(settings, theme, box)

            if settings.showCountdown
                box.appendChild(App.speedrExtras.countdown(settings, theme))
                App.actions.updateCountdownBar()

            if settings.showStatus
                box.appendChild(App.speedrExtras.status())
                App.actions.updateStatus()

            if settings.showWPM
                box.appendChild(App.speedrExtras.wpm(theme))
                App.actions.updateWPM()

            App.speedrExtras.tooltips.init()

            App.utility.runOnceAfterAnimation box, ->
                overlay.className = overlay.className.replace(' fade-in', '')
                box.className = box.className.replace(' flip-in', '')

        destroy: ->
            doc = document

            # Remove event listeners
            oldBox = doc.getElementById('js-speedr-box')
            newBox = oldBox.cloneNode(true)
            newBox.className += ' flip-out'

            oldBox.parentNode.replaceChild(newBox, oldBox)

            overlay = doc.getElementById('js-speedr-container')
            overlay.className += ' fade-out'

            # Flip out and fade out
            App.utility.runOnceAfterAnimation newBox, ->
                newBox.remove()
                overlay.remove()

            # Reset some settings
            App.speedr.reset()

        # Split word into different elements along the ORP
        showWord: (marker = App.i) ->
            theme = User.themes[User.settings.primaryTheme]

            word = App.text.parsed[marker].text

            if User.settings.wordsDisplayed is 1
                orp = Math.round((word.length + 1) * 0.4) - 1
                html = "<div data-before=\"#{word.slice(0, orp)}\" data-after=\"#{word.slice(orp + 1)}\"><span style=\"color: #{theme.highlightColor};\">#{word[orp]}</span></div>"
            else
                html = "<div>#{word}</div>"

            wordBox = document.getElementById 'js-speedr-word'
            wordBox.innerHTML = html

        reset: ->
            App.active = false
            App.pause = true
            App.text.sentences = []
            App.text.parsed = []
            App.interval = App.actions.calculateInterval()
            App.i = 0
            App.wordCount = 0
            App.minimapElements = {}

        loop: {
            toggle: ->
                if App.pause then App.speedr.loop.startPrepare() else App.speedr.loop.stop()

            stop: ->
                # Cache some variables
                doc = document
                settings = User.settings
                toggleClass = App.utility.toggleClass

                App.pause = true
                clearTimeout(App.loop)

                # Correct the counter
                App.i--

                App.actions.getWordCount()

                # If showStatus is true, we need to show it
                if settings.showStatus
                    App.actions.updateStatus()
                    toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden')

                if settings.showCountdown
                    # Stop the timeout in case they paused while counting down
                    clearTimeout(App.countdownTimeout)

                    bar = doc.getElementById('js-speedr-countdown-bar')
                    oldSpeed = bar.style.transitionDuration
                    newSpeed = 150
                    
                    bar.style.transitionDuration = newSpeed + 'ms, 200ms'
                    toggleClass(bar, 'speedr-countdown-bar-zero')

                    setTimeout(
                        ->
                            bar.style.transitionDuration = oldSpeed
                        newSpeed
                    )

                if settings.showControls
                    playButton = doc.getElementById 'js-play-pause'

                    if App.i is App.text.parsed.length - 1
                        playButton.innerText = 'Restart'
                        playButton.setAttribute 'data-tooltip', "Restart#{App.utility.getBinding('reset')}"
                    else
                        playButton.innerText = 'Play'
                        playButton.setAttribute 'data-tooltip', 'Play'

                if App.scrollWatcher then clearTimeout(App.scrollWatcher)

            startPrepare: ->
                # Cache some variables
                doc = document
                settings = User.settings
                toggleClass = App.utility.toggleClass

                if settings.showControls
                    playButton = doc.getElementById 'js-play-pause'
                    playButton.innerText = 'Pause'
                    playButton.setAttribute 'data-tooltip', "Pause#{App.utility.getBinding('toggle')}"

                # Check to see if we're at the end, if so, then we need to reset it first
                if App.i is App.text.parsed.length - 1 then App.speedr.loop.reset()

                # Start on the next word
                App.i++

                App.pause = false

                # If showStatus is true, we need to hide it
                if settings.showStatus then toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden')

                if settings.showCountdown
                    toggleClass(doc.getElementById('js-speedr-countdown-bar'), 'speedr-countdown-bar-zero')

                    App.countdownTimeout = setTimeout(@start, settings.countdownSpeed)
                else
                    @start()

            start: ->
                App.loop = App.speedr.loop.create()
                
                # Check to see if we need to watch for minimap scroll
                if App.scrollWatcher then App.speedrExtras.minimap.scrollWatcher()

            reset: ->
                settings = User.settings

                if App.pause is false then App.speedr.loop.stop()

                App.wordCount = 0
                App.speedr.showWord(App.i = 0)

                if settings.showStatus then App.actions.updateStatus()

                if settings.showMinimap
                    App.speedrExtras.minimap.update()
                    if App.scrollWatcher then App.speedrExtras.minimap.updateScroll()

            create: ->
                settings = User.settings

                delay = 0
                i = App.i
                word = App.text.parsed[i]
                nextWord = App.text.parsed[i + 1]

                App.speedr.showWord(i)
                App.i++

                if settings.showMinimap then App.minimapElements[i].className = 'speedr-read'

                if nextWord
                    if settings.delayOnPunctuation and word.hasPunctuation
                        delay = settings.punctuationDelayTime

                    if settings.delayOnSentence and nextWord.sentenceStart is i + 1
                        delay = settings.sentenceDelayTime

                    if settings.delayOnLongWords 
                        if settings.wordsDisplayed is 1 and word.text.length > settings.longWordLength then multiplier = 1
                        else
                            regex = new RegExp "\\w{#{settings.longWordLength},}", "g"
                            matches = word.text.match(regex)
                            multiplier = if matches then matches.length else 0

                        delay += settings.longWordDelayTime * multiplier

                    if word.paragraphEnd
                        return App.speedr.loop.stop() if settings.pauseOnParagraph
                        if settings.delayOnParagraph then delay = settings.paragraphDelayTime

                    App.loop = setTimeout(App.speedr.loop.create, App.interval + delay)
                else
                    App.speedr.loop.stop()
                    if App.scrollWatcher then clearTimeout(App.scrollWatcher)
        }

    speedrExtras:
        controls: ->
            doc = document

            controls = doc.createElement('div')
            controls.className = 'speedr-controls speedr-small-text'

            controlsLeft = doc.createElement('div')
            controlsLeft.className = 'speedr-controls-side'

            controlsRight = doc.createElement('div')
            controlsRight.className = 'speedr-controls-side'

            buttons = ['prev-Para', 'prev-Sent', 'prev-Word', 'play-Pause', 'next-Word', 'next-Sent', 'next-Para']
            for button, i in buttons
                element = doc.createElement 'div'

                switch button
                    when 'prev-Para'
                        elementFunction = -> App.actions.navigateText('prev', 'paragraph')
                        element.setAttribute 'data-tooltip', "Previous Paragraph#{App.utility.getBinding('prev paragraph')}"
                    when 'prev-Sent'
                        elementFunction = -> App.actions.navigateText('prev', 'sentence')
                        element.setAttribute 'data-tooltip', "Previous Sentence#{App.utility.getBinding('prev sentence')}"
                    when 'prev-Word'
                        elementFunction = -> App.actions.navigateText('prev', 'word')
                        element.setAttribute 'data-tooltip', "Previous Word#{App.utility.getBinding('prev word')}"
                    when 'play-Pause'
                        elementFunction = App.speedr.loop.toggle
                        element.setAttribute 'data-tooltip', "Play#{App.utility.getBinding('toggle')}"
                    when 'next-Word'
                        elementFunction = -> App.actions.navigateText('next', 'word')
                        element.setAttribute 'data-tooltip', "Next Word#{App.utility.getBinding('next word')}"
                    when 'next-Sent'
                        elementFunction = -> App.actions.navigateText('next', 'sentence')
                        element.setAttribute 'data-tooltip', "Next Sentence#{App.utility.getBinding('next sentence')}"
                    when 'next-Para'
                        elementFunction = -> App.actions.navigateText('next', 'paragraph')
                        element.setAttribute 'data-tooltip', "Next Paragraph#{App.utility.getBinding('next paragraph')}"

                text = button.split('-').pop()

                element.className = 'speedr-button js-speedr-tooltip'
                element.appendChild(doc.createTextNode(text))
                element.addEventListener('click', elementFunction, false)

                if i < 3 then controlsLeft.appendChild(element)
                else if i > 3 then controlsRight.appendChild(element)
                else
                    element.id = 'js-play-pause'
                    element.className += ' play-pause'
                    element.innerText = 'Play'

                    playPause = element

            controls.appendChild(controlsLeft)
            controls.appendChild(playPause)
            controls.appendChild(controlsRight)

            controls

        countdown: (settings, theme) ->
            doc = document
            countdown = doc.createElement('div')
            countdown.className = 'speedr-countdown'

            bar = doc.createElement('div')
            bar.id = 'js-speedr-countdown-bar'
            bar.className = 'speedr-countdown-bar'
            bar.style.cssText = 'background-color: ' + theme.highlightColor + '; transition-duration: ' + settings.countdownSpeed + 'ms, 200ms;'
            countdown.appendChild(bar)

            countdown

        menuButton: ->
            doc = document

            menu = doc.createElement('div')
            menu.id = 'js-speedr-menu-button'
            menu.className = 'speedr-menu-button speedr-small-text speedr-button-fade js-speedr-tooltip'
            menu.setAttribute 'data-tooltip', "Toggle Menu#{App.utility.getBinding('toggle menu')}"
            menu.appendChild(doc.createTextNode('Menu'))
            menu.addEventListener('click', App.actions.toggleMenu)

            menu

        minimap:
            create: (settings, theme, box) ->
                doc = document

                # Create minimap elements
                minimap = doc.createElement('div')
                minimap.id = 'js-speedr-minimap'
                minimap.className = 'speedr-minimap'
                minimap.style.cssText = 'background-color: ' + theme.boxColor + '; width: ' + settings.minimapWidth + 'px; height: ' + settings.boxHeight + 'px; border-left-color: ' + theme.borderColor + ';'

                contents = @createContents()

                minimap.appendChild(contents)

                box.appendChild(minimap)

                # Finally, check to see if we need to activate the scroll watcher
                if contents.offsetHeight > minimap.offsetHeight then App.scrollWatcher = true

            createContents: ->
                doc = document

                contents = doc.createElement('div')
                contents.className = 'contents'

                paragraphElement = doc.createElement('p')

                # Loop through each word array and create a element
                for word, i in App.text.parsed
                    wordElement = doc.createElement('span')
                    wordText = doc.createTextNode(word.text.replace(/\S/g, '.'))

                    wordElement.appendChild(wordText)
                    paragraphElement.appendChild(wordElement)
                    paragraphElement.appendChild(doc.createTextNode(' '))

                    # If this is the end of the paragraph then create a new p element
                    if word.paragraphEnd
                        contents.appendChild(paragraphElement)
                        paragraphElement = doc.createElement('p')

                    App.minimapElements[i] = wordElement

                # Make the first element active
                App.minimapElements[0].className = 'speedr-read'

                contents

            updateContents: ->
                minimap = document.getElementById 'js-speedr-minimap'

                oldContents = minimap.getElementsByClassName('contents')[0]

                contents = @createContents()

                minimap.replaceChild contents, oldContents

            update: ->
                i = App.i

                for num in [0..App.text.parsed.length - 1]
                    App.minimapElements[num].className = if num <= i then 'speedr-read' else ''

            updateScroll: ->
                # Get the current active word
                i = App.i

                minimap = document.getElementById('js-speedr-minimap')
                activeOffset = App.minimapElements[i].offsetTop

                if App.scrolling is false or App.scrolling is undefined
                    # Compare the offset position and scroll position
                    if User.settings.boxHeight - (activeOffset - minimap.scrollTop) < 50
                        App.utility.scrollTo(minimap, activeOffset, 1000)

                    if App.pause is true and activeOffset < minimap.scrollTop
                        App.utility.scrollTo(minimap, activeOffset - User.settings.boxHeight + 60, 1000)

            scrollWatcher: ->
                App.speedrExtras.minimap.updateScroll() unless App.scrolling

                App.scrollWatcher = setTimeout(App.speedrExtras.minimap.scrollWatcher, App.interval * 5)

        status: ->
            doc = document

            status = doc.createElement('div')
            status.id = 'js-speedr-status'
            status.className = 'speedr-status speedr-small-text'

            wordsLeft = doc.createElement('span')
            wordsLeft.id = 'js-speedr-words-left'
            wordsLeft.className = 'speedr-status-item'
            status.appendChild(wordsLeft)

            timeLeft = doc.createElement('span')
            timeLeft.id = 'js-speedr-time-left'
            timeLeft.className = 'speedr-status-item'
            status.appendChild(timeLeft)

            status

        tooltips:
            init: ->
                tooltips = document.getElementsByClassName 'js-speedr-tooltip'

                for tooltip in tooltips
                    tooltip.addEventListener 'mouseover', =>
                        target = event.target

                        @timeout = setTimeout =>
                            @create target
                        , 500

                    tooltip.addEventListener 'mouseout', =>
                        clearTimeout @timeout

                        if @activeTooltip then @destroy()

                    tooltip.addEventListener 'click', =>
                        if @activeTooltip then @destroy()

            create: (element) ->
                position = element.getBoundingClientRect()

                tooltip = document.createElement 'span'
                tooltip.className = 'speedr-tooltip'
                tooltip.innerText = element.getAttribute 'data-tooltip'
                tooltip.style.cssText = "top: #{position.top}; left: #{position.left + (position.width / 2)};"

                @activeTooltip = tooltip

                document.body.appendChild tooltip

            destroy: (tooltip = @activeTooltip) ->
                tooltip.className += ' fade-out-quick'

                App.utility.runOnceAfterAnimation tooltip, ->
                    tooltip.remove()

                @activeTooltip = undefined

        wpm: (theme) ->
            wpm = document.createElement('div')
            wpm.id = 'js-speedr-wpm'
            wpm.className = 'speedr-wpm speedr-small-text'
            wpm.style.backgroundColor = theme.boxColor

            wpm

    actions:
        calculateInterval: ->
            App.interval = 60000 / User.settings.wpm

        updateStatus: ->
            doc = document

            wpm = User.settings.wpm
            wordsDisplayed = User.settings.wordsDisplayed

            wordsLeft = App.text.parsed.length - App.i - 1
            timeLeft = (wordsLeft / wpm * 60).toFixed(2)

            if wordsDisplayed is 1
                totalWpm = "#{wpm} WPM"
                totalWords = App.utility.formatNumber wordsLeft
            else
                totalWpm = "#{wpm * wordsDisplayed} WPM (#{wpm}&times;#{wordsDisplayed})"
                totalWords = unless wordsLeft is 0 then "~#{App.utility.formatNumber(wordsLeft * wordsDisplayed)}" else "0"

            timeLeft = if timeLeft is '0.00' then '0' else "~#{timeLeft}"
            wordPlurality = if totalWords is '1' then 'word' else 'words'

            doc.getElementById('js-speedr-time-left').innerHTML = timeLeft + ' s @ ' + totalWpm
            doc.getElementById('js-speedr-words-left').innerHTML = "#{totalWords} #{wordPlurality} left"

        updateWPM: ->
            wpm = document.getElementById('js-speedr-wpm')

            if User.settings.wordsDisplayed is 1
                wpm.innerHTML = User.settings.wpm + ' wpm'
            else
                wpm.innerHTML = "#{User.settings.wpm * User.settings.wordsDisplayed} wpm (#{User.settings.wpm}&times;#{User.settings.wordsDisplayed})"

        updateCountdownBar: ->
            settings = User.settings
            countdown = document.getElementById('js-speedr-countdown-bar').offsetParent

            # Calculate the position of the bar (1.25 is the line-height, 12 is for the padding)
            countdown.style.height = Math.ceil(settings.boxHeight / 2) - Math.ceil((settings.fontSize * 1.25 + 12) / 2) + 'px'

        changeWPM: (wpm) ->
            settings = User.settings

            return if settings.wpm is 0 and wpm < 0

            User.settings.wpm = User.settings.wpm + wpm
            @calculateInterval()

            if settings.showWPM then @updateWPM()
            if settings.showStatus then @updateStatus()

            App.chrome.settings.save()

        changeFontSize: (px) ->
            settings = User.settings

            return if (settings.fontSize + px) < 8

            User.settings.fontSize = settings.fontSize + px

            wordContainer = document.getElementById('js-speedr-word')
            wordContainer.style.fontSize = User.settings.fontSize + 'px'

            if settings.showCountdown then App.actions.updateCountdownBar()

            App.chrome.settings.save()

        changeWordsDisplayed: (words) ->
            settings = User.settings

            return if (settings.wordsDisplayed + words) < 1

            # First we pause
            App.speedr.loop.stop() if App.pause is false

            User.settings.wordsDisplayed = settings.wordsDisplayed + words

            App.i = 0
            App.text.parsed = []

            App.parse.text()
            App.speedr.showWord()

            if settings.showWPM then @updateWPM()
            if settings.showStatus then @updateStatus()
            if settings.showMinimap
                if App.scrollWatcher then App.speedrExtras.minimap.updateScroll()
                App.speedrExtras.minimap.updateContents()

        navigateText: (direction, type) ->
            i = App.i
            settings = User.settings

            # First we pause
            App.speedr.loop.stop() if App.pause is false

            return if i is 0 and direction is 'prev'
            return if i is App.text.parsed.length - 1 and direction is 'next'

            switch type
                when 'word'
                    App.i = if direction is 'prev' then i - 1 else i + 1
                when 'sentence'
                    App.i = if direction is 'prev' then App.utility.findPrevOfType('sentenceStart') else App.utility.findNextOfType('sentenceStart')
                when 'paragraph'
                    App.i = if direction is 'prev' then App.utility.findPrevOfType('paragraphStart') else App.utility.findNextOfType('paragraphStart')

            App.speedr.showWord()

            App.wordCount = App.i

            if settings.showStatus then App.actions.updateStatus()

            if settings.showMinimap
                App.speedrExtras.minimap.update()
                if App.scrollWatcher then App.speedrExtras.minimap.updateScroll()

        getWordCount: ->
            count = App.i - App.wordCount
            App.wordCount = App.i
            App.chrome.wordCount.save(count)

        toggleMenu: ->
            doc = document
            toggleClass = App.utility.toggleClass

            if User.settings.showMenuButton then toggleClass(doc.getElementById('js-speedr-menu-button'), 'speedr-menu-button-active')
            
            toggleClass(doc.getElementById('js-speedr-menu'), 'speedr-menu-active')

        toggleTheme: ->
            doc = document
            settings = User.settings
            currentTheme = settings.primaryTheme
            newTheme = settings.secondaryTheme
            theme = User.themes[newTheme]

            # Now we gotta change variables
            box = doc.getElementById 'js-speedr-box'
            box.style.color = theme.primaryText
            box.style.backgroundColor = theme.boxColor

            wordContainer = box.getElementsByClassName('speedr-word-container')[0]
            wordContainer.style.borderBottomColor = theme.borderColor

            word = doc.getElementById 'js-speedr-word'
            word.style.color = theme.primaryText

            highlighted = word.getElementsByTagName('span')[0]
            if highlighted then highlighted.style.color = theme.highlightColor

            pointer = wordContainer.getElementsByClassName('speedr-pointer')[0]
            pointer.style.borderTopColor = theme.highlightColor

            menu = doc.getElementById 'js-speedr-menu'
            menuItems = menu.getElementsByTagName 'li'
            for menuItem in menuItems
                menuItem.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';'

            if settings.showWPM is true
                wpm = doc.getElementById 'js-speedr-wpm'
                wpm.style.backgroundColor = theme.boxColor

            if settings.showMinimap is true
                minimap = doc.getElementById 'js-speedr-minimap'
                minimap.style.backgroundColor = theme.boxColor
                minimap.style.borderLeftColor = theme.borderColor

            if settings.showCountdown is true
                countdownBar = doc.getElementById 'js-speedr-countdown-bar'
                countdownBar.style.backgroundColor = theme.highlightColor

            User.settings.primaryTheme = newTheme
            User.settings.secondaryTheme = currentTheme

            App.chrome.settings.save()

    chrome:
        settings:
            get: ->
                chrome.storage.sync.get(
                    ['settings', 'bindings']
                    (data) ->
                        # If we have some stored settings, replace over the defaults
                        if data.settings
                            App.chrome.settings.store(data.settings, 'settings')
                            # User.settings = data.settings
                            App.actions.calculateInterval()

                        if data.bindings then User.bindings = data.bindings
                )
            save: ->
                chrome.storage.sync.set(User)

            store: (object, area) ->
                area = User[area]

                for setting, value of object
                    area[setting] = value

        wordCount:
            save: (count) ->
                chrome.storage.sync.get(
                    'wordCount'
                    (data) ->
                        wordCount = data.wordCount || 0

                        chrome.storage.sync.set({wordCount: wordCount + count})
                )

    init: ->
        App.speedr.reset()
        App.chrome.settings.get()
}

window.onkeydown = (event) ->
    keyCombo = App.utility.generateKeyCombo(event)

    switch User.bindings[keyCombo]
        when 'open'
            if !App.active and window.getSelection().toString().length
                App.parse.selection()
                App.speedr.create()
                App.speedr.showWord()
                false
        when 'close'
            if App.active
                App.speedr.destroy()
                false
        when 'slower'
            if App.active
                App.actions.changeWPM -25
                false
        when 'faster'
            if App.active
                App.actions.changeWPM 25
                false
        when 'bigger'
            if App.active
                App.actions.changeFontSize 2
                false
        when 'smaller'
            if App.active
                App.actions.changeFontSize -2
                false
        when 'more words'
            if App.active
                App.actions.changeWordsDisplayed +1
                false
        when 'less words'
            if App.active
                App.actions.changeWordsDisplayed -1
                false
        when 'toggle'
            if App.active
                App.speedr.loop.toggle()
                false
        when 'reset'
            if App.active
                App.speedr.loop.reset()
                false
        when 'prev word'
            if App.active
                App.actions.navigateText('prev', 'word')
                false
        when 'prev sentence'
            if App.active
                App.actions.navigateText('prev', 'sentence')
                false
        when 'prev paragraph'
            if App.active
                App.actions.navigateText('prev', 'paragraph')
                false
        when 'next word'
            if App.active
                App.actions.navigateText('next', 'word')
                false
        when 'next sentence'
            if App.active
                App.actions.navigateText('next', 'sentence')
                false
        when 'next paragraph'
            if App.active
                App.actions.navigateText('next', 'paragraph')
        when 'toggle menu'
            if App.active
                App.actions.toggleMenu()
        when 'toggle theme'
            if App.active
                App.actions.toggleTheme()

App.init()