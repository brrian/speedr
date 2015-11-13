module.exports = ->
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