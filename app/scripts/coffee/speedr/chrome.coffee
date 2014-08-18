Chrome =
	settings:
	    get: ->
	        chrome.storage.sync.get(
	            ['settings', 'bindings']
	            (data) ->
	                # If we have some stored settings, replace over the defaults
	                if data.settings
	                    App.chrome.settings.store(data.settings, 'settings')
	                    # User.settings = data.settings
	                    App.actions.calculateInterval()

	                if data.bindings then User.bindings = data.bindings
	        )
	    save: ->
	        chrome.storage.sync.set(User)

	    store: (object, area) ->
	        area = User[area]

	        for setting, value of object
	            area[setting] = value

	wordCount:
	    save: (count) ->
	        chrome.storage.sync.get 'wordCount', (data) ->
	            wordCount = data.wordCount || 0

	            chrome.storage.sync.set({wordCount: wordCount + count})

module.exports = Chrome	            