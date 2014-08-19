module.exports =
	create: ->
	    App.active = true

	    # Cache some variables
	    doc = document
	    settings = User.settings
	    theme = User.themes[settings.primaryTheme]

	    # Create the overlay
	    overlay = doc.createElement('div')
	    overlay.id = 'js-speedr-container'
	    overlay.className = 'speedr-container speedr-fade-in'

	    # Create the pop up box
	    box = doc.createElement('div')
	    box.id = 'js-speedr-box'
	    box.className = 'speedr-box speedr-flip-in'
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

	    if settings.showControls then box.appendChild(App.addons.controls())
	    if settings.showMenuButton then box.appendChild(App.addons.menuButton())

	    overlay.appendChild(box)

	    # Add overlay to body
	    document.body.appendChild(overlay)

	    # These must be run after the document has been appended
	    if settings.showMinimap
	        App.addons.minimap.create(settings, theme, box)

	    if settings.showCountdown
	        box.appendChild(App.addons.countdown(settings, theme))
	        App.actions.updateCountdownBar()

	    if settings.showStatus
	        box.appendChild(App.addons.status())
	        App.actions.updateStatus()

	    if settings.showWPM
	        box.appendChild(App.addons.wpm(theme))
	        App.actions.updateWPM()

	    if settings.showTooltips
	    	App.addons.tooltips.init()

	    if settings.showContext 
	    	App.addons.context.init()

	    App.utility.runOnceAfterAnimation box, ->
	        overlay.className = overlay.className.replace(' speedr-fade-in', '')
	        box.className = box.className.replace(' speedr-flip-in', '')

	destroy: ->
	    doc = document

	    # Remove event listeners
	    oldBox = doc.getElementById('js-speedr-box')
	    newBox = oldBox.cloneNode(true)
	    newBox.className += ' speedr-flip-out'

	    oldBox.parentNode.replaceChild(newBox, oldBox)

	    overlay = doc.getElementById('js-speedr-container')
	    overlay.className += ' speedr-fade-out'

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
	        html = "<div data-before=\"#{word.slice(0, orp).replace(/["“”]/g, '&quot;')}\" data-after=\"#{word.slice(orp + 1).replace(/["“”]/g, '&quot;')}\"><span style=\"color: #{theme.highlightColor};\">#{word[orp]}</span></div>"
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

	loop: require './loop.coffee'