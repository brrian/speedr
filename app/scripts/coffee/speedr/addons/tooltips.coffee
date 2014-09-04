module.exports =
    init: ->
        tooltips = document.getElementsByClassName 'js-speedr-tooltip'

        for tooltip in tooltips
            tooltip.addEventListener 'mouseover', (event) =>
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
        theme = User.themes[User.settings.primaryTheme]
        position = element.getBoundingClientRect()

        tooltip = document.createElement 'span'
        tooltip.className = 'speedr-tooltip speedr-tooltip-fly-up'
        tooltip.textContent = element.getAttribute 'data-tooltip'
        tooltip.style.cssText = "top: #{position.top}px; left: #{position.left + (position.width / 2)}px; background-color: #{theme.highlightColor};"

        arrow = document.createElement 'span'
        arrow.className = 'speedr-tooltip-arrow'
        arrow.style.borderTopColor = theme.highlightColor

        tooltip.appendChild arrow

        @activeTooltip = tooltip

        document.body.appendChild tooltip

        Speedr.utility.runOnceAfterAnimation tooltip, ->
            tooltip.className = tooltip.className.replace ' speedr-tooltip-fly-up', ''

    destroy: (tooltip = @activeTooltip) ->
        tooltip.className += ' speedr-fade-out-quick'

        Speedr.utility.runOnceAfterAnimation tooltip, ->
            tooltip.remove()

        @activeTooltip = undefined