// let arguments = process.argv.splice(2);
// console.log(arguments);
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ask user for the anme input
rl.question(`What's your name? `, (name) => {

    // ask for nationality
    rl.question(`What are you from? `, (country) => {

        // log user details
        console.log(`${name} is from ${country}`);

        // close the stream
        rl.close();
    });

});