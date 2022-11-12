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
                 message: 'Enter account holder\'s name',
                 default: 'John Doe'
             },
                
            ])
            if(isNaN(Number(ans.userid))){
                inquirer.prompt([
                    {
                        type: 'password',
                        mask: '*',
                        name: 'pin',
                        message: 'Enter 4 digit pin',
                    },
                ]).then(({pin}) => {
                     if(pin) {
                         this.checkCredentials(ans.userid, pin);
                     }
                })
            }
            else {
                console.log('please enter correct name')
                this.proceedATM()
            }
       }catch(err) {
           console.log(err)
       }
    }
    
    checkCredentials(name: string, pin: string): void {
        this.name = name
        if(pin.length > 4 || pin.length < 4) {
            console.log('pin must be four digit. try again...');
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
         ])
         switch(ans.method) {
             case this.BALANCE:
                 console.log(`_____________\nyour current balance is $${this.balance}.\n_____________`);
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
                message: 'Do you want to furthur proceed..'
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
                message: 'Enter amount that you want to transfer: '
            }
        ]).then(({amount}) => {
            if(!isNaN(Number(amount))) {
                inquirer.prompt([
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
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'amount',
                            message: 'Enter your wallet address',
                            default: this.default_wallet_address
                        }
                    ]).then(() => {
                        console.log('_____________________\nTransaction is under process. we\'ll share details with you shortly. Thanks\n_____________________');
                        this.newTransaction();
                    })
                })
            }
        })
    }

    withdrawal(): void {
        inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: `Your balance is $${this.balance}. Enter withdrawal amount: `
            }
        ]).then((ans) => {
            const amount = Number(ans.amount);
            if(amount < this.balance) {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'receipt',
                    message: `Can I generate receipt for you?`
                },
            ]).then(({receipt}) => {
                if(receipt) {
                    console.log(`_____________\nname:   ${this.name}\ntotal amount:    $${this.balance}\nwithdrawal amount:    $${amount}\ntotal balance   $${this.balance - amount}\n_____________`);
                    this.newTransaction();
                }
            })
            }else {
               console.log('_____________________\nYour entered amount is greater than your current balance\nEnter amount again.')
                this.withdrawal() 
            }
        });
    }
}