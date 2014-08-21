module.exports = (event) ->
	keyCombo = App.utility.generateKeyCombo(event)

	switch User.bindings[keyCombo]
	    when 'open'
	        if !App.active and window.getSelection().toString().length
	            App.parse.selection()
	            App.speedr.create()
	            App.speedr.showWord()
	            false
	    when 'close'
	        if App.active
	            App.speedr.destroy()
	            false
	    when 'slower'
	        if App.active
	            App.actions.changeWPM -25
	            false
	    when 'faster'
	        if App.active
	            App.actions.changeWPM 25
	            false
	    when 'bigger'
	        if App.active
	            App.actions.changeFontSize 2
	            false
	    when 'smaller'
	        if App.active
	            App.actions.changeFontSize -2
	            false
	    when 'more words'
	        if App.active
	            App.actions.changeWordsDisplayed 1
	            false
	    when 'less words'
	        if App.active
	            App.actions.changeWordsDisplayed -1
	            false
	    when 'toggle'
	        if App.active
	            App.speedr.loop.toggle()
	            false
	    when 'reset'
	        if App.active
	            App.speedr.loop.reset()
	            false
	    when 'prev word'
	        if App.active
	            App.actions.navigateText('prev', 'word')
	            false
	    when 'prev sentence'
	        if App.active
	            App.actions.navigateText('prev', 'sentence')
	            false
	    when 'prev paragraph'
	        if App.active
	            App.actions.navigateText('prev', 'paragraph')
	            false
	    when 'next word'
	        if App.active
	            App.actions.navigateText('next', 'word')
	            false
	    when 'next sentence'
	        if App.active
	            App.actions.navigateText('next', 'sentence')
	            false
	    when 'next paragraph'
	        if App.active
	            App.actions.navigateText('next', 'paragraph')
	    when 'toggle menu'
	        if App.active
	            App.actions.toggleMenu()
	    when 'toggle theme'
	        if App.active
	            App.actions.toggleTheme()