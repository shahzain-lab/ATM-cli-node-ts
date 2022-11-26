// Moving toward ATM APP !!!!
import { ATMMachine } from './model.js';

import figlet from "figlet";
import gradient from "gradient-string";



figlet.text('ts-atm-machine', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
}, ((err, data) => {
    console.log('\n');
    console.log(gradient.rainbow(data));
    console.log('\n');
    const atm = new ATMMachine;
    atm.proceedATM();
}));


