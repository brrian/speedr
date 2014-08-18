Tooltips =
    init: ->
        tooltips = document.getElementsByClassName 'js-speedr-tooltip'

        for tooltip in tooltips
            tooltip.addEventListener 'mouseover', =>
                target = event.target

                @timeout = setTimeout =>
                    @create target
                , 500

            tooltip.addEventListener 'mouseout', =>
                clearTimeout @timeout

                if @activeTooltip then @destroy()

            tooltip.addEventListener 'click', =>
                if @activeTooltip then @destroy()

    create: (element) ->
        position = element.getBoundingClientRect()

        tooltip = document.createElement 'span'
        tooltip.className = 'speedr-tooltip'
        tooltip.innerText = element.getAttribute 'data-tooltip'
        tooltip.style.cssText = "top: #{position.top}px; left: #{position.left + (position.width / 2)}px;"

        @activeTooltip = tooltip

        document.body.appendChild tooltip

    destroy: (tooltip = @activeTooltip) ->
        tooltip.className += ' fade-out-quick'

        App.utility.runOnceAfterAnimation tooltip, ->
            tooltip.remove()

        @activeTooltip = undefined

module.exports = Tooltips