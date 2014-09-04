module.exports =
    init: ->
        speedrWord = document.getElementById 'js-speedr-word'

        speedrWord.addEventListener 'mouseover', =>
            if Speedr.pause then @timeout = setTimeout =>
                    @create()
                , 600

        speedrWord.addEventListener 'mouseout', =>
            clearTimeout @timeout

            if @activeContext then @destroy()

    create: ->
        sentence = Speedr.text.sentences[Speedr.text.parsed[Speedr.i].sentenceArrayMarker]

        context = document.createElement 'span'
        context.className = 'speedr-context speedr-context-fly-up'
        context.textContent = sentence
        context.style.cssText = "max-width: #{User.settings.boxWidth * .9}px; bottom: #{User.settings.boxHeight + 10}px;"

        document.getElementById('js-speedr-box').appendChild context

        @activeContext = context

        Speedr.utility.runOnceAfterAnimation context, ->
            context.className = context.className.replace ' speedr-context-fly-up', ''

    destroy: ->
        @activeContext.className += ' speedr-fade-out-quick'

        Speedr.utility.runOnceAfterAnimation @activeContext, =>
            @activeContext.remove()
            @activeContext = undefined