const readLine = require('readline-sync')
const state = require('./state')

function robot() {
    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    state.save(content)

    function askAndReturnSearchTerm() {
        return  readLine.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is','What is', 'The history of']
        const selectPrefixIndex = readLine.keyInSelect(prefixes, 'Choose one option: ');
        const selectedPrefixText = prefixes[selectPrefixIndex]

        return  selectedPrefixText
    }
}

module.exports = robot
