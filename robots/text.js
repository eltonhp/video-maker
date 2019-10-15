const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia').apiKey
const lang = require('../credentials/algorithmia').lang
const sentenceBoundaryDetection = require('sbd');
const watsonApiKey = require('../credentials/watson-nlu').apikey

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
   iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

// const nlu = new NaturalLanguageUnderstandingV1(watsonApiKey)

// nlu.analyze({
//     text: 'Hi Im Michale Jackson and I like doing music',
//     features: {
//         keywords: {}
//     }
// },(error, response) => {
//     if (error) {
//         throw error
//     }
//
//     console.log(JSON.stringify(response, null, 4))
//     process.exit(0)
// })


const state = require('./state.js')



async function robot() {
 console.log('> [text-robot] Starting...')
 const content = state.load()

 await fetchContentFromWikipedia(content)
 sanitizeContent(content)
 breakContentIntoSentences(content)
 limitMaximumSentences(content)
 await fetchKeywordsOfAllSentences(content)
 state.save(content)

 async function fetchContentFromWikipedia(content) {
         console.log('> [text-robot] Fetching content from Wikipedia')
         const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
         const wikipediaAgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")

         const term = {
               "articleName": content.searchTerm,
              // "lang": lang
         }

         const wikipediaResponse = await wikipediaAgorithm.pipe(term)
         const wikipediaContent = wikipediaResponse.get();
         // const nova = await  fetchWatsonAndReturnKeywords(wikipediaContent)

         content.sourceContentOriginal = wikipediaContent.content;

         // console.log(wikipediaContent)
         console.log('> [text-robot] Fetching done!')

   }

 function sanitizeContent(content) {
 function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split('\n');

      const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
          if (line.trim().length === 0 || line.trim().startsWith('=')) {
              return false
          }
          return true;
      });

      return withoutBlankLinesAndMarkDown.join(' ');
  }
 function removeDatesInParentheses(text) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/   /g, '');
  }

   const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
   const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkDown);
   content.sourceContentSanitized = withoutDatesInParentheses
 }

 function breakContentIntoSentences(content) {
   content.sentences = []
   const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
   sentences.forEach(sentence => {
       content.sentences.push({
           text: sentence,
           keywords: [],
           images: []
       });
   })
 }

 function  limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences)
 }

 async function fetchKeywordsOfAllSentences(content) {
     console.log('> [text-robot] Starting to fetch keywords from Watson')

     for( const sentence of content.sentences) {
          console.log(`> [text-robot] Sentence: "${sentence.text}"`)
          sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
          console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`)
     }
 }

 async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
        nlu.analyze({
            text: sentence,
            features: {
                keywords: {}
            }
        }, (error, response) => {
            if(error) {
               reject(error)
                return
            }
            const keywords = response.keywords.map((keyword => {
                return keyword.text
            }))

            resolve(keywords);
        })
    })
 }
}

module.exports = robot
