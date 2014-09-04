module.exports =
    settings:
        get: new Promise (resolve, reject) ->
            chrome.storage.sync.get ['settings', 'bindings'], (data) ->
                # If we have some stored settings, replace over the defaults
                if data.settings
                    Speedr.chrome.settings.store(data.settings, 'settings')
                    # User.settings = data.settings
                    Speedr.actions.calculateInterval()

                if data.bindings then User.bindings = data.bindings

                resolve()

        save: ->
            chrome.storage.sync.set User

        store: (object, area) ->
            area = User[area]

            for setting, value of object
                area[setting] = value

    stats:
        save: (time, words) ->
            chrome.storage.sync.get 'stats', (data) ->
                stats = data.stats || {}

                date = new Date()
                month = "#{date.getFullYear()}-#{date.getMonth() + 1}"

                unless stats.hasOwnProperty month
                    stats[month] =
                        time: time
                        words: words
                else
                    stats[month].time += time
                    stats[month].words += words

                chrome.storage.sync.set
                    stats: stats

    extension:
        init: ->
            chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
                switch request.command
                    when 'request.selection'
                        sendResponse window.getSelection().toString().slice 0, 75

                    when 'parse.selection'
                        unless Speedr.active then Speedr.box.init window.getSelection().toString() else Speedr.loop.toggle()

                    when 'parse.selection.start'
                        Speedr.box.init window.getSelection().toString()
                        setTimeout Speedr.loop.toggle, 400