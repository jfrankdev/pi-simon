const readline = require('readline');
const log = console.log;
const five = require('johnny-five');
const raspi = require('raspi-io');
const board = new five.Board({io: new raspi()});
const rl = readline.createInterface({input: process.stdin,output: process.stdout,terminal: false});

//initialize raspberry pi board
board.on('ready', function() {

      //the array of random numbers to feed the LEDs
      let sequence = [];

      //init LEDs
      const LED_RED = new five.Led('P1-7');
      const LED_YELLOW = new five.Led('P1-16');
      const LED_GREEN = new five.Led('P1-18');

      //init buttons
      const BTN_RED = new five.Button({pin: 'P1-15', isPullup: true});
      const BTN_YELLOW = new five.Button({pin: 'P1-13',isPullup: true});
      const BTN_GREEN = new five.Button({ pin: 'P1-11', isPullup: true});

      //init the array that counts button presses
      let pressCounter = [];

      //listen for red button presses
      BTN_RED.on("press", function() {
        pressCounter.push(1);
        console.log(pressCounter);
        grabPresses();
      });

      //listen for yellow button presses
      BTN_YELLOW.on("press", function() {
        pressCounter.push(3);
        console.log(pressCounter);
        grabPresses();
      });

      //listen for green button presses
      BTN_GREEN.on("press", function() {
        pressCounter.push(2);
        console.log(pressCounter);
        grabPresses();
      });

      //waits for 10 btn presses then runs the processArray function
      var grabPresses = function () {

        if(pressCounter.length >= 10){
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

      //looks at each element in array and lights up each LED based on number code created on lines 48-67
      async function processArray(array) {
        for (const item of array) {
          if(item===1){LED_RED.on();}

          if(item===2){LED_GREEN.on();}

          if(item===3){LED_YELLOW.on();}
          await delayedLog(item);
        }
        console.log('Done!');
      }
      processArray(sequence);
});
