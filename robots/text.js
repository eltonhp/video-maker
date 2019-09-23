const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia').apiKey
const lang = require('../credentials/algorithmia').lang
const sentenceBoundaryDetection = require('sbd');
const watsonApiKey = require('../credentials/watson-nlu')

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1(watsonApiKey)



async  function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
        nlu.analyze({
            text: sentence,
            features: {
                keywords: {}
            }
        }, (error, response) => {
            if(error) {
                throw error
            }
             const keywords = response.keywords.map((keyword => {
                 return keyword.text
             }))

             resolve(keywords);
        })
    })
}

async function robot(content) {


  await fetchContentFromWikipedia(content)
   // fetchWatsonAndReturnKeywords(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

   async function fetchContentFromWikipedia(content) {
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

         console.log(wikipediaContent)

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
               sentence: sentence,
               keywords: [],
               images: []
           });
       })
    }
}

module.exports = robot
