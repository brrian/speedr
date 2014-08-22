Minimap =
    create: (settings, theme, box) ->
        doc = document

        # Create minimap elements
        minimap = doc.createElement('div')
        minimap.id = 'js-speedr-minimap'
        minimap.className = 'speedr-minimap'
        minimap.style.cssText = "background-color: #{theme.boxColor}; width: #{settings.minimapWidth}px; height: #{settings.boxHeight}px; border-left-color: #{theme.borderColor}; box-shadow: -3px 0 0 #{theme.boxColor};"

        contents = @createContents()

        minimap.appendChild(contents)

        box.appendChild(minimap)

        # Finally, check to see if we need to activate the scroll watcher
        if contents.offsetHeight > minimap.offsetHeight then App.scrollWatcher = true

    createContents: ->
        doc = document
        theme = User.themes[User.settings.primaryTheme]

        contents = doc.createElement 'div'
        contents.className = 'contents'
        contents.style.backgroundImage = "linear-gradient(to right, #{theme.secondaryText} 50%, rgba(255, 255, 255, 0) 20%)"

        paragraphElement = doc.createElement 'p'
        paragraphElement.className = 'speedr-minimap-para'

        # Loop through each word array and create a element
        for word, i in App.text.parsed
            wordElement = doc.createElement 'span'
            wordElement.className = 'speedr-minimap-word'
            wordElement.style.cssText = "width: #{(word.text.length - 1) * 4}px;"

            paragraphElement.appendChild wordElement
            paragraphElement.appendChild doc.createTextNode(' ')

            # If this is the end of the paragraph then create a new p element
            if word.paragraphEnd
                contents.appendChild paragraphElement
                paragraphElement = doc.createElement 'p'
                paragraphElement.className = 'speedr-minimap-para'

            App.minimapElements[i] = wordElement

        # Make the first element active
        App.minimapElements[0].className = 'speedr-minimap-word--read'

        contents

    updateContents: ->
        minimap = document.getElementById 'js-speedr-minimap'

        oldContents = minimap.getElementsByClassName('contents')[0]

        contents = @createContents()

        minimap.replaceChild contents, oldContents

    update: ->
        i = App.i

        for num in [0..App.text.parsed.length - 1]
            App.minimapElements[num].className = if num <= i then 'speedr-minimap-word--read' else 'speedr-minimap-word'

    updateScroll: ->
        # Get the current active word
        i = App.i

        minimap = document.getElementById 'js-speedr-minimap'
        activeOffset = App.minimapElements[i].offsetTop

        if App.scrolling is false or App.scrolling is undefined
            # Compare the offset position and scroll position
            if User.settings.boxHeight - (activeOffset - minimap.scrollTop) < 50
                App.utility.scrollTo(minimap, activeOffset, 1000)

            if App.pause is true and activeOffset < minimap.scrollTop
                App.utility.scrollTo(minimap, activeOffset - User.settings.boxHeight + 60, 1000)

    scrollWatcher: ->
        App.addons.minimap.updateScroll() unless App.scrolling

        App.scrollWatcher = setTimeout(App.addons.minimap.scrollWatcher, App.interval * 5)

module.exports = Minimap