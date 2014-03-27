'use strict'

$ = jQuery

User = {}

Defaults =
    settings: 
        fontFamily: 'EB Garamond'

        primaryTheme: 'Solarized (Light)'

        boxWidth: 500
        boxHeight: 245
        minimapWidth: 175

        countdownSpeed: 1000

        showControls: true
        showCountdown: true
        showMenuButton: true
        showMinimap: true
        showStatus: true
        showWPM: true

        wpm: 350
        minimap: true
        fontSize: 33

        delayOnPunctuation: false
        punctuationDelayTime: 1000

        delayOnSentence: false
        sentenceDelayTime: 150

        pauseOnParagraph: true
        delayOnParagraph: false
        paragraphDelayTime: 300

        delayOnLongWords: false
        longWordLength: 8
        longWordDelayTime: 100

    bindings:
        ' ': 'toggle'
        '%': 'prev word'
        '&': 'bigger'
        '\'': 'next word'
        '(': 'smaller'
        'Q': 'close'
        'R': 'reset'
        'alt+V': 'open'
        'ctrl+%': 'prev paragraph'
        'ctrl+\'': 'next paragraph'
        'shift+%': 'prev sentence'
        'shift+\'': 'next sentence'
        'Û': 'slower'
        'Ý': 'faster'
        'M': 'toggle menu'

KeyCodes = 
    ' ': 'Spacebar'
    '\t': 'Tab'
    'p': 'F1'
    'q': 'F2'
    'r': 'F3'
    's': 'F4'
    't': 'F5'
    'u': 'F6'
    'v': 'F7'
    'w': 'F8'
    'x': 'F9'
    'y': 'F10'
    'z': 'F11'
    '{': 'F12'
    '\u00C0': '`',
    '\u00BD': '-',
    '\u00BB': '=',
    '\u00DB': '[',
    '\u00DD': ']',
    '\u00DC': '\\',
    '\u00BA': ';',
    '\u00DE': '\'',
    '\u00BC': ',',
    '\u00BE': '.',
    '\u00BF': '/',
    '$': 'Home'
    '#': 'End'
    '!': 'PgUp'
    '"': 'PgDn'
    '.': 'Del'
    '&': '\u2191'
    '(': '\u2193'
    '%': '\u2190'
    '\'': '\u2192'
    'o': 'Num /'
    'j': 'Num *'
    'm': 'Num -'
    'k': 'Num +'
    'n': 'Num .'
    '`': 'Num 0'
    'a': 'Num 1'
    'b': 'Num 2'
    'c': 'Num 3'
    'd': 'Num 4'
    'e': 'Num 5'
    'f': 'Num 6'
    'g': 'Num 7'
    'h': 'Num 8'
    'i': 'Num 9'

populateDefaults = ->
    for setting, value of Defaults.settings
        type = typeof value

        switch type
            when 'number'
                $('input[name=' + setting + ']').val value
            when 'boolean'
                $('input[name=' + setting + ']').prop 'checked', value
            when 'string'
                $('input[name=' + setting + '][value="' + value + '"]').prop 'checked', true

    for binding, action of Defaults.bindings
        element = $('.js-binding-' + action.replace ' ', '-')
        bindingContainer = element.find '.binding'
        keys = binding.split '+'

        element.attr 'data-binding', binding

        for key in keys
            $('<span class="keyboard-key">' + parseKeyCode(key) + '</span>').appendTo bindingContainer

parseKeyCode = (key, keyCodes) ->
    keyCodes = keyCodes or KeyCodes

    keyChar = if keyCodes.hasOwnProperty key then keyCodes[key] else key

    keyChar.charAt(0).toUpperCase() + keyChar.slice(1);

parseSettings = ->
    # Go through all the inputs
    settings = {}

    $('.settings-section').find('input').each ->
        type = $(@).attr('type')
        setting = $(@).attr('name')

        switch type
            when 'text'
                if $(@).val() then value = parseInt $(@).val(), 10
            when 'radio'
                if $(@).prop 'checked' then value = $(@).val()
            when 'checkbox'
                value = $(@).prop 'checked'

        if value isnt undefined then settings[setting] = value

        return
    
    User.settings = settings


$('#js-save-settings').click ->
    # We need to create an object to save to chrome storage
    
    parseSettings()

    console.log User.settings

populateDefaults()