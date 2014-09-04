module.exports = (event) ->
    keyCombo = Speedr.utility.generateKeyCombo event

    action = User.bindings[keyCombo]

    if !Speedr.active and action is 'open' and window.getSelection().type is 'Range'
        Speedr.box.init window.getSelection().toString()
        false
    else if Speedr.active
        switch action     
            when 'close'          then Speedr.box.destroy()
            when 'slower'         then Speedr.actions.changeWPM -25
            when 'faster'         then Speedr.actions.changeWPM 25
            when 'bigger'         then Speedr.actions.changeFontSize 2
            when 'smaller'        then Speedr.actions.changeFontSize -2
            when 'more words'     then Speedr.actions.changeWordsDisplayed 1
            when 'less words'     then Speedr.actions.changeWordsDisplayed -1
            when 'toggle'         then Speedr.box.loop.toggle()
            when 'reset'          then Speedr.box.loop.reset()
            when 'prev word'      then Speedr.actions.navigateText 'prev', 'word'
            when 'prev sentence'  then Speedr.actions.navigateText 'prev', 'sentence'
            when 'prev paragraph' then Speedr.actions.navigateText 'prev', 'paragraph'
            when 'next word'      then Speedr.actions.navigateText 'next', 'word'
            when 'next sentence'  then Speedr.actions.navigateText 'next', 'sentence'
            when 'next paragraph' then Speedr.actions.navigateText 'next', 'paragraph'
            when 'toggle menu'    then Speedr.actions.toggleMenu()
            when 'toggle theme'   then Speedr.actions.toggleTheme()

        false