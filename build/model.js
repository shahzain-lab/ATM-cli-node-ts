var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from 'chalk';
import inquirer from 'inquirer';
export class ATMMachine {
    constructor() {
        // credentials
        this.name = '';
        // default_wallet_address
        this.default_wallet_address = "0xk99_9nNFJk_4mBJKHRI_ljir39mN_jeOJNOO";
        // supported methods
        this.TRANSFER = "transfer";
        this.WITHDRAWAl = "withdrawal";
        this.BALANCE = "balance";
        // private DEPOSIT="deposit"
        // random balance 
        this.balance = Math.floor((Math.random() * 10000) + 100);
    }
    proceedATM() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ans = yield inquirer.prompt([
                    {
                        type: 'input',
                        name: 'userid',
                        message: chalk.bgCyan('Enter account holder\'s name: '),
                        default: chalk.yellow('John Doe')
                    },
                ]);
                if (isNaN(Number(ans.userid))) {
                    console.log('\n');
                    inquirer.prompt([
                        {
                            type: 'password',
                            mask: '*',
                            name: 'pin',
                            message: chalk.bgCyan('Enter 4 digit pin: '),
                        },
                    ]).then(({ pin }) => {
                        console.log('\n');
                        if (pin) {
                            this.checkCredentials(ans.userid, pin);
                        }
                    });
                }
                else {
                    console.log(chalk.bgRed('please enter correct name'));
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
            console.log(chalk.red('pin must be four digit. try again...'));
            this.proceedATM();
        }
        else {
            this.fundMethods();
        }
    }
    fundMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ans = yield inquirer.prompt([
                    {
                        type: 'expand',
                        name: 'method',
                        message: chalk.bgCyan('Select key or enter to choose a method: '),
                        choices: [
                            {
                                key: 'b',
                                name: chalk.green('check balance'),
                                value: this.BALANCE
                            },
                            {
                                key: 'w',
                                name: chalk.green('Withdrawal'),
                                value: this.WITHDRAWAl,
                            },
                            {
                                key: 't',
                                name: chalk.green('Transfer'),
                                value: this.TRANSFER,
                            },
                        ],
                    },
                ]);
                switch (ans.method) {
                    case this.BALANCE:
                        console.log(`_____________\n${chalk.green(`your current balance is ${chalk.magenta('$' + this.balance)}`)}.\n_____________`);
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
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'repeatMethodCycle',
                message: chalk.bgCyan('Do you want to furthur proceed.. ')
            }
        ]).then(({ repeatMethodCycle }) => {
            if (repeatMethodCycle)
                this.fundMethods();
        });
    }
    transfer() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: chalk.bgCyan('Enter amount that you want to transfer: ')
            }
        ]).then(({ amount }) => {
            if (!isNaN(Number(amount))) {
                this.balance = this.balance - Number(amount);
                inquirer.prompt([
                    {
                        type: 'rawlist',
                        name: 'amount',
                        message: chalk.bgCyan('We currently support these platforms.'),
                        default: chalk.yellow('Binance'),
                        choices: [
                            'Easypaisa',
                            'Binance',
                            'UBL Digital',
                            'Naya Pay'
                        ].map(a => chalk.green(a)),
                    },
                ]).then((a) => {
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'amount',
                            message: chalk.bgCyan('Enter your wallet address'),
                            default: chalk.magenta(this.default_wallet_address)
                        }
                    ]).then(() => {
                        console.log(`_____________________\n${chalk.yellow('Transaction is under process. we\'ll share details with you shortly. Thanks')}\n_____________________`);
                        this.newTransaction();
                    });
                });
            }
            else {
                console.log(chalk.bgRed('Enter valid amount.'));
                this.transfer();
            }
        });
    }
    withdrawal() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: chalk.bgCyan(`Your balance is ${chalk.yellow('$' + this.balance)}. Enter withdrawal amount: `)
            }
        ]).then((ans) => {
            console.log('\n');
            const amount = Number(ans.amount);
            if (amount < this.balance) {
                inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'receipt',
                        message: chalk.bgCyan(`Can I generate receipt for you? `)
                    },
                ]).then(({ receipt }) => {
                    if (receipt) {
                        console.log('\n' + chalk.bgMagenta(`name:   ${chalk.yellow(this.name)}\ntotal amount:    ${chalk.yellow('$' + this.balance)}\nwithdrawal amount:    ${chalk.yellow('$' + amount)}\ntotal balance   ${chalk.yellow('$' + (this.balance - amount))}`) + '\n');
                        this.newTransaction();
                    }
                });
            }
            else {
                console.log(chalk.yellow('Your entered amount is greater than your current balance\nEnter amount again.'));
                this.withdrawal();
            }
        });
    }
}
