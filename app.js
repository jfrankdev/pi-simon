const readline = require('readline');
const log = console.log;
const five = require('johnny-five');
const raspi = require('raspi-io');
const board = new five.Board({io: new raspi()});
const rl = readline.createInterface({input: process.stdin,output: process.stdout,terminal: false});

//initialize raspberry pi board
board.on('ready', function() {

      //the array of random numbers created by computer to feed the LEDs
      let CPU_SEQUENCE = [];

      //the array of numbers created by the user to compare to the CPU_SEQUENCE array
      let USER_SEQUENCE = [];

      //populates CPU_SEQUENCE array then processes it
    async function createCPU_SEQUENCE (trueorfalse) {

      //called to delay the switching off of an LED
      function delay(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
      }

      if (trueorfalse === 0) {
      await delay(5000);
      console.log('start');
      trueorfalse++;
      }

      //generate random number between 1 and 3
       function randomNumber () {
        return Math.floor((Math.random()*3)+1);
      }

      //counter variable
      let i = 0;

      //add 3 random numbers to the sequence array
      while (i < 1) {
        CPU_SEQUENCE.push(randomNumber());
        i++;
        }
        console.log(CPU_SEQUENCE);
        processArray(CPU_SEQUENCE);
      }

      //init buzzer
      const BUZZER = new five.Piezo('P1-22');

      //init LEDs
      const LED_RED = new five.Led('P1-7');
      const LED_YELLOW = new five.Led('P1-16');
      const LED_GREEN = new five.Led('P1-18');

      //init buttons
      const BTN_RED = new five.Button({pin: 'P1-15', isPullup: true});
      const BTN_YELLOW = new five.Button({pin: 'P1-13',isPullup: true});
      const BTN_GREEN = new five.Button({ pin: 'P1-11', isPullup: true});

      //listen for red button presses
      BTN_RED.on("press", function() {
        LED_RED.on();
        USER_SEQUENCE.push(1);
        grabPresses();
      });

      BTN_RED.on("release", function() {
        LED_RED.off();
      });

      //listen for yellow button presses
      BTN_YELLOW.on("press", function() {
        LED_YELLOW.on();
        USER_SEQUENCE.push(2);
        grabPresses();
      });

      BTN_YELLOW.on("release", function() {
        LED_YELLOW.off();
      });

      //listen for green button presses
      BTN_GREEN.on("press", function() {
        LED_GREEN.on();
        USER_SEQUENCE.push(3);
        grabPresses();
      });

      BTN_GREEN.on("release", function() {
        LED_GREEN.off();
      });

      //waits for 3 btn presses then runs the compareSequences() function
      var grabPresses = function () {
        if(USER_SEQUENCE.length === CPU_SEQUENCE.length){
          compareSequences();
        }
      };


      //called to delay the switching off of an LED
      function delay(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
      }

      //logs the LED number codes, waits for a time and then turns off any LEDs
      async function delayedLog(item) {
        await delay(350);
        LED_RED.off();
        await delay(350);
        LED_GREEN.off();
        await delay(350);
        LED_YELLOW.off();
        await delay(350);
      }

      //looks at each element in array and lights up each LED based on number code created on lines 48-67
      async function processArray(array) {
        for (const item of array) {
          if(item===1){LED_RED.on();}

          if(item===2){LED_YELLOW.on();}

          if(item===3){LED_GREEN.on();}
          await delayedLog(item);
        }
      }

      //compares the user sequence and cpu sequence arrays
      async function compareSequences () {
        var counter = 0;

        while (counter < CPU_SEQUENCE.length){
        	  if(CPU_SEQUENCE[counter] === USER_SEQUENCE[counter]){
            console.log('correct selection')
            counter++;
            } else {
            console.log('wrong selection')
            counter++;
            }
        }
        //CPU_SEQUENCE = [];
        USER_SEQUENCE = [];
        await delay(2000); //time inbetween rounds
        createCPU_SEQUENCE();
    }

    // Plays a song
    function playSong () {

         BUZZER.play({
          // song is composed by an array of pairs of notes and beats
          // The first argument is the note (null means "no note")
          // The second argument is the length of time (beat) of the note (or non-note)
          song: [
            ["C4", 1 / 4],
            ["D4", 1 / 4],
            ["F4", 1 / 4],
            ["D4", 1 / 4],
            ["A4", 1 / 4],
            [null, 1 / 4],
            ["A4", 1],
            ["G4", 1],
            [null, 1 / 2],
            ["C4", 1 / 4],
            ["D4", 1 / 4],
            ["F4", 1 / 4],
            ["D4", 1 / 4],
            ["G4", 1 / 4],
            [null, 1 / 4],
            ["G4", 1],
            ["F4", 1],
            [null, 1 / 2]
          ],
          tempo: 100

        });

      }

      playSong();
      createCPU_SEQUENCE(0);


});
