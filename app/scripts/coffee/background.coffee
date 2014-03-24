chrome.runtime.onMessage.addListener (request, sender, sendReponse) ->
	if request.url then chrome.tabs.create({url: request.url})