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

board.on('ready', function() {

      const led = new five.Led('P1-7');

      this.repl.inject({
              on: () => {
                      led.on();
              },
              off: () => {
                      led.stop().off();
              },
              strobe: () => {
                      led.stop().off();
                      led.strobe();
              },
              blink: () => {
                      led.stop().off();
                      led.blink(6000);
              },
      });


      const recursiveAsyncReadLine = function () {
        rl.question('Command: ', function (answer) {
          switch(answer) {
            case 'on':
                log('Got it! Your answer was: "', answer, '"');
                led.on();
                break;
            case 'off':
                log('Got it! Your answer was: "', answer, '"');
                led.stop().off();
                break;
            case 'blink':
                log('Got it! Your answer was: "', answer, '"');
                led.stop().strobe();
                break;
            default:
        }
        recursiveAsyncReadLine();
        });
      };

recursiveAsyncReadLine();

});
