# Set some settings
window.User = require './common/defaults.coffee'

window.App =
    text:
        sentences: []

    utility: require './speedr/utility.coffee'

    parse: require './speedr/parse.coffee'

    speedr: require './speedr/speedr.coffee'

    addons:
        controls: require './speedr/addons/controls.coffee'

        context: require './speedr/addons/context.coffee'

        countdown: require './speedr/addons/countdown.coffee'

        menuButton: require './speedr/addons/menuButton.coffee'

        minimap: require './speedr/addons/minimap.coffee'

        status: require './speedr/addons/status.coffee'

        tooltips: require './speedr/addons/tooltips.coffee'

        wpm: require './speedr/addons/wpm.coffee'

    actions: require './speedr/actions.coffee'

    chrome: require './speedr/chrome.coffee'

    init: ->
        App.speedr.reset()
        App.chrome.settings.get.then App.chrome.extension.init

window.onkeydown = require './speedr/keyDownListener.coffee'

App.init()