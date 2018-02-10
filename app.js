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
while (i < 200000) {
sequence.push(randomNumber());
i++;
}
console.log(sequence)

board.on('ready', function() {

      const LED_RED = new five.Led('P1-7'); //p1-7 is red, p1-16 is yellow, p1-18 is green
      const LED_YELLOW = new five.Led('P1-16');
      const LED_GREEN = new five.Led('P1-18');

      const BTN_RED = new five.Button({
        pin: 'P1-15', //p1-15 is left, p1-13 is center, p1-11 is right
        isPullup: true
      });

      const BTN_YELLOW = new five.Button({
        pin: 'P1-13',
        isPullup: true
      });

      const BTN_GREEN = new five.Button({
        pin: 'P1-11',
        isPullup: true
      });

      BTN_RED.on("hold", function() {
        console.log( "Button held" );
        LED_RED.stop().off();
        LED_RED.blink(60);
      });

      BTN_RED.on("release", function() {
        console.log( "Button released" );
        LED_RED.stop().off();
      });

      BTN_YELLOW.on("hold", function() {
        console.log( "Button held" );
        LED_YELLOW.stop().off();
        LED_YELLOW.blink(60);
      });

      BTN_YELLOW.on("release", function() {
        console.log( "Button released" );
        LED_YELLOW.stop().off();
      });

      BTN_GREEN.on("hold", function() {
        console.log( "Button held" );
        LED_GREEN.stop().off();
        LED_GREEN.blink(60);
      });

      BTN_GREEN.on("release", function() {
        console.log( "Button released" );
        LED_GREEN.stop().off();
      });


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

      processArray(sequence);

});
