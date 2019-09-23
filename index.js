const readLine = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}
async function start() {
   const content = {}

   content.searchTerm = askAndReturnSearchTerm()
   content.prefix = askAndReturnPrefix()
   await robots.text(content)
   function askAndReturnPrefix() {
     const prefixes = ['Who is','What is', 'The history of']
     const selectPrefixIndex = readLine.keyInSelect(prefixes, 'Choose one option: ');
     const selectedPrefixText = prefixes[selectPrefixIndex]      
      
     return  selectedPrefixText
   }

   function askAndReturnSearchTerm() {
       return  readLine.question('Type a Wikipedia search term: ')
   }

   console.log(content)
}
start()
