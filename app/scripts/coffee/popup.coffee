'use strict'

getCurrentTab = new Promise (resolve, reject) ->
	chrome.tabs.query
		active: true
		currentWindow: true
		, (tabs) ->
			resolve tabs[0]

sendMessage = (command, callback) ->
	getCurrentTab.then (tab) ->
		chrome.tabs.sendMessage tab.id,
			command: command
			, callback

sendMessage "request.selection", (selection) ->
	if selection
		window.selection = selection
		document.getElementById("js-read-selection").className = ""
		document.getElementById("js-read-selection-subtext").textContent = selection

document.getElementById("js-read-selection").onclick = ->
	if selection.length
		sendMessage "parse.selection"
		window.close()
	