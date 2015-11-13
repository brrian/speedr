module.exports =
    generateKeyCombo: (event) ->
        # Create key binding
        keyCombo = ''

        if event.ctrlKey then keyCombo += 'ctrl+'
        if event.altKey then keyCombo += 'alt+'
        if event.shiftKey then keyCombo += 'shift+'

        keyCombo += String.fromCharCode(event.keyCode)

    parseKeyCode: (key) ->
        keyCodes = 
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

        keyChar = if keyCodes.hasOwnProperty key then keyCodes[key] else key

        keyChar.charAt(0).toUpperCase() + keyChar.slice(1)