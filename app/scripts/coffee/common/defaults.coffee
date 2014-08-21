module.exports =
    settings:
        fontFamily: 'Open Sans Light'

        primaryTheme: 'Speedr (Light)'
        secondaryTheme: 'Solarized (Dark)'

        boxWidth: 600
        boxHeight: 300
        minimapWidth: 175

        countdownSpeed: 1000

        showControls: true
        showCountdown: true
        showMenuButton: true
        showMinimap: true
        showStatus: true
        showWPM: true
        showTooltips: true
        showContext: true

        wpm: 350
        wordsDisplayed: 1
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

    themes: 
        'Speedr (Light)':
            primaryText: '#444'
            secondaryText: '#666'
            boxColor: '#f2f0e7'
            borderColor: 'rgba(175, 150, 190, .2)'
            highlightColor: '#dc322f'

        'Solarized (Light)': 
            primaryText: '#444'
            secondaryText: '#657b83'
            boxColor: '#fdf6e3'
            borderColor: 'rgba(175, 150, 190, .2)'
            highlightColor: '#dc322f'

        'Solarized (Dark)': 
            primaryText: '#93a1a1'
            secondaryText: '#657b83'
            boxColor: '#073642'
            borderColor: 'rgba(175, 150, 190, .2)'
            highlightColor: '#cb4b16'

    bindings:
        ' ': 'toggle'
        '%': 'prev word'
        '\'': 'next word'
        '&': 'bigger'
        '(': 'smaller'
        'shift+&': 'more words'
        'shift+(': 'less words'
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
        'I': 'toggle theme'