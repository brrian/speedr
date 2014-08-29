common = require './../common/utility.coffee'

module.exports =
    formatNumber: (number) ->
        Number(number).toLocaleString('en')

    findNextOfType: (type) ->
        i = App.i
        currentTypeStart = App.text.parsed[i][type]

        while true
            i++

            break unless App.text.parsed[i][type] is currentTypeStart

            if App.text.parsed[i + 1] is undefined
                i = App.text.parsed.length - 1
                break

        i

    findPrevOfType: (type) ->
        i = App.i

        if i is App.text.parsed[i][type] then App.text.parsed[i - 1][type] else App.text.parsed[i][type]

    toggleClass: (element, className) ->
        # Does this element have this class?
        elementClasses = element.className

        if elementClasses.indexOf(className) is -1
            element.className += " #{className}"
        else
            element.className = elementClasses.replace(className, '')

    runOnceAfterAnimation: (element, callback) ->
        prefixes = ['webkitAnimationEnd', 'animationend']

        for prefix in prefixes
            element.addEventListener prefix, ->
                event.target.removeEventListener event.type, arguments.callee
                callback event

    scrollTo: (element, to, duration) ->
        start = element.scrollTop
        change = to - start
        currentTime = 0
        increment = 20
        App.scrolling = true

        easeInOutQuad = (time, begin, change, duration) ->
            if (time = time/(duration/2)) < 1
                return change/2 * time*time + begin
            else
                return -change/2 * ((time -= 1)*(time-2)-1) + begin

        animateScroll = ->
            currentTime += increment
            val = easeInOutQuad(currentTime, start, change, duration)
            element.scrollTop = val

            if currentTime < duration then setTimeout(animateScroll, increment) else App.scrolling = false

        animateScroll()

    openUrl: (href) ->
        chrome.runtime.sendMessage(
            {url: href}
        )

    getBinding: (action) ->
        humanReadableBinding = ' :'

        for keyBinding, keyAction of User.bindings
            if keyAction is action
                binding = keyBinding
                break

        if binding
            keys = binding.split '+'

            for key in keys
                humanReadableBinding += " #{@parseKeyCode key}"

        else humanReadableBinding = ''

        humanReadableBinding.trim()

    defaults: ->
        target = arguments[0] || {}

        for obj in arguments
            if obj?
                for name of obj
                    copy = obj[name]

                    if target is copy then continue
                    else if copy isnt undefined
                        target[name] = copy

        target

    generateKeyCombo: common.generateKeyCombo

    parseKeyCode: common.parseKeyCode