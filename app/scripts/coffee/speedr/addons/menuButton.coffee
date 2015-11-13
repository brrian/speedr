module.exports = ->
	doc = document

	menu = doc.createElement 'div'
	menu.id = 'js-speedr-menu-button'
	menu.className = 'speedr-menu-button speedr-button-fade js-speedr-tooltip'
	menu.setAttribute 'data-tooltip', "Toggle Menu#{Speedr.utility.getBinding('toggle menu')}"
	menu.appendChild doc.createTextNode('menu')
	menu.addEventListener 'click', Speedr.actions.toggleMenu

	menu