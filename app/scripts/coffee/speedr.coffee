# Set some settings
window.User = require './common/defaults.coffee'

window.Speedr =
    text:
        sentences: []

    utility: require './speedr/utility.coffee'

    parse: require './speedr/parse.coffee'

    box: require './speedr/box.coffee'

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
        Speedr.box.reset()
        Speedr.chrome.settings.get.then Speedr.chrome.extension.init

window.onkeydown = require './speedr/keyDownListener.coffee'

Speedr.init()