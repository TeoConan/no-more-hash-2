// Configuration du fichier .env
require('dotenv').config();

import main from '.';

process.env['TESTING'] = '0';

const promise = main('Message test', 'Tropp');

promise.then((result) => {
    console.log(result.getMessage());
});
