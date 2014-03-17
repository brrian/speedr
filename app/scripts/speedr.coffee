Math.easeInOutQuad = (t, b, c, d) ->
	t /= d/2
	c/2*t*t + b if t < 1
	t--
	-c/2 * (t*(t-2) - 1) + b

# Set some settings
User = {
	settings: {
		wpm: 350
		minimap: true
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
	}
	bindings: {
		'alt+v': 'open'
		'q': 'close'
		' ': 'toggle'
		'û': 'slower'
		'ý': 'faster'
		'r': 'reset'
		'&': 'bigger'
		'(': 'smaller'
		'%': 'prev word'
		'shift+%': 'prev sentence'
		'ctrl+%': 'prev paragraph'
		'\'': 'next word'
		'shift+\'': 'next sentence'
		'ctrl+\'': 'next paragraph'
	}
}

window.App = {
	utility: {
		generateKeyCombo: (event) ->
			# Create key binding
			keyCombo = ''

			if event.ctrlKey then keyCombo += 'ctrl+'
			if event.altKey then keyCombo += 'alt+'
			if event.shiftKey then keyCombo += 'shift+'

			keyCombo += String.fromCharCode(event.keyCode).toLowerCase()

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

			animateScroll = ->
				currentTime += increment
				val = Math.easeInOutQuad(currentTime, start, change, duration)
				element.scrollTop = val

				setTimeout(animateScroll, increment) if currentTime < duration

			animateScroll()

			App.scrolling = false
	}
	parse: {
		selection: ->
			selection = window.getSelection().toString()
			counter = 0

			# Split the selection into paragraphs
			paragraphs = @.splitIntoParagraphs(selection)

			for paragraph in paragraphs
				sentences = @.splitIntoSetences(paragraph)
				paragraphStart = counter

				for sentence in sentences
					words = @.splitIntoWords(sentence)
					sentenceStart = counter

					for word in words
						counter++
						wordObj = {
							text: word
							hasPunctuation: if /[\.,!\?]/.test(word) then true else false
							paragraphStart: paragraphStart
							sentenceStart: sentenceStart
						}

						App.text.push(wordObj)

				App.text[counter - 1].paragraphEnd = true

			App.speedr.create()
			App.speedr.showWord()

		# Return an array of paragraphs
		splitIntoParagraphs: (text) ->
			text.split(/[\r\n]/g).filter( (paragraph) ->
				paragraph.length > 0
			)

		# Return an array of sentences
		splitIntoSetences: (paragraph) ->
			sentences = paragraph.match(/["'“]?([A-Z]((?!([A-Za-z]{2,}|\d+)[.?!]+["']?\s+["']?[A-Z]).)*)(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[A-Z]).)*)?)*((?![.?!]["']?\s+["']?[A-Z]).)*[.?!]+["'”]?/g) || [paragraph]
			sentences.map( (sentence) ->
					sentence.trim()
				)

		# Return an array of words
		splitIntoWords: (sentence) ->
			sentence.split(' ')
	}
	speedr: {
		create: ->
			App.active = true

			# Create the overlay
			overlay = document.createElement('div')
			overlay.id = 'js-speedr-container'
			overlay.className = 'speedr-container fade-in'

			# Create the pop up box
			box = document.createElement('div')
			box.id = 'js-speedr-box'
			box.className = 'speedr-box flip-in'

			# Create the word container
			wordContainer = document.createElement('div')
			wordContainer.id = 'js-speedr-word'
			wordContainer.className = 'speedr-word-container'
			wordContainer.style.fontSize = User.settings.fontSize + 'px'

			# Create the player
			player = document.createElement('div')
			player.className = 'speedr-player'

			# Player buttons
			buttons = ['prev-paragraph', 'prev-sentence', 'prev-word', 'play-pause', 'next-word', 'next-sentence', 'next-paragraph']
			for button in buttons
				switch button
					when 'prev-paragraph'
						elementFunction = App.actions.prevParagraph
					when 'prev-sentence'
						elementFunction = App.actions.prevSentence
					when 'prev-word'
						elementFunction = App.actions.prevWord
					when 'play-pause'
						elementFunction = App.speedr.loop.toggle
					when 'next-word'
						elementFunction = App.actions.nextWord
					when 'next-sentence'
						elementFunction = App.actions.nextSentence
					when 'next-paragraph'
						elementFunction = App.actions.nextParagraph

				element = document.createElement('span')
				element.className = button + ' button'
				element.addEventListener('click', elementFunction, false)

				if button is 'play-pause' then element.id = 'js-play-pause'

				player.appendChild(element)

				# Add whitespace after the element, otherwise the spacing will be off
				player.appendChild(document.createTextNode('\x20'))

			# WPM display
			wpm = document.createElement('div')
			wpm.id = 'js-speedr-wpm'
			wpm.className = 'speedr-wpm'

			box.appendChild(wordContainer)
			box.appendChild(player)
			box.appendChild(wpm)
			overlay.appendChild(box)

			document.body.appendChild(overlay)

			App.utility.runOnceAfterAnimation(
				box
				->
					if User.settings.minimap then App.minimap.create()
					overlay.className = overlay.className.replace('fade-in', '')
					box.className = box.className.replace('flip-in', '')
			)

			App.actions.updateWPM()

		destroy: ->
			# Remove event listeners
			oldBox = document.getElementById('js-speedr-box')
			newBox = oldBox.cloneNode(true)
			newBox.className += 'flip-out'

			oldBox.parentNode.replaceChild(newBox, oldBox)

			overlay = document.getElementById('js-speedr-container')
			overlay.className += ' fade-out'

			# Flip out and fade out
			App.utility.runOnceAfterAnimation(
				newBox
				->
					newBox.remove()
					overlay.remove()
			)

			# Reset some settings
			App.speedr.reset()

		# Split word into different elements along the ORP
		showWord: (marker) ->
			marker = marker || App.i
			word = App.text[marker].text
			orp = Math.round((word.length + 1) * 0.4) - 1
			html = '<div>' + word.slice(0, orp) + '</div><div class="orp">' + word[orp] + '</div><div>' + word.slice(orp + 1) + '</div>'

			wordBox = document.getElementById('js-speedr-word')
			wordBox.innerHTML = html

		reset: ->
			App.active = false
			App.pause = true
			App.text = []
			App.interval = App.actions.calculateInterval()
			App.i = 0
			App.wordCount = 0
			App.minimapElements = {}

		loop: {
			toggle: ->
				if App.pause then App.speedr.loop.start() else App.speedr.loop.stop()

			stop: ->
				App.pause = true
				clearTimeout(App.loop)
				document.getElementById('js-play-pause').className = 'play-pause button'

				# Correct the counter
				App.i--

				App.actions.getWordCount()

				if App.scrollWatcher then clearTimeout(App.scrollWatcher)

			start: ->
				# Check to see if we're at the end, if so, then we need to reset it first
				if App.i is App.text.length then App.speedr.loop.reset()

				App.pause = false
				App.loop = @.create()
				document.getElementById('js-play-pause').className = 'play-pause pause button'
				if App.scrollWatcher then App.minimap.scrollWatcher()

			reset: ->
				App.speedr.loop.stop()

				App.wordCount = 0
				App.speedr.showWord(App.i = 0)

				if User.settings.minimap
					App.minimap.update()
					if App.scrollWatcher then App.minimap.updateScroll()

			create: ->
				delay = 0
				i = App.i
				word = App.text[i]
				nextWord = App.text[i + 1]

				App.speedr.showWord(i)
				App.i++

				if User.settings.minimap
					App.minimapElements[i].className = 'active'

				if nextWord
					if User.settings.delayOnPunctuation and word.hasPunctuation
						delay = User.settings.punctuationDelayTime

					if User.settings.delayOnSentence and nextWord.sentenceStart is i + 1
						delay = User.settings.sentenceDelayTime

					if User.settings.delayOnLongWords and word.text.length > User.settings.longWordLength
						delay += User.settings.longWordDelayTime

					if word.paragraphEnd
						if User.settings.delayOnParagraph then delay = User.settings.paragraphDelayTime
						if User.settings.pauseOnParagraph
							App.speedr.loop.stop()
							return

					App.loop = setTimeout(App.speedr.loop.create, App.interval + delay)
				else
					App.speedr.loop.stop()
					if App.scrollWatcher then clearTimeout(App.scrollWatcher)
		}
	}
	minimap: {
		create: ->
			# Create minimap elements
			minimap = document.createElement('div')
			minimap.id = 'js-speedr-minimap'
			minimap.className = 'speedr-minimap flip-in-left'

			contents = document.createElement('div')
			contents.className = 'contents'

			paragraphElement = document.createElement('p')

			# Loop through each word array and create a element
			for word, i in App.text
				wordElement = document.createElement('span')
				wordText = document.createTextNode(word.text)

				wordElement.appendChild(wordText)
				paragraphElement.appendChild(wordElement)
				paragraphElement.appendChild(document.createTextNode(' '))

				# If this is the end of the paragraph then create a new p element
				if word.paragraphEnd
					contents.appendChild(paragraphElement)
					paragraphElement = document.createElement('p')

				App.minimapElements[i] = wordElement

			minimap.appendChild(contents)

			# Append it to the document
			speedrBox = document.getElementById('js-speedr-word')
			speedrBox.insertAdjacentElement('afterEnd', minimap)

			# Remove the animation class after animation ends
			App.utility.runOnceAfterAnimation(
				minimap
				->
					minimap.className = minimap.className.replace('flip-in-left', '')
			)

			# Finally, check to see if we need to activate the scroll watcher
			if contents.offsetHeight > minimap.offsetHeight then App.scrollWatcher = true

		update: ->
			i = App.i

			for num in [0..App.text.length - 1]
				App.minimapElements[num].className = if num <= i then 'active' else ''

		updateScroll: ->
			# Get the current active word
			i = App.i

			minimap = document.getElementById('js-speedr-minimap')
			activeOffset = App.minimapElements[i].offsetTop

			# Compare the offset position and scroll position
			if activeOffset - 10 < minimap.scrollTop
				App.scrolling = true
				App.utility.scrollTo(minimap, activeOffset - minimap.offsetHeight + 20, 1000)

			if activeOffset + 10 > minimap.scrollTop + minimap.offsetHeight
				App.scrolling = true
				App.utility.scrollTo(minimap, activeOffset - 20, 1000)

		scrollWatcher: ->
			App.minimap.updateScroll() unless App.scrolling

			App.scrollWatcher = setTimeout(App.minimap.scrollWatcher, App.interval * 5)
	}
	actions: {
		calculateInterval: ->
			App.interval = 60000 / User.settings.wpm

		updateWPM: ->
			wpm = document.getElementById('js-speedr-wpm')
			wpm.innerHTML = User.settings.wpm + ' wpm'

		changeWPM: (wpm) ->
			User.settings.wpm = User.settings.wpm + wpm
			@.calculateInterval()
			@.updateWPM()

			App.chrome.saveSettings()

		changeFontSize: (px) ->
			User.settings.fontSize = User.settings.fontSize + px

			wordContainer = document.getElementById('js-speedr-word')
			wordContainer.style.fontSize = User.settings.fontSize + 'px'

			App.chrome.saveSettings()

		prevWord: ->
			i = App.i

			return if i is 0

			App.speedr.showWord(App.i = i - 1)

			if User.settings.minimap
				App.minimap.update()
				if App.scrollWatcher then App.minimap.updateScroll()

		prevSentence: ->
			i = App.i

			return if i is 0

			App.i = if i is App.text[i].sentenceStart then App.text[i - 1].sentenceStart else App.text[i].sentenceStart
			App.speedr.showWord()

			App.wordCount = App.i

			if User.settings.minimap
				App.minimap.update()
				if App.scrollWatcher then App.minimap.updateScroll()

		prevParagraph: ->
			i = App.i

			return if i is 0

			App.i = if i is App.text[i].paragraphStart then App.text[i - 1].paragraphStart else App.text[i].paragraphStart
			App.speedr.showWord()

			App.wordCount = App.i

			if User.settings.minimap
				App.minimap.update()
				if App.scrollWatcher then App.minimap.updateScroll()

		nextWord: ->
			i = App.i

			return if i is App.text.length - 1

			App.speedr.showWord(App.i = i + 1)

			App.wordCount = App.i

			if User.settings.minimap
				App.minimap.update()
				if App.scrollWatcher then App.minimap.updateScroll()

		nextSentence: ->
			i = App.i
			currentSentenceStart = App.text[i].sentenceStart

			return if i is App.text.length - 1

			while true
				i++

				break unless App.text[i].sentenceStart is currentSentenceStart

				if App.text[i + 1] is undefined
					i = App.text.length - 1
					break

			App.i = i
			App.speedr.showWord()

			App.wordCount = App.i

			if User.settings.minimap
				App.minimap.update()
				if App.scrollWatcher then App.minimap.updateScroll()

		nextParagraph: ->
			i = App.i
			currentParagraphStart = App.text[i].paragraphStart

			return if i is App.text.length - 1

			while true
				i++

				break unless App.text[i].paragraphStart is currentParagraphStart

				if App.text[i + 1] is undefined
					i = App.text.length - 1
					break

			App.i = i
			App.speedr.showWord()

			App.wordCount = App.i 

			if User.settings.minimap
				App.minimap.update()
				if App.scrollWatcher then App.minimap.updateScroll()

		getWordCount: ->
			count = App.i - App.wordCount
			App.wordCount = App.i
	}
	chrome: {
		getSettings: ->
			chrome.storage.sync.get(
				(data) ->
					# If we have some stored settings, replace over the defaults
					if data.settings
						User.settings = data.settings
						App.actions.calculateInterval()
			)

		saveSettings: ->
			chrome.storage.sync.set(
				User
			)
	}
	init: ->
		App.speedr.reset()
		App.chrome.getSettings()
}

window.onkeydown = (event) ->
	keyCombo = App.utility.generateKeyCombo(event)

	switch User.bindings[keyCombo]
		when 'open'
			if !App.active and window.getSelection().toString().length
				App.parse.selection()
				false
		when 'close'
			if App.active
				App.speedr.destroy()
				false
		when 'slower'
			if App.active
				App.actions.changeWPM(-25)
				false
		when 'faster'
			if App.active
				App.actions.changeWPM(25)
				false
		when 'bigger'
			if App.active
				App.actions.changeFontSize(2)
				false
		when 'smaller'
			if App.active
				App.actions.changeFontSize(-2)
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
				App.actions.prevWord()
				false
		when 'prev sentence'
			if App.active
				App.actions.prevSentence()
				false
		when 'prev paragraph'
			if App.active
				App.actions.prevParagraph()
				false
		when 'next word'
			if App.active
				App.actions.nextWord()
				false
		when 'next sentence'
			if App.active
				App.actions.nextSentence()
				false
		when 'next paragraph'
			if App.active
				App.actions.nextParagraph()

App.init()