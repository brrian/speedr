module.exports = ->
    doc = document

    controls = doc.createElement 'div'
    controls.className = 'speedr-controls'

    controlsLeft = doc.createElement 'div'
    controlsLeft.className = 'speedr-controls-left'

    controlsRight = doc.createElement 'div'
    controlsRight.className = 'speedr-controls-right'

    buttons = ['speed', 'words', 'font', 'word', 'sentence', 'paragraph']

    for button, i in buttons
        controlButton = doc.createElement 'div'

        controlButton.className = 'speedr-button'
        controlButton.textContent = button

        actions = doc.createElement 'div'
        actions.className = 'speedr-button-actions'

        action1 = doc.createElement 'span'
        action1.className = 'speedr-button-action js-speedr-tooltip'
        action2 = doc.createElement 'span'
        action2.className = 'speedr-button-action js-speedr-tooltip'

        switch button
            when 'speed'
                action1.textContent = 'faster'
                action1.setAttribute 'data-tooltip', "Increase speed#{Speedr.utility.getBinding('faster')}"
                action1.addEventListener 'click', -> Speedr.actions.changeWPM 25

                action2.textContent = 'slower'
                action2.setAttribute 'data-tooltip', "Decrease speed#{Speedr.utility.getBinding('slower')}"
                action2.addEventListener 'click', -> Speedr.actions.changeWPM -25
            when 'words'
                action1.textContent = 'more'
                action1.setAttribute 'data-tooltip', "Show more words#{Speedr.utility.getBinding('more words')}"
                action1.addEventListener 'click', -> Speedr.actions.changeWordsDisplayed 1

                action2.textContent = 'less'
                action2.setAttribute 'data-tooltip', "Show less words#{Speedr.utility.getBinding('less words')}"
                action2.addEventListener 'click', -> Speedr.actions.changeWordsDisplayed -1
            when 'font'
                action1.textContent = 'bigger'
                action1.setAttribute 'data-tooltip', "Increase font size#{Speedr.utility.getBinding('bigger')}"
                action1.addEventListener 'click', -> Speedr.actions.changeFontSize 2 

                action2.textContent = 'smaller'
                action2.setAttribute 'data-tooltip', "Decrease font size#{Speedr.utility.getBinding('smaller')}"
                action2.addEventListener 'click', -> Speedr.actions.changeFontSize -2
            when 'word'
                action1.textContent = 'previous'
                action1.setAttribute 'data-tooltip', "Previous word#{Speedr.utility.getBinding('prev word')}"
                action1.addEventListener 'click', -> Speedr.actions.navigateText 'prev', 'word'

                action2.textContent = 'next'
                action2.setAttribute 'data-tooltip', "Next word#{Speedr.utility.getBinding('next word')}"
                action2.addEventListener 'click', -> Speedr.actions.navigateText 'next', 'word'
            when 'sentence'
                action1.textContent = 'previous'
                action1.setAttribute 'data-tooltip', "Previous sentence#{Speedr.utility.getBinding('prev sentence')}"
                action1.addEventListener 'click', -> Speedr.actions.navigateText 'prev', 'sentence'

                action2.textContent = 'next'
                action2.setAttribute 'data-tooltip', "Next sentence#{Speedr.utility.getBinding('next sentence')}"
                action2.addEventListener 'click', -> Speedr.actions.navigateText 'next', 'sentence'
            when 'paragraph'
                action1.textContent = 'previous'
                action1.setAttribute 'data-tooltip', "Previous paragraph#{Speedr.utility.getBinding('prev paragraph')}"
                action1.addEventListener 'click', -> Speedr.actions.navigateText 'prev', 'paragraph'

                action2.textContent = 'next'
                action2.setAttribute 'data-tooltip', "Next paragraph#{Speedr.utility.getBinding('next paragraph')}"
                action2.addEventListener 'click', -> Speedr.actions.navigateText 'next', 'paragraph'

                actions.className += ' speedr-button-actions--right'

        actions.appendChild action1
        actions.appendChild action2
        controlButton.appendChild actions

        if i < 3 then controlsLeft.appendChild controlButton
        else controlsRight.appendChild controlButton

    playPause = doc.createElement 'div'
    playPause.id = 'js-play-pause'
    playPause.className = 'speedr-button speedr-button--centered js-speedr-tooltip'
    playPause.textContent = 'start'
    playPause.setAttribute 'data-tooltip', "Start#{Speedr.utility.getBinding('toggle')}"
    playPause.addEventListener 'click', Speedr.loop.toggle 

    controls.appendChild playPause
    controls.appendChild controlsLeft
    controls.appendChild controlsRight

    controls