const readline = require('readline');
const log = console.log;
const five = require('johnny-five');
const raspi = require('raspi-io');
const board = new five.Board({
       io: new raspi(),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let sequence = [];

 function randomNumber () {
  return Math.floor((Math.random()*3)+1);
}

let i = 0;
while (i < 10) {
sequence.push(randomNumber());
i++;
}
console.log(sequence)

board.on('ready', function() {

      const LED_RED = new five.Led('P1-7');
      const LED_YELLOW = new five.Led('P1-16');
      const LED_GREEN = new five.Led('P1-18');

      const BTN_RED = new five.Button({pin: 'P1-15', isPullup: true});
      const BTN_YELLOW = new five.Button({pin: 'P1-13',isPullup: true});
      const BTN_GREEN = new five.Button({ pin: 'P1-11', isPullup: true});




      let pressCounter = [];

      BTN_RED.on("press", function() {
        pressCounter.push(1);
        console.log(pressCounter);
        grabPresses();
      });

      BTN_YELLOW.on("press", function() {
        pressCounter.push(3);
        console.log(pressCounter);
        grabPresses();
      });

      BTN_GREEN.on("press", function() {
        pressCounter.push(2);
        console.log(pressCounter);
        grabPresses();
      });


        //grabs 10 btn presses, logs them then returns the data
        var grabPresses = function () {

          if(pressCounter.length >= 10){
            //sequence.concat(pressCounter);
            processArray(pressCounter);
            pressCounter = [];
          }else {
            console.log('Need more presses');
            }

        };




      function delay(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
      }

      async function delayedLog(item) {
        console.log(item);
        await delay(50);
        LED_RED.off();
        await delay(50);
        LED_GREEN.off();
        await delay(50);
        LED_YELLOW.off();
        await delay(50);
      }

      async function processArray(array) {
        for (const item of array) {
          if(item===1){LED_RED.on();}

          if(item===2){LED_GREEN.on();}

          if(item===3){LED_YELLOW.on();}
          await delayedLog(item);

        }
        console.log('Done!');
      }
      //grabPresses()
      processArray(sequence);

});
