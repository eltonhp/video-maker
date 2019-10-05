const readLine = require('readline-sync')

const robots = {
    text: require('./robots/text.js'),
    input: require('./robots/input.js'),
    state: require('./robots/state.js'),
    image: require('./robots/image')
}
async function start() {
    robots.input()
   await robots.text()
   await robots.image()
   const content = robots.state.load();
   // console.log(JSON.stringify(content, null, 4))
    console.dir(content, {depth: null})
}
start()
