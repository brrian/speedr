module.exports = (settings, theme) ->
    doc = document
    countdown = doc.createElement('div')
    countdown.className = 'speedr-countdown'

    bar = doc.createElement('div')
    bar.id = 'js-speedr-countdown-bar'
    bar.className = 'speedr-countdown-bar'
    bar.style.cssText = 'background-color: ' + theme.highlightColor + '; transition-duration: ' + settings.countdownSpeed + 'ms, 200ms;'
    countdown.appendChild(bar)

    countdown