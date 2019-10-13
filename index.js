const readLine = require('readline-sync')

const robots = {
    text: require('./robots/text.js'),
    input: require('./robots/input.js'),
    state: require('./robots/state.js'),
    image: require('./robots/image'),
    video: require('./robots/video')
}
async function start() {
   robots.input()
   await robots.text()
   await robots.image()
   await robots.video();
   const content = robots.state.load();
  // console.log(JSON.stringify(content, null, 4))


    console.dir(content, {depth: null})
}
start()
