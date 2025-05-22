// Configuration du fichier .env
require('dotenv').config();

import main from '.';

const promise = main('Message test', 'Tropp');

promise.then((result) => {
	console.log(result.getMessage());
});
