module.exports = ->
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