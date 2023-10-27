const inquirer = require('inquirer');

const mainMenu = [
    {
        type: 'list',
        name: 'mainOption',
        message: 'What would you like to do?',
        choices: ['Option 1', 'Option 2', 'Exit'],
    },
];

const subMenuOption1 = [
    {
        type: 'list',
        name: 'subOption1',
        message: 'You chose Option 1. What would you like to do next?',
        choices: ['Sub Option 1', 'Sub Option 2', 'Go back'],
    },
];

const subMenuOption2 = [
    {
        type: 'list',
        name: 'subOption2',
        message: 'You chose Option 2. What would you like to do next?',
        choices: ['Sub Option 3', 'Sub Option 4', 'Go back'],
    },
];

const main = async () => {
    while (true) {
        const mainAnswer = await inquirer.prompt(mainMenu);

        if (mainAnswer.mainOption === 'Option 1') {
            const subAnswer = await inquirer.prompt(subMenuOption1);
            if (subAnswer.subOption1 === 'Go back') {
                continue;
            }
            // Handle Option 1 Sub Options here
            console.log('Handling Option 1 Sub Option:', subAnswer.subOption1);
        } else if (mainAnswer.mainOption === 'Option 2') {
            const subAnswer = await inquirer.prompt(subMenuOption2);
            if (subAnswer.subOption2 === 'Go back') {
                continue;
            }
            // Handle Option 2 Sub Options here
            console.log('Handling Option 2 Sub Option:', subAnswer.subOption2);
        } else if (mainAnswer.mainOption === 'Exit') {
            console.log('Exiting...');
            break;
        }
    }
};

main();
