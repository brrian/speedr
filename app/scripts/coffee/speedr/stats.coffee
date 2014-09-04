module.exports = 
    start: ->
        @time = new Date().getTime()
        @index = Speedr.i

        if User.settings.showCountdown then @time += User.settings.countdownSpeed

    stop: ->
        time = new Date().getTime() - @time
        words = Speedr.i - @index + 1

        Speedr.chrome.stats.save time, words