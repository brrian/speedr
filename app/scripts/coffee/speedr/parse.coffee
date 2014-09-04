module.exports =
    text: (text) ->
        Speedr.text.original = text

        @loop()

    loop: ->
        counter = 0
        sentenceCounter = 0

        # Split the selection into paragraphs
        paragraphs = @splitIntoParagraphs Speedr.text.original

        for paragraph in paragraphs
            sentences = @splitIntoSetences paragraph
            paragraphStart = counter

            # Add the sentence into the Speedr.text.sentences array
            Speedr.text.sentences.push.apply Speedr.text.sentences, sentences

            for sentence in sentences
                words = @splitIntoWords sentence
                sentenceStart = counter

                for word in words
                    wordObj =
                        text: word
                        hasPunctuation: if /[\.,!\?]/.test(word) then true else false
                        paragraphStart: paragraphStart
                        sentenceStart: sentenceStart
                        sentenceArrayMarker: sentenceCounter

                    Speedr.text.parsed.push wordObj

                    counter++

                sentenceCounter++

            Speedr.text.parsed[counter - 1].paragraphEnd = true

    # Return an array of paragraphs
    splitIntoParagraphs: (text) ->
        text.split(/[\r\n]/g).filter( (paragraph) ->
            paragraph.length > 0
        )

    # Return an array of sentences
    splitIntoSetences: (paragraph) ->
        # sentences = paragraph.match(/["'“]?([A-Z]((?!([A-Za-z]{2,}|\d+)[.?!]+["']?\s+["']?[A-Z]).)*)(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[A-Z]).)*)?)*((?![.?!]["']?\s+["']?[A-Z]).)*[.?!]+["'”]?/g) || [paragraph]
        sentences = paragraph.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) || [paragraph]
        sentences.map (sentence) ->
            sentence.trim()

    # Return an array of words
    splitIntoWords: (sentence) ->
        regex = new RegExp "((?:(?:\\S+\\s){#{User.settings.wordsDisplayed}})|(?:.+)(?=\\n|$))", "g"

        sentence.match regex
        # sentence.split(' ')