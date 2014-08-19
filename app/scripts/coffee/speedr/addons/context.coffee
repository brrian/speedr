module.exports =
	init: ->
		speedrWord = document.getElementById 'js-speedr-word'

		speedrWord.addEventListener 'mouseover', =>
			if App.pause then @timeout = setTimeout =>
					@create()
				, 600

		speedrWord.addEventListener 'mouseout', =>
			clearTimeout @timeout

			if @activeContext then @destroy()

	create: ->
		sentence = App.text.sentences[App.text.parsed[App.i].sentenceArrayMarker]

		position = document.getElementById('js-speedr-box').getBoundingClientRect()

		context = document.createElement 'span'
		context.className = 'speedr-context speedr-tooltip-fly-up'
		context.innerText = sentence
		context.style.cssText = "max-width: #{User.settings.boxWidth * .9}px; bottom: #{position.bottom + 10}px;"

		document.body.appendChild context

		@activeContext = context

		App.utility.runOnceAfterAnimation context, ->
		    context.className = context.className.replace ' speedr-tooltip-fly-up', ''

	destroy: ->
		@activeContext.className += ' speedr-fade-out-quick'

		App.utility.runOnceAfterAnimation @activeContext, =>
		    @activeContext.remove()
		    @activeContext = undefined	