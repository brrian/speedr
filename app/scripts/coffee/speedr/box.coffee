module.exports =
    init: (text, options) ->
        @options = Speedr.utility.defaults
            overlay: true
            animate: true
            sync: true
            style: ''
        , options || {}

        Speedr.parse.text text 
        Speedr.box.create()
        Speedr.box.showWord()

    create: ->
        Speedr.active = true

        # Cache some variables
        doc = document
        settings = User.settings
        theme = User.themes[settings.primaryTheme]

        # Create the pop up box
        box = doc.createElement 'div'
        box.id = 'js-speedr-box'
        box.className = 'speedr-box'
        box.style.cssText = "color: #{theme.secondaryText}; background-color: #{theme.boxColor}; width: #{settings.boxWidth}px; height: #{settings.boxHeight}px;"

        # Create the word container
        wordContainer = doc.createElement 'div'
        wordContainer.className = 'speedr-word-container'
        wordContainer.style.cssText = "font-family: #{settings.fontFamily}; font-weight: #{settings.fontWeight}; font-size: #{settings.fontSize}px; border-bottom-color: #{theme.borderColor};"

        wordWrapper = doc.createElement 'div'
        wordWrapper.id = 'js-speedr-word'
        wordWrapper.className = 'speedr-word'
        wordWrapper.style.color = theme.primaryText
        wordContainer.appendChild wordWrapper

        # Create the triangle pointer
        pointer = doc.createElement 'span'
        pointer.className = 'speedr-pointer'
        pointer.style.cssText = "border-top-color: #{theme.highlightColor};"
        wordContainer.appendChild pointer

        # Speedr.nd word container to box
        box.appendChild wordContainer

        # Create the countdown bar
        countdown = doc.createElement 'div'
        countdown.className = 'speedr-countdown'

        # Create the menu
        menu = doc.createElement 'ul'
        menu.id = 'js-speedr-menu'
        menu.className = 'speedr-menu'

        menuItems = ['settings', 'close']
        for menuItem in menuItems

            item = doc.createElement 'li'

            switch menuItem
                when 'settings'
                    elementFunction = -> Speedr.utility.openUrl 'options.html'
                when 'close'
                    elementFunction = Speedr.box.destroy

                    item.className = 'js-speedr-tooltip'
                    item.setAttribute 'data-tooltip', "Close Speedr#{Speedr.utility.getBinding('close')}"

            item.style.cssText = 'border-bottom-color: ' + theme.borderColor + '; background-color: ' + theme.boxColor + ';'
            item.appendChild doc.createTextNode(menuItem)
            item.addEventListener 'click', elementFunction

            menu.appendChild item

        # Speedr.nd menu to the box
        box.appendChild menu

        if settings.showControls then box.appendChild Speedr.addons.controls()
        if settings.showMenuButton then box.appendChild Speedr.addons.menuButton()

        # Speedr.y the different options
        if @options.style
            box.style.cssText += " #{@options.style}"

        if @options.overlay
            # Create the overlay
            overlay = doc.createElement 'div'
            overlay.id = 'js-speedr-container'
            overlay.className = 'speedr-container'

            overlay.appendChild box

        if @options.animate
            box.className += ' speedr-flip-in'
            if overlay then overlay.className += ' speedr-fade-in'

            Speedr.utility.runOnceAfterAnimation box, ->
                box.className = box.className.replace ' speedr-flip-in', ''
                if overlay then overlay.className = overlay.className.replace ' speedr-fade-in', ''

        if overlay then document.body.appendChild overlay else document.body.appendChild box

        # These must be run after the document has been appended
        if settings.showMinimap
            Speedr.addons.minimap.create settings, theme, box

        if settings.showCountdown
            box.appendChild Speedr.addons.countdown(settings, theme)
            Speedr.actions.updateCountdownBar()

        if settings.showStatus
            box.appendChild Speedr.addons.status()
            Speedr.actions.updateStatus()

        if settings.showWPM
            box.appendChild Speedr.addons.wpm(theme)
            Speedr.actions.updateWPM()

        if settings.showTooltips
            Speedr.addons.tooltips.init()

        if settings.showContext 
            Speedr.addons.context.init()

    destroy: ->
        doc = document

        # Remove event listeners
        oldBox = doc.getElementById 'js-speedr-box'
        newBox = oldBox.cloneNode true

        oldBox.parentNode.replaceChild newBox, oldBox

        overlay = doc.getElementById 'js-speedr-container'

        if @options.animate
            newBox.className += ' speedr-flip-out'
            if overlay then overlay.className += ' speedr-fade-out'

            # Flip out and fade out
            Speedr.utility.runOnceAfterAnimation newBox, ->
                newBox.remove()
                if overlay then overlay.remove()
        else
            newBox.remove()
            if overlay then overlay.remove()

        # If tooltips or context popups are active, destroy them
        if User.settings.showTooltips and Speedr.addons.tooltips.activeTooltip then Speedr.addons.tooltips.destroy()
        if User.settings.showContext and Speedr.addons.context.activeContext then Speedr.addons.context.destroy()

        # Reset some settings
        Speedr.box.reset()

    # Split word into different elements along the ORP
    showWord: (marker = Speedr.i) ->
        theme = User.themes[User.settings.primaryTheme]

        word = Speedr.text.parsed[marker].text

        if User.settings.wordsDisplayed is 1
            orp = Math.round((word.length + 1) * 0.4) - 1
            html = "<div data-before=\"#{word.slice(0, orp).replace(/["“”]/g, '&quot;')}\" data-after=\"#{word.slice(orp + 1).replace(/["“”]/g, '&quot;')}\"><span style=\"color: #{theme.highlightColor};\">#{word[orp]}</span></div>"
        else
            html = "<div>#{word}</div>"

        wordBox = document.getElementById 'js-speedr-word'
        wordBox.innerHTML = html

    reset: ->
        Speedr.active = false
        Speedr.pause = true
        Speedr.text.sentences = []
        Speedr.text.parsed = []
        Speedr.interval = Speedr.actions.calculateInterval()
        Speedr.i = 0
        Speedr.minimapElements = {}