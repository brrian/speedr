module.exports = ->
	doc = document

	menu = doc.createElement('div')
	menu.id = 'js-speedr-menu-button'
	menu.className = 'speedr-menu-button speedr-small-text speedr-button-fade js-speedr-tooltip'
	menu.setAttribute 'data-tooltip', "Toggle Menu#{App.utility.getBinding('toggle menu')}"
	menu.appendChild(doc.createTextNode('Menu'))
	menu.addEventListener('click', App.actions.toggleMenu)

	menu