// Configuration du fichier .env
require('dotenv').config();

import main from '.';

let message = process.argv.length > 2 ? process.argv[2] : 'Message de test';
let userName = process.argv.length > 3 ? process.argv[3] : 'Tropp';
process.env['TESTING'] = process.argv.length > 4 ? process.argv[4] : '0';

console.log('');
console.log(`${userName}: ${message}`);
const promise = main(message, userName);

promise.then(async (result) => {
	console.log('');
	console.log('NoMoreHash2: ' + (await result.getMessage()));
	console.log('');
});
