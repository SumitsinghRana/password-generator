//fetch all the needed tags
const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numberCheck = document.querySelector("#numbers")
const symbolCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")


const symbols = "!@#$%&*?"


//set default values
let password = ""//password is empty at the start
let passwordLength = 6 
let checkboxCount = 0
//set strength-indicator to gray
setIndicator("#ccc")

//sets length of password
function handleSlider(){
    inputSlider.value = passwordLength
    lengthDisplay.innerText = passwordLength
}

handleSlider()

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

//generate random values
function getRandomInterger(min,max){
    return Math.floor(Math.random()*(max-min)) + min
}

function generateRandomNumber(){
    return getRandomInterger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInterger(97,123))
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInterger(65,91))
}

function generateSymbols(){
    const randNum = getRandomInterger(0,symbols.length)
    return symbols.charAt(randNum)
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;


    //state of check boxes
    if(uppercaseCheck.checked){
        hasUpper = true;
    }
    if(lowercaseCheck.checked){
        hasLower = true;
    }
    if(numberCheck.checked){
        hasNum = true;
    }
    if(symbolCheck.checked){
        hasSym = true;
    }

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0BDA51")
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && password >=8){
        setIndicator("#DC143C")
    }
    else{
        setIndicator("#f00")
    }
}


//password is copied or NOT(we have used "navigator.clipboard.writeText(copyText.value)" to copy to clipboard)
//write.text returns a promise
//it is a async operation
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied"
    } 
    catch (error) {
        copyMsg.innerText = "Failed"    
    }
    //to make copy span visible
    copyMsg.classList.add("active")

    //to remove span message
    setTimeout(() => {
        copyMsg.classList.remove("active")
    },2000)
}


//change in slider
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value
    handleSlider()
})


copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value){
        copyContent()
    }
})


function handleCheckBoxChange(){
    checkboxCount = 0
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkboxCount++;
        }
    })

    //corner case
    if(passwordLength < checkboxCount){
        passwordLength = checkboxCount
        handleSlider()
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
})

function shufflePassword(array){
    //Fisher Yates method
    for(let i=array.length - 1; i>0; i--)
    {
        const j = Math.floor(Math.random() * (i+1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    let str=""
    array.forEach((elem) => (str+=elem))
    return str
}


//generate button
generateBtn.addEventListener('click',() => {
    //none of the checkbox are selected
    if(checkboxCount<=0){
        return
    }
    if(passwordLength < checkboxCount){
        passwordLength = checkboxCount
        handleSlider()
    }

    //get password

    //remove old password
    password = ""

    //get new password
    let funcArr = []
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase)
    } 
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase)
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber)
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbols)
    }
    
    //compuslory addition
    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]()
    }

    //remaining addition
    for(let i=0; i<passwordLength - funcArr.length; i++)
    {
        let randIndex = getRandomInterger(0,funcArr.length)
        password+=funcArr[randIndex]()
    }

    //shuffle the password
    password = shufflePassword(Array.from(password))


    //show in UI
    passwordDisplay.value = password

    //calculate strength
    calcStrength()
})