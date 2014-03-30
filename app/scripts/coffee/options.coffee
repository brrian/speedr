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

App = {}

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
            bindingContainer.removeClass 'binding-text binding-text-empty'
            $('<span class="keyboard-key">' + parseKeyCode(key) + '</span>').appendTo bindingContainer

generateKeyCombo = (event) ->
    # Create key binding
    keyCombo = ''

    if event.ctrlKey then keyCombo += 'ctrl+'
    if event.altKey then keyCombo += 'alt+'
    if event.shiftKey then keyCombo += 'shift+'
    if event.metaKey then keyCombo += 'meta+'

    keyCombo += String.fromCharCode(event.keyCode)

generateKeyElements = (keyBinding) ->
    keys = keyBinding.split('+')
    keysContainer = ''

    for key in keys
        keysContainer += '<span class="keyboard-key">' + parseKeyCode(key) + '</span>'

    keysContainer

parseKeyCode = (key, keyCodes) ->
    keyCodes = keyCodes or KeyCodes

    keyChar = if keyCodes.hasOwnProperty key then keyCodes[key] else key

    keyChar.charAt(0).toUpperCase() + keyChar.slice(1);

keyBindingListener = (event) ->
    unless event.keyCode is 18 or event.keyCode is 17 or event.keyCode is 16 or event.keyCode is 13 or event.keyCode is 8 or event.keyCode is 91 or event.keyCode is 93
        binding = $('.binding-text-waiting')
        bindingGroup = binding.parents '.binding-group'
        keyBinding = generateKeyCombo(event)

        bindingGroup.attr 'data-binding', keyBinding
        binding.removeClass 'binding-text binding-text-empty binding-text-waiting'

        binding.html generateKeyElements keyBinding

        removeKeyBindingListeners()
        validateBindings()    

keyDownNullifier = ->
    false

removeKeyBindingListeners = ->
    $(window).unbind 'keyup', keyBindingListener
    $(window).unbind 'keydown', keyDownNullifier

    App.setBinding = false

showDuplicateBindings = (bindingGroups) ->
    for binding, elements of bindingGroups
        if elements.length > 1
            for element in elements
                $(element).find('.error').text 'Duplicate binding detected!'

validateSettings = ->
    passes = true

    $('input[type=text]').each ->
        value = $(@).val()
        error = $(@).parents('.form-group').find('.error')

        error.empty()

        if value.length > 0 and /^[0-9]+$/.test(value) is false
            error.text('Please enter a numeric value')
            passes = false

    passes

validateBindings = ->
    bindingGroups = {}
    bindings = {}
    passes = true

    # Loop through all the binding-groups and push it's binding into an object
    $('.binding-group').each ->
        binding = $(@).attr('data-binding')

        $(@).find('.error').empty()

        if !bindingGroups.hasOwnProperty binding
            if binding isnt undefined
                bindingGroups[binding] = [@]

                $(@).attr('class').match /js-binding-(\S+)/
                action = RegExp.$1.replace '-', ' '

                bindings[binding] = action
        else
            bindingGroups[binding].push @

            passes = false

            return

    showDuplicateBindings(bindingGroups)

    return if passes is true then bindings else false

parseBindings = ->
    bindings = validateBindings()

    if bindings isnt false then User.bindings = bindings


parseSettings = ->
    if validateSettings() is true
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

$('.js-edit').click ->
    # Let the app know that we are setting a binding
    if App.setBinding is true
        removeKeyBindingListeners()
        $('.binding-text-waiting').parents('.binding-group').find('.js-clear').trigger('click')
    
    App.setBinding = true

    # Empty the binding
    bindingGroup = $(@).parents '.binding-group'
    binding = bindingGroup.find '.binding'

    binding.removeClass('binding-text-empty').addClass('binding-text binding-text-waiting').empty()

    $(window).on 'keyup', keyBindingListener
    $(window).on 'keydown', keyDownNullifier

$('.js-clear').click ->
    bindingGroup = $(@).parents '.binding-group'
    binding = bindingGroup.find '.binding'

    bindingGroup.attr 'data-binding', null
    binding.removeClass('binding-text-waiting').addClass('binding-text binding-text-empty').empty()

    validateBindings()

    $(window).unbind 'keyup', keyBindingListener

$('.js-default').click ->
    bindings = Defaults.bindings
    bindingGroup = $(@).parents '.binding-group'
    binding = bindingGroup.find '.binding'
    
    bindingGroup.attr('class').match /js-binding-(\S+)/
    action = RegExp.$1.replace '-', ' '

    # Loop through all of the bindings until we have a match
    # This isn't the best way, but the object isn't that big so I think performance will be negligble
    for keyBinding, bindingAction of bindings
        if bindingAction is action
            bindingGroup.attr 'data-binding', keyBinding
            binding.removeClass 'binding-text binding-text-empty'

            binding.html generateKeyElements keyBinding

    validateBindings()

$('#js-save-settings').click ->
    # We need to create an object to save to chrome storage
    
    parseSettings()
    parseBindings()

    console.log User

populateDefaults()