module.exports =
    init: ->
        speedrWord = document.getElementById 'js-speedr-word'

        speedrWord.addEventListener 'mouseover', =>
            if App.pause then @timeout = setTimeout =>
                    @create()
                , 600

        speedrWord.addEventListener 'mouseout', =>
            clearTimeout @timeout

            if @activeContext then @destroy()

    create: ->
        sentence = App.text.sentences[App.text.parsed[App.i].sentenceArrayMarker]

        context = document.createElement 'span'
        context.className = 'speedr-context speedr-context-fly-up'
        context.innerText = sentence
        context.style.cssText = "max-width: #{User.settings.boxWidth * .9}px; bottom: #{User.settings.boxHeight + 10}px;"

        document.getElementById('js-speedr-box').appendChild context

        @activeContext = context

        App.utility.runOnceAfterAnimation context, ->
            context.className = context.className.replace ' speedr-context-fly-up', ''

    destroy: ->
        @activeContext.className += ' speedr-fade-out-quick'

        App.utility.runOnceAfterAnimation @activeContext, =>
            @activeContext.remove()
            @activeContext = undefined