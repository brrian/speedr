module.exports = (theme) ->
    wpm = document.createElement('div')
    wpm.id = 'js-speedr-wpm'
    wpm.className = 'speedr-wpm speedr-small-text'
    wpm.style.backgroundColor = theme.boxColor

    wpm