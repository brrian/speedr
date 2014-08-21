module.exports = ->
    doc = document

    controls = doc.createElement 'div'
    controls.className = 'speedr-controls'

    controlsLeft = doc.createElement 'div'
    controlsLeft.className = 'speedr-controls-left'

    controlsRight = doc.createElement 'div'
    controlsRight.className = 'speedr-controls-right'

    buttons = ['speed', 'words', 'word', 'sentence', 'paragraph']

    for button, i in buttons
        controlButton = doc.createElement 'div'

        controlButton.className = 'speedr-button'
        controlButton.innerText = button

        actions = doc.createElement 'div'
        actions.className = 'speedr-button-actions'

        action1 = doc.createElement 'span'
        action1.className = 'speedr-button-action js-speedr-tooltip'
        action2 = doc.createElement 'span'
        action2.className = 'speedr-button-action js-speedr-tooltip'

        switch button
            when 'speed'
                action1.innerText = 'faster'
                action1.setAttribute 'data-tooltip', "Increase speed#{App.utility.getBinding('faster')}"
                action1.addEventListener 'click', -> App.actions.changeWPM 25

                action2.innerText = 'slower'
                action2.setAttribute 'data-tooltip', "Decrease speed#{App.utility.getBinding('slower')}"
                action2.addEventListener 'click', -> App.actions.changeWPM -25
            when 'words'
                action1.innerText = 'more'
                action1.setAttribute 'data-tooltip', "Show more words#{App.utility.getBinding('more words')}"
                action1.addEventListener 'click', -> App.actions.changeWordsDisplayed 1

                action2.innerText = 'less'
                action2.setAttribute 'data-tooltip', "Show less words#{App.utility.getBinding('less words')}"
                action2.addEventListener 'click', -> App.actions.changeWordsDisplayed -1
            when 'word'
                action1.innerText = 'previous'
                action1.setAttribute 'data-tooltip', "Previous word#{App.utility.getBinding('prev word')}"
                action1.addEventListener 'click', -> App.actions.navigateText 'prev', 'word'

                action2.innerText = 'next'
                action2.setAttribute 'data-tooltip', "Next word#{App.utility.getBinding('next word')}"
                action2.addEventListener 'click', -> App.actions.navigateText 'next', 'word'
            when 'sentence'
                action1.innerText = 'previous'
                action1.setAttribute 'data-tooltip', "Previous sentence#{App.utility.getBinding('prev sentence')}"
                action1.addEventListener 'click', -> App.actions.navigateText 'prev', 'sentence'

                action2.innerText = 'next'
                action2.setAttribute 'data-tooltip', "Next sentence#{App.utility.getBinding('next sentence')}"
                action2.addEventListener 'click', -> App.actions.navigateText 'next', 'sentence'
            when 'paragraph'
                action1.innerText = 'previous'
                action1.setAttribute 'data-tooltip', "Previous paragraph#{App.utility.getBinding('prev paragraph')}"
                action1.addEventListener 'click', -> App.actions.navigateText 'prev', 'paragraph'

                action2.innerText = 'next'
                action2.setAttribute 'data-tooltip', "Next paragraph#{App.utility.getBinding('next paragraph')}"
                action2.addEventListener 'click', -> App.actions.navigateText 'next', 'paragraph'

                actions.className += ' speedr-button-actions--right'

        actions.appendChild action1
        actions.appendChild action2
        controlButton.appendChild actions

        if i < 2 then controlsLeft.appendChild controlButton
        else controlsRight.appendChild controlButton

    playPause = doc.createElement 'div'
    playPause.id = 'js-play-pause'
    playPause.className = 'speedr-button speedr-button--centered js-speedr-tooltip'
    playPause.innerText = 'start'
    playPause.setAttribute 'data-tooltip', "Start#{App.utility.getBinding('toggle')}"
    playPause.addEventListener 'click', App.speedr.loop.toggle 

    controls.appendChild playPause
    controls.appendChild controlsLeft
    controls.appendChild controlsRight

    controls