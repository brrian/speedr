module.exports = (event) ->
    action = User.bindings[Speedr.utility.generateKeyCombo event]

    if !Speedr.active and action is 'open' and window.getSelection().type is 'Range'
        Speedr.box.init window.getSelection().toString()
        false
    else if Speedr.active
        switch action     
            when 'close'
                Speedr.box.destroy()
                false
            when 'slower'
                Speedr.actions.changeWPM -25
                false
            when 'faster'
                Speedr.actions.changeWPM 25
                false
            when 'bigger'
                Speedr.actions.changeFontSize 2
                false
            when 'smaller'
                Speedr.actions.changeFontSize -2
                false
            when 'more words'
                Speedr.actions.changeWordsDisplayed 1
                false
            when 'less words'
                Speedr.actions.changeWordsDisplayed -1
                false
            when 'toggle'
                Speedr.loop.toggle()
                false
            when 'reset'
                Speedr.loop.reset()
                false
            when 'prev word'
                Speedr.actions.navigateText 'prev', 'word'
                false
            when 'prev sentence'
                Speedr.actions.navigateText 'prev', 'sentence'
                false
            when 'prev paragraph'
                Speedr.actions.navigateText 'prev', 'paragraph'
                false
            when 'next word'
                Speedr.actions.navigateText 'next', 'word'
                false
            when 'next sentence'
                Speedr.actions.navigateText 'next', 'sentence'
                false
            when 'next paragraph'
                Speedr.actions.navigateText 'next', 'paragraph'
                false
            when 'toggle menu'
                Speedr.actions.toggleMenu()
                false
            when 'toggle theme'
                Speedr.actions.toggleTheme()
                false