Loop =
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
	    if App.scrollWatcher then App.addons.minimap.scrollWatcher()

	reset: ->
	    settings = User.settings

	    if App.pause is false then App.speedr.loop.stop()

	    App.wordCount = 0
	    App.speedr.showWord(App.i = 0)

	    if settings.showStatus then App.actions.updateStatus()

	    if settings.showMinimap
	        App.addons.minimap.update()
	        if App.scrollWatcher then App.addons.minimap.updateScroll()

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

module.exports = Loop