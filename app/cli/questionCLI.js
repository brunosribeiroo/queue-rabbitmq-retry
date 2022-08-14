const readline = require('readline');
const { publisher } = require('../publisher/messagePublisher');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let message = {};

function questionCLI(){
  rl.question(`
Enter the option to post in the queue...
1) No Retry Strategy
2) With Retry Strategy
  `, async (name) => {
    switch (name) {
      case '1':
        message = {
            retry: false
        };
        await publisher(message);
        break;
      
      case '2':
        message = {
            retry: true
        };
        await publisher(message);
        break;

      default:
        console.log('Sorry, invalid option.');
        questionCLI();
    }
  });
}

module.exports = {
  questionCLI
}