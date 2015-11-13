module.exports = (theme) ->
    wpm = document.createElement 'div'
    wpm.id = 'js-speedr-wpm'
    wpm.className = 'speedr-wpm'
    wpm.style.backgroundColor = theme.boxColor

    wpm