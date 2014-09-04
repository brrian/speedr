module.exports =
    toggle: ->
        if Speedr.pause then Speedr.loop.startPrepare() else Speedr.loop.stop()

    stop: ->
        # Cache some variables
        doc = document
        settings = User.settings
        toggleClass = Speedr.utility.toggleClass

        Speedr.pause = true
        clearTimeout Speedr.loopTimeout

        # Correct the counter
        Speedr.i--

        # If showStatus is true, we need to show it
        if settings.showStatus
            Speedr.actions.updateStatus()
            toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden')

        if settings.showCountdown
            # Stop the timeout in case they paused while counting down
            clearTimeout(Speedr.countdownTimeout)

            bar = doc.getElementById('js-speedr-countdown-bar')
            oldSpeed = bar.style.transitionDuration
            newSpeed = 150
            
            bar.style.transitionDuration = newSpeed + 'ms, 200ms'
            toggleClass(bar, 'speedr-countdown-bar-zero')

            setTimeout ->
                bar.style.transitionDuration = oldSpeed
            , newSpeed

        if settings.showControls
            playButton = doc.getElementById 'js-play-pause'

            if Speedr.i is Speedr.text.parsed.length - 1
                playButton.textContent = 'restart'
                playButton.setAttribute 'data-tooltip', "Restart#{Speedr.utility.getBinding('reset')}"
            else
                playButton.textContent = 'start'
                playButton.setAttribute 'data-tooltip', 'Start'

        if Speedr.scrollWatcher then clearTimeout Speedr.scrollWatcher

        if Speedr.box.options.sync is true then Speedr.stats.stop()

    startPrepare: ->
        # Cache some variables
        doc = document
        settings = User.settings
        toggleClass = Speedr.utility.toggleClass

        if settings.showControls
            playButton = doc.getElementById 'js-play-pause'
            playButton.textContent = 'stop'
            playButton.setAttribute 'data-tooltip', "Stop#{Speedr.utility.getBinding('toggle')}"

        # Check to see if we're at the end, if so, then we need to reset it first
        if Speedr.i is Speedr.text.parsed.length - 1 then Speedr.loop.reset()

        # Start on the next word
        Speedr.i++

        Speedr.pause = false

        # If we have a context open, destroy it
        if settings.showContext and Speedr.addons.context.activeContext then Speedr.addons.context.destroy()

        # If showStatus is true, we need to hide it
        if settings.showStatus then toggleClass(doc.getElementById('js-speedr-status'), 'speedr-status-hidden')

        if settings.showCountdown
            toggleClass(doc.getElementById('js-speedr-countdown-bar'), 'speedr-countdown-bar-zero')

            Speedr.countdownTimeout = setTimeout @start, settings.countdownSpeed
        else
            @start()

        if Speedr.box.options.sync is true then Speedr.stats.start()

    start: ->
        Speedr.loopTimeout = Speedr.loop.create()
        
        # Check to see if we need to watch for minimap scroll
        if Speedr.scrollWatcher then Speedr.addons.minimap.scrollWatcher()

    reset: ->
        settings = User.settings

        if Speedr.pause is false then Speedr.loop.stop()

        Speedr.box.showWord(Speedr.i = 0)

        if settings.showStatus then Speedr.actions.updateStatus()

        if settings.showMinimap
            Speedr.addons.minimap.update()
            if Speedr.scrollWatcher then Speedr.addons.minimap.updateScroll()

    create: ->
        settings = User.settings

        delay = 0
        i = Speedr.i
        word = Speedr.text.parsed[i]
        nextWord = Speedr.text.parsed[i + 1]

        Speedr.box.showWord(i)
        Speedr.i++

        if settings.showMinimap then Speedr.minimapElements[i].className = 'speedr-minimap-word--read'

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
                return Speedr.loop.stop() if settings.pauseOnParagraph
                if settings.delayOnParagraph then delay = settings.paragraphDelayTime

            Speedr.loopTimeout = setTimeout(Speedr.loop.create, Speedr.interval + delay)
        else
            Speedr.loop.stop()
            if Speedr.scrollWatcher then clearTimeout(Speedr.scrollWatcher)