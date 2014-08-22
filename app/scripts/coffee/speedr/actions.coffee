module.exports =
    calculateInterval: ->
        App.interval = 60000 / User.settings.wpm

    updateStatus: ->
        doc = document

        wpm = User.settings.wpm
        wordsDisplayed = User.settings.wordsDisplayed

        wordsLeft = App.text.parsed.length - App.i - 1
        timeLeft = (wordsLeft / wpm * 60).toFixed(2)

        if wordsDisplayed is 1
            totalWpm = "#{wpm} wpm"
            totalWords = App.utility.formatNumber wordsLeft
        else
            totalWpm = "#{wpm * wordsDisplayed} wpm (#{wpm}&times;#{wordsDisplayed})"
            totalWords = unless wordsLeft is 0 then "~#{App.utility.formatNumber(wordsLeft * wordsDisplayed)}" else "0"

        timeLeft = if timeLeft is '0.00' then '0' else "~#{timeLeft}"
        wordPlurality = if totalWords is '1' then 'word' else 'words'

        doc.getElementById('js-speedr-time-left').innerHTML = timeLeft + 's @ ' + totalWpm
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

        # Calculate the position of the bar (1.4 is the line-height, 12 is for the padding)
        countdown.style.height = Math.ceil(settings.boxHeight / 2) - Math.ceil((settings.fontSize * 1.4 + 12) / 2) + 'px'

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

        App.parse.loop()
        App.speedr.showWord()

        if settings.showWPM then @updateWPM()
        if settings.showStatus then @updateStatus()
        if settings.showMinimap
            if App.scrollWatcher then App.addons.minimap.updateScroll()
            App.addons.minimap.updateContents()

        App.chrome.settings.save()

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

        if settings.showContext and App.addons.context.activeContext
            document.querySelector('.speedr-context').innerText = App.text.sentences[App.text.parsed[App.i].sentenceArrayMarker]

        if settings.showMinimap
            App.addons.minimap.update()
            if App.scrollWatcher then App.addons.minimap.updateScroll()

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
            minimapWidth = minimap.offsetWidth
            minimapHeight = minimap.offsetHeight
            minimap.style.cssText = "width: #{minimapWidth}px; height: #{minimapHeight}; background-color: #{theme.boxColor}; border-left-color: #{theme.borderColor}; box-shadow: -3px 0 0 #{theme.boxColor}"

            contents = minimap.querySelector '.contents'
            contents.style.backgroundImage = "linear-gradient(to right, #{theme.secondaryText} 50%, rgba(255, 255, 255, 0) 20%)"

        if settings.showCountdown is true
            countdownBar = doc.getElementById 'js-speedr-countdown-bar'
            countdownBar.style.backgroundColor = theme.highlightColor

        User.settings.primaryTheme = newTheme
        User.settings.secondaryTheme = currentTheme

        App.chrome.settings.save()