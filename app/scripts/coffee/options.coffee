$ = jQuery

# Set some settings
User = {
    settings: {
        wpm: 350
        minimap: true
        fontSize: 33

        delayOnPunctuation: false
        punctuationDelayTime: 1000

        delayOnSentence: false
        sentenceDelayTime: 150

        pauseOnParagraph: false
        delayOnParagraph: false
        paragraphDelayTime: 300

        delayOnLongWords: false
        longWordLength: 8
        longWordDelayTime: 100
    }
    bindings: {
        'alt+v': 'open'
        'q': 'close'
        ' ': 'toggle'
        'û': 'slower'
        'ý': 'faster'
        'r': 'reset'
        '&': 'bigger'
        '(': 'smaller'
        '%': 'prev word'
        'shift+%': 'prev sentence'
        'ctrl+%': 'prev paragraph'
        '\'': 'next word'
        'shift+\'': 'next sentence'
        'ctrl+\'': 'next paragraph'
    }
}

Bindings = {
    ' ': 'space'
    '\t': 'tab'
    'p': 'f1'
    'q': 'f2'
    'r': 'f3'
    's': 'f4'
    't': 'f5'
    'u': 'f6'
    'v': 'f7'
    'w': 'f8'
    'x': 'f9'
    'y': 'f10'
    'z': 'f11'
    '{': 'f12'
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
    '$': 'home'
    '#': 'end'
    '!': 'page up'
    '"': 'page down'
    '.': 'delete'
    '&': 'up'
    '(': 'down'
    '%': 'left'
    '\'': 'right'
    'o': 'num /'
    'j': 'num *'
    'm': 'num -'
    'k': 'num +'
    'n': 'num .'
    '`': 'num 0'
    'a': 'num 1'
    'b': 'num 2'
    'c': 'num 3'
    'd': 'num 4'
    'e': 'num 5'
    'f': 'num 6'
    'g': 'num 7'
    'h': 'num 8'
    'i': 'num 9'
}

appendUserSettings = ->
    # If it's a boolean, we check it or uncheck it
    # If it's a number we change the value
    for setting, value of User.settings
        if typeof value is 'boolean'
            $('#js-' + setting).prop('checked', value)
        else if typeof value is 'number'
            $('#js-' + setting).val(value)

replaceWhiteSpace = (word) ->
    word = word.split(' ')
    word.join('-')

parseKeyBinding = (binding) ->
    # Split the binding into an array and get the last item
    # If there is an entry in the key bindings object, replace it
    # Return the joined binding
    bindingArray = binding.split('+')
    lastKey = bindingArray[bindingArray.length - 1]
    if Bindings.hasOwnProperty(lastKey)
        bindingArray[bindingArray.length - 1] = Bindings[lastKey]

    bindingArray.join('+')

appendKeyBindings = ->
    for binding, action of User.bindings
        action = replaceWhiteSpace(action)
        humanBinding = parseKeyBinding(binding).toLowerCase()

        $('#js-' + action).attr('data-binding', binding).val(humanBinding)

generateKeyCombo = (event) ->
    # Create key binding
    keyCombo = ''

    if event.ctrlKey then keyCombo += 'ctrl+'
    if event.altKey then keyCombo += 'alt+'
    if event.shiftKey then keyCombo += 'shift+'

    keyCombo += String.fromCharCode(event.keyCode)

saveSettings = ->
    newSettings = {}

    $('.settings-section').find('input').each(
        ->
            setting = $(@).attr('id').replace('js-', '')
            type = $(@).attr('type')

            if type is 'text'
                newSettings[setting] = parseInt($(@).val(), 10)
            else if type is 'checkbox'
                newSettings[setting] = $(@).prop('checked')

            return
    )

    newSettings

saveBindings = ->
    newBindings = {}

    $('.bindings-section').find('input').each(
        ->
            setting = $(@).attr('id').replace('js-', '').replace('-', ' ')
            binding = $(@).attr('data-binding')

            newBindings[binding] = setting
            return
    )

    newBindings

chrome.storage.sync.get(
    ['settings', 'bindings']
    (data) ->
        if data.settings then User.settings = data.settings
        if data.bindings then User.bindings = data.bindings
        
        appendUserSettings()
        appendKeyBindings()
)

$('input.binding').keydown(
    (event) ->
        keyCombo = generateKeyCombo(event)
        humanKeyCombo = parseKeyBinding(keyCombo).toLowerCase();

        $(@).attr('data-binding', keyCombo).val(humanKeyCombo)
        false
)

$('#js-save-settings').click(
    ->
        newSettings = {
            settings: saveSettings()
            bindings: saveBindings()
        }

        chrome.storage.sync.set(
            newSettings
            ->
                alert 'Settings successfully saved!'
        )
)