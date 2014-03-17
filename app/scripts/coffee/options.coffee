$ = jQuery

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

getSettings = ->
	dfd = $.Deferred()

	chrome.storage.sync.get(
		['settings', 'bindings']
		(data) ->
			dfd.resolve(data)
	)

	dfd.promise()

getSettings().then(
	(data) ->
		console.log 'here is your data'
		console.log data
)