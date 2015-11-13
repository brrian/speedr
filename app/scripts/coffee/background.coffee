chrome.runtime.onInstalled.addListener (details) ->
	if details.reason is 'install' then window.open 'help.html'

chrome.runtime.onMessage.addListener (request, sender, sendReponse) ->
	if request.url then chrome.tabs.create({url: request.url})

chrome.contextMenus.create
	title: "Read selected text"
	contexts: ["selection"]
	onclick: (info, tab) ->
		chrome.tabs.sendMessage tab.id,
			command: 'parse.selection'

chrome.contextMenus.create
	title: "Read selected text and start"
	contexts: ["selection"]
	onclick: (info, tab) ->
		chrome.tabs.sendMessage tab.id,
			command: 'parse.selection.start'