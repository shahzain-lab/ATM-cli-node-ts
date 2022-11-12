"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATMMachine = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
class ATMMachine {
    constructor() {
        this.name = '';
        this.default_wallet_address = "0xk99_9nNFJk_4mBJKHRI_ljir39mN_jeOJNOO";
        this.TRANSFER = "transfer";
        this.WITHDRAWAl = "withdrawal";
        this.BALANCE = "balance";
        this.balance = Math.floor((Math.random() * 10000) + 100);
    }
    proceedATM() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ans = yield inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'userid',
                        message: 'Enter account holder\'s name',
                        default: 'John Doe'
                    },
                ]);
                if (isNaN(Number(ans.userid))) {
                    inquirer_1.default.prompt([
                        {
                            type: 'password',
                            mask: '*',
                            name: 'pin',
                            message: 'Enter 4 digit pin',
                        },
                    ]).then(({ pin }) => {
                        if (pin) {
                            this.checkCredentials(ans.userid, pin);
                        }
                    });
                }
                else {
                    console.log('please enter correct name');
                    this.proceedATM();
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    checkCredentials(name, pin) {
        this.name = name;
        if (pin.length > 4 || pin.length < 4) {
            console.log('pin must be four digit. try again...');
            this.proceedATM();
        }
        else {
            this.fundMethods();
        }
    }
    fundMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ans = yield inquirer_1.default.prompt([
                    {
                        type: 'expand',
                        name: 'method',
                        message: 'Select key or enter to choose a method:',
                        choices: [
                            {
                                key: 'b',
                                name: 'check balance',
                                value: this.BALANCE
                            },
                            {
                                key: 'w',
                                name: 'Withdrawal',
                                value: this.WITHDRAWAl,
                            },
                            {
                                key: 't',
                                name: 'Transfer',
                                value: this.TRANSFER,
                            },
                        ],
                    },
                ]);
                switch (ans.method) {
                    case this.BALANCE:
                        console.log(`_____________\nyour current balance is $${this.balance}.\n_____________`);
                        this.newTransaction();
                        break;
                    case this.WITHDRAWAl:
                        this.withdrawal();
                        break;
                    case this.TRANSFER:
                        this.transfer();
                        break;
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    newTransaction() {
        inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'repeatMethodCycle',
                message: 'Do you want to furthur proceed..'
            }
        ]).then(({ repeatMethodCycle }) => {
            if (repeatMethodCycle)
                this.fundMethods();
        });
    }
    transfer() {
        inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'amount',
                message: 'Enter amount that you want to transfer: '
            }
        ]).then(({ amount }) => {
            if (!isNaN(Number(amount))) {
                inquirer_1.default.prompt([
                    {
                        type: 'rawlist',
                        name: 'amount',
                        message: 'We currently support these platforms.',
                        default: 'Binance',
                        choices: [
                            'Easypaisa',
                            'Binance',
                            'UBL Digital',
                            'Naya Pay'
                        ],
                    },
                ]).then(() => {
                    inquirer_1.default.prompt([
                        {
                            type: 'input',
                            name: 'amount',
                            message: 'Enter your wallet address',
                            default: this.default_wallet_address
                        }
                    ]).then(() => {
                        console.log('_____________________\nTransaction is under process. we\'ll share details with you shortly. Thanks\n_____________________');
                        this.newTransaction();
                    });
                });
            }
        });
    }
    withdrawal() {
        inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'amount',
                message: `Your balance is $${this.balance}. Enter withdrawal amount: `
            }
        ]).then((ans) => {
            const amount = Number(ans.amount);
            if (amount < this.balance) {
                inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'receipt',
                        message: `Can I generate receipt for you?`
                    },
                ]).then(({ receipt }) => {
                    if (receipt) {
                        console.log(`_____________\nname:   ${this.name}\ntotal amount:    $${this.balance}\nwithdrawal amount:    $${amount}\ntotal balance   $${this.balance - amount}\n_____________`);
                        this.newTransaction();
                    }
                });
            }
            else {
                console.log('_____________________\nYour entered amount is greater than your current balance\nEnter amount again.');
                this.withdrawal();
            }
        });
    }
}
exports.ATMMachine = ATMMachine;
//# sourceMappingURL=model.js.map