module.exports =
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

    stats:
        save: (time, words) ->
            chrome.storage.sync.get 'stats', (data) ->
                syncTime = data.stats.time || 0
                syncWords = data.stats.words || 0

                chrome.storage.sync.set
                    stats:
                        time: syncTime + time
                        words: syncWords + words

    extension:
        init: ->
            chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
                switch request.command
                    when 'request.selection'
                        sendResponse window.getSelection().toString().slice 0, 75

                    when 'parse.selection'
                        unless App.active then App.speedr.init window.getSelection().toString() else App.speedr.loop.toggle()

                    when 'parse.selection.start'
                        App.speedr.init window.getSelection().toString()
                        setTimeout App.speedr.loop.toggle, 400