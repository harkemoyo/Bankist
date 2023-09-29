"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -300, 3000, -650, -130, 70, 300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/***************************************************************************** */
// function
const displayMovements = function (movements, sorting = false) {
  containerMovements.innerHTML = "";

  const sort = sorting ? movements.slice().sort((a, b) => a - b) : movements;

  sort.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/***************************************************************************** */

// Update UI Function
// Making code DRY

const updateUi = function (current) {
  // console.log(current);
  // display current  movements when the user logs in
  // Displaying the UI
  displayMovements(current.movements);

  // Displaying current balances when the user logs
  calcDisplayBalance(current);
  // Displaying the Summary when the user logs
  calcDisplaySummaryIn(current);
};

/***************************************************************************** */

// Array reduce
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((movements, mov) => movements + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// chaining Array methods

const calcDisplaySummaryIn = function (acc ,) {
  const displaySummary = acc.movements
    .filter((movement) => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${displaySummary}€`;
  const belowSumIn = acc.movements
    .filter((moneyOut) => moneyOut < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = `${Math.abs(belowSumIn)}€`;

  const interest = acc.movements
    .filter((movement) => movement > 0)
    // calc interest rate
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

/***************************************************************************** */
// Button  functions
// Event listeners
// Working with login
//
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  // find the user of the current account using  name initials
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
  }
  // console.log(currentAccount);
  // calling the opacity class
  containerApp.style.opacity = 100;

  // Clearing the input fields
  inputLoginUsername.value = inputLoginPin.value = "";

  //  clearing the focus
  // inputLoginUsername.blur()
  inputLoginPin.blur();

  updateUi(currentAccount);
});

/***************************************************************************** */
// Implementing the username initals
const createUsernames = function (account) {
  // console.log(account);
  account.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((user) => user[0])
      .join("");
    // console.log(acc.username);
  });
};
createUsernames(accounts);



/***************************************************************************** */
// creating transfer button

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  //  clearing the input transfer

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  // conditions for transferto and amount
  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    updateUi(currentAccount);
  }

  // console.log(amount, recieverAccount);
});

/***************************************************************************** */
// Requsting Loan Amount
// Adding conditions if  Qualify for a Loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // Target loan Amount input
  const loan = Number(inputLoanAmount.value);

  // Use some method to set the condition

  if (loan > 0 && currentAccount.movements.some((mov) => mov >= loan * 0.1)) {
    currentAccount.movements.push(loan);

    // update the UI with the current account balance
    updateUi(currentAccount)

  }
  // clear the Input
  inputLoanAmount.value = '';
});





/***************************************************************************** */

// close btn
// Using findIndex method
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete the account
    accounts.splice(index, 1);

    // console.log(accounts);

    // After the account is deleted Hide the UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});


/****************************************************************************************************/
// Creating a sorting field button
// Creating a state variable for preserving of the sorting in every click
let sorted = false;
btnSort.addEventListener ("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted) //!sorted makes it true and false if sorted or not;
  // flip the sorting in every click
  sorted = !sorted;
})



// Find method
 
// const ownerAccount = accounts.find(user  => user.owner === 'Jessica Davis')
// console.log(ownerAccount);
// let ownerAccount;
// for (const account of accounts) if(account.owner === 'Jessica Davis'){
//  ownerAccount = account
// }
// console.log(ownerAccount);

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const checkDogs = function (dogsJulia,dogsKate){
//   const dogsJuliaCorrect = dogsJulia.slice(); ///
//   dogsJuliaCorrect.splice(0, 1);
//   dogsJuliaCorrect.splice(-2)

//   const both = dogsJuliaCorrect.concat(dogsKate);
//  console.log(both);

//  both.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// }
// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3])
// checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4])

// LECTURES

// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
//   ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// The map Method
const eurToUsd = 1.1;

const movementsUSD = movements.map((mov) => mov * eurToUsd);
// console.log(movementsUSD);

const movementsSign = movements.map(
  (mov, i) =>
    `Movement ${i + 1} : You ${mov > 0 ? "Deposit" : "Withdrew"} ${Math.abs(
      mov
    )}`
);
// console.log(movementsSign);

// Computing the username

// const createUsernames = function (account) {
//   // console.log(account);
//   account.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(" ")
//       .map((user) => user[0])
//       .join("");
//     // console.log(acc.username);
//   });
// };

// // const username = user.toLowerCase().split(' ').map(user => user[0]).join('');
// // console.log(username);

// console.log(accounts);

// Array filter method

// const accountFilter = movements.filter( account => account > 0)
// console.log(accountFilter);

// Array reduce method

// const accountReduce = movements.reduce( (acc, cnt) => acc + cnt, 0)
// console.log(accountReduce);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀 */

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map( age => age <= 2 ? 2 * age :16 + age * 4)
//   .filter(age => age >= 18 )
//   .reduce((acc, currnt , arr) => acc + currnt / arr.length, 0)
//  return humanAge
// }
// calcAverageHumanAge( [5, 2, 4, 1, 15, 8, 3])
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])

// Chaining Array methods


/****************************************************************************************************/
// some and every
// console.log(movements);

// // EQUALITY
// console.log(movements.includes(-130));

// // SOME: CONDITION
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));


// /****************************************************************************************************/

// // flat and flatMap
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // flat
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// // flatMap
// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

// /****************************************************************************************************/

// // Sorting Arrays

// // Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);

// // return < 0, A, B (keep order)
// // return > 0, B, A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);

// // Descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

/****************************************************************************************************/
// // More Ways of Creating and Filling Arrays
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Emprty arrays + fill method
// const x = new Array(7);
// console.log(x);
// console.log(x.map(() => 5));
// x.fill(1, 3, 5);
// x.fill(1);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    // using the Map method
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  // using spread operator 
  // const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  // const element = movementsUI2.map( el => Number(el.textContent.replace('€', '')))
  // console.log(element);
});


/****************************************************************************************************/
// Array Methods Practice

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

// Prefixed ++ oeprator
let a = 10;
console.log(++a);
console.log(a);


// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
// this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitzalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitzalize(word)))
    .join(' ');

  return capitzalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

// Adding variables in an object
const animal = dogs.forEach(dog => dog.recommendedFood = Math.trunc( dog.weight ** 0.75 * 28))
console.log(dogs)

// find and include together
const sarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarah);
console.log(
  `Sarah's dog is eating too ${
    sarah.curFood > sarah.recommendedFood ? 'much' :'little'
  } `
);

// The power of the this array method in Objects 

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood)//dogs with recommended Food
.flatMap(dog => dog.owners)//OWNERS of this dogs
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood)//dogs with recommended Food
.flatMap(dog => dog.owners)//OWNERS of this dogs
console.log(ownersEatTooLittle);


console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much! and ${ownersEatTooLittle.join(" and ")} dogs eat too little!`);

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
console.log(dogs.some(dog => dog.curFood > dog.recommendedFood * 0.90 && dog.curFood < dog.recommendedFood * 1.10));

const eatingOkay = dogs.some(dog => dog.curFood > dog.recommendedFood * 0.90 && dog.curFood < dog.recommendedFood * 1.10)
console.log(eatingOkay);


const sortedFood = dogs.slice().sort((a, b) => a.curFood - b.curFood)
console.log(sortedFood);