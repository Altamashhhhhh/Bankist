"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Add Usernames in Accounts

accounts.forEach(acc => {
  acc.username =  acc?.owner.split(" ").map(name => name[0]).join("").toLowerCase()
})

let currentAccount , timer ; 


function randomDate(start , end , previousDate = null){
  const startDate = previousDate ? Math.max(new Date(start).getTime() , previousDate.getTime() + 86400000) : new Date(start).getTime() ;
  const endDate = new Date(end).getTime() ;  
  const timestamp =  Math.floor(Math.random() * (endDate - startDate + 1 ) ) + startDate ; 
  return new Date(timestamp)
}
let previousDate = null ; 
const today = new Date()
const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1 ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}` 

const date = randomDate("2024-01-01" , todayFormatted , previousDate)
previousDate = date


// containerMovements

const displayTransaction = (acc , sort = false) => {
  containerMovements.innerHTML = "" ; 

  const mov = sort ? acc.movements.slice().sort((a,b)=>b-a) : acc.movements ; 

  mov.forEach((trans , i) => {
    const type = trans > 0 ? "deposit" : "withdrawal"
    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1 } ${type}</div>
          <div class="movements__date">${randomDate("2024-01-01" , todayFormatted , previousDate).toLocaleDateString("en-GB")}</div>
          <div class="movements__value">${trans}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


const calcBalanceDisplay = acc => {
  acc.balance = acc?.movements.reduce((acc, curr)=>acc + curr , 0)
  labelBalance.innerText = `${acc.balance} €`
}


const calcBalanceSummary = account => {
  const income = account?.movements.filter(bal => bal > 0).reduce((acc, curr )=> acc + curr , 0 )
  labelSumIn.textContent = `${income}€`

  const out = account?.movements.filter(bal => bal < 0 ).reduce((acc, curr)=>acc+curr,0)
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = account?.movements.filter(bal => bal > 0 ).map(bal => bal * account.interestRate / 100 ).filter(bal => bal >= 1 ).reduce((acc,curr)=> acc+curr , 0 ) ; 
  labelSumInterest.textContent = `${interest}€`
}

function startLogoutTimer(){
  let time = 300 ; 
   timer = setInterval(()=>{
    let minute = Math.trunc(time / 60)
    let second = time % 60 ; 

    labelTimer.textContent = `${String(minute).padStart(2 , "0")}:${String(second).padStart(2, "0")}`
    time--

    if(time === 0){
      clearInterval(timer)
      labelWelcome.textContent = "login to get started"
      containerApp.style.opacity = 0 ; 
    }

  },1000)
  return timer ; 

}

function updateUI(currentAccount){
 // Calculate Balance
 calcBalanceDisplay(currentAccount)

 // Calculate Summary 
 calcBalanceSummary(currentAccount)

 // Display Movements
 displayTransaction(currentAccount);
}



btnLogin.addEventListener("click" , (e)=>{
  e.preventDefault() ; 

  containerApp.style.opacity = 100; 
  inputLoginPin.blur()
  
  // Display UI
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount)
  
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log("Login Successfull")
  }else{
    console.log("Login Denied")
    containerApp.style.opacity = 0 ; 
  }
  
  inputLoginPin.value = inputLoginUsername.value = "" ; 

  if (timer) clearInterval(timer)
  timer = startLogoutTimer()

  updateUI(currentAccount)
})

btnTransfer.addEventListener("click" , (e)=>{
  e.preventDefault()

  const amount = Number(inputTransferAmount.value) ; 
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  console.log("Reciever Account :-- " , receiverAcc )

  if(amount > 0 && currentAccount.balance >= amount && inputTransferTo.value !== currentAccount.username && receiverAcc?.username ){
    currentAccount.movements.push(-amount)
    receiverAcc?.movements.push(amount)
    console.log("Transaction Successfull")
    }
  
  // Clear Timer 
  clearInterval(timer)
  timer = startLogoutTimer()

  updateUI(currentAccount)
  inputTransferAmount.value = inputTransferTo.value = "" ;
})

btnClose.addEventListener("click" , (e)=>{
  e.preventDefault()
  // inputCloseUsername   inputClosePin

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    accounts.splice(index , 1 )
    containerApp.style.opacity = 0 ; 

  }
  else console.log("Wrong Credentials")
  inputCloseUsername.value = inputClosePin.value = "" ; 
}) 

btnLoan.addEventListener("click" , (e)=>{
  e.preventDefault() ; 
  const amount = Number(inputLoanAmount.value)
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount) ; 
    console.log("Loan Granted")
  }

  // Clear Timer 
  clearInterval(timer)
  timer = startLogoutTimer()
  
  updateUI(currentAccount)
  inputLoanAmount.value = "" ; 

})

let sorted = false ; 

btnSort.addEventListener("click" , (e)=>{
  e.preventDefault() ; 
  displayTransaction(currentAccount , sorted )
  sorted = !sorted
})



labelBalance.addEventListener("click" , ()=>{
  const movementsUI = Array.from(document.querySelectorAll(".movements__value") , (el)=>Number(el.textContent.replace("€" , "")))
  console.log(movementsUI)
})

labelDate.textContent = new Date().toLocaleDateString("en-GB")
/////////////////////////////////////////////////
