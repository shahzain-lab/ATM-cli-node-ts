import chalk from 'chalk';
import inquirer from 'inquirer';

export class ATMMachine {
    // credentials
    name: string = '';

    // default_wallet_address
    private default_wallet_address="0xk99_9nNFJk_4mBJKHRI_ljir39mN_jeOJNOO"

    // supported methods
    protected TRANSFER="transfer";
    protected WITHDRAWAl="withdrawal";
    protected BALANCE="balance"
    // private DEPOSIT="deposit"
 
    // random balance 
    balance = Math.floor((Math.random() * 10000) + 100);

   async proceedATM(): Promise<void> {
       try{
             const ans = await inquirer.prompt([
             {
                 type: 'input',
                 name: 'userid',
                 message: chalk.bgCyan('Enter account holder\'s name: '),
                 default: chalk.yellow('John Doe')
             },
                
            ])
            if(isNaN(Number(ans.userid))){
                console.log('\n')
                inquirer.prompt([
                    {
                        type: 'password',
                        mask: '*',
                        name: 'pin',
                        message: chalk.bgCyan('Enter 4 digit pin: '),
                    },
                ]).then(({pin}) => {
                    console.log('\n')
                     if(pin) {
                         this.checkCredentials(ans.userid, pin);
                     }
                })
            }
            else {
                console.log(chalk.bgRed('please enter correct name'))
                this.proceedATM()
            }
       }catch(err) {
           console.log(err)
       }
    }
    
    checkCredentials(name: string, pin: string): void {
        this.name = name
        if(pin.length > 4 || pin.length < 4) {
            console.log(chalk.red('pin must be four digit. try again...'));
            this.proceedATM()
        } else {
            this.fundMethods();    
        }
    }

    async fundMethods(): Promise<void> {
         try{
             const ans = await inquirer.prompt([
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
         ])
         switch(ans.method) {
             case this.BALANCE:
                 console.log(`_____________\n${chalk.green(`your current balance is ${chalk.magenta('$'+this.balance)}`)}.\n_____________`);
                this.newTransaction()
             break;
             case this.WITHDRAWAl:
                  this.withdrawal();
                break;
             case this.TRANSFER:
                 this.transfer();
                break;
         }
        }catch(err) {
            console.log(err)
        }
    }

    newTransaction(): void {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'repeatMethodCycle',
                message: chalk.bgCyan('Do you want to furthur proceed.. ')
            }
        ]).then(({repeatMethodCycle}: {repeatMethodCycle: Boolean}) => {
            if(repeatMethodCycle) this.fundMethods();
        });
    }

    transfer(): void {
        inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: chalk.bgCyan('Enter amount that you want to transfer: ')
            }
        ]).then(({amount}) => {
            if(!isNaN(Number(amount))) {
                this.balance = this.balance - Number(amount)
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
                            })
                })
            } else {
                            console.log(chalk.bgRed('Enter valid amount.'));
                            this.transfer()
                 }
        })
    }

    withdrawal(): void {
        inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: chalk.bgCyan(`Your balance is ${chalk.yellow('$' + this.balance)}. Enter withdrawal amount: `)
            }
        ]).then((ans) => {
            console.log('\n')
            const amount = Number(ans.amount);
            if(amount < this.balance) {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'receipt',
                    message: chalk.bgCyan(`Can I generate receipt for you? `)
                },
            ]).then(({receipt}) => {
                if(receipt) {
                    console.log('\n' + chalk.bgMagenta(`name:   ${chalk.yellow(this.name)}\ntotal amount:    ${chalk.yellow('$' + this.balance)}\nwithdrawal amount:    ${chalk.yellow('$' + amount)}\ntotal balance   ${chalk.yellow('$' + (this.balance - amount))}`) + '\n');
                    this.newTransaction();
                }
            })
            }else {
               console.log(chalk.yellow('Your entered amount is greater than your current balance\nEnter amount again.'))
                this.withdrawal() 
            }
        });
    }
}