// global Variables
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let loader = document.querySelector(".loader-container");
let mood = 30;
let difficulty = "normal"
let easyWords = ["go","very","is", "here", "now", "then", "for", "the", "river", "sea", "see", "match","was", "were", "are", "his", "her","he","she", "it","bat","week","weak", "sun", "moon"];
let normalWords =["work", "there", "minimum", "maximum", "friend", "enemy", "mark", "social", "powerful", "month", "year", "today", "yesterday", "main", "because","where", "what", "when", "place", "container", "game", "play","run", "sprint", "jump", "swim", "shore", "land", "fly", "manage", "alarm", "wake", "sleep", "hello", "good", "bad","go","very","is", "here", "now", "then", "for", "the", "river", "sea"];
let hardWords =["difficult", "serroundings", "legislation", "attripution", "absolute", "relatively", "surprisingly", "matching", "pullet", "beautiful", "ugly", "feast", "hungry", "mean","place", "container", "game", "play","run", "sprint", "jump", "swim", "shore", "land", "fly", "manage", "alarm", "wake", "sleep", "hello", "good", "bad","management", "overseals", "playboy"];
let allWords = easyWords.concat(normalWords, hardWords);
let testSample;
let testSampleHTML;
let lastInputLengh = 0;
let highScore = 0;
let currentSpeed = 0;
let accuracy = 0;
let wordsCount = 0;
let wrapAccuracy = [];
let wrapCount = 0;

// Elements 
let background = document.getElementById("background-text");
let results = document.querySelector(".overlay .results");
let resultsElementHTML = document.querySelector(".overlay .results").innerHTML;
let userInput = document.getElementById("input");

//  loading 
window.addEventListener('load', ()=>{
    loader.style.display = "none";
})
// landing page
function hackerEffect(element){
    let intervalCount = 0
    const hackerEffectInterval = setInterval(() =>{
        element.innerText = element.dataset.text.split("")
        .map(function(letter, index){
        if (index <= intervalCount) {
            return element.dataset.text[index]
        }else{
            return letters[Math.floor(Math.random()* 26 )]}
        }).join("")
        if (intervalCount >= element.dataset.text.length){
            clearInterval(hackerEffectInterval)
        }
        intervalCount++
    },2500/element.dataset.text.length)
}
hackerEffect(document.querySelector(".landing-h1"))
setTimeout(() => {
    hackerEffect(document.querySelector(".landing-h2"))
    setTimeout(()=>{
        document.querySelector(".landing button").style["animation"] = "landing-button 0.8s ease-out";
        setTimeout(()=>document.querySelector(".landing button").style["opacity"] = "1",700)
    }, 2500)
}, 2500); 
// app settings
function dropdown(element) {
    document.getElementById(`${element.getAttribute("data-dropID")}-dropdown`).classList.toggle("show");
  }
  // changing values of search and UI after selecting a search option

function dropdownOption(element, value) {
    document.getElementById(`${element.getAttribute("data-dropID")}-dropbtnText`).innerText = `${value}`;
    if (element.getAttribute("data-dropID") == "difficulty"){
        difficulty = element.getAttribute("data-value")
    }else if(element.getAttribute("data-dropID") == "mood"){
        mood = element.getAttribute("data-value")
        if(element.getAttribute("data-value") == 120){
            document.querySelector(".timer-container text").style["transform"] = "translateX(-28px)"
        }else{
            document.querySelector(".timer-container text").style["transform"] = "translateX(-20px)"
        }
        document.getElementById('timer-text').innerHTML = mood;
    }
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {dropdowns[i].classList.remove("show")}
    }
  };

//   Main App
function onInput(){
    let userInputValue = userInput.value;
    // console.log(userInput.length)
    // console.log(testSample.length)
    if (userInputValue.length <= testSample.length){
        if (userInputValue.length > lastInputLengh){
            for (let i = 0; i < userInputValue.length; i++) {
    
                if (userInputValue[i] == testSample[i]){
                    background.childNodes[i].setAttribute("class", "correct")
                }else{
                    background.childNodes[i].setAttribute("class", "wrong")
                }
            }
        }else{
           for(let i = 0; i< lastInputLengh - userInputValue.length; i++){
            background.childNodes[userInputValue.length + i ].setAttribute("class", "")
           }
        }
        lastInputLengh = userInputValue.length
    }else{
        wrapAccuracy.push(calcAccuracy());
        wordsCount += userInputValue.split(" ").length
        console.log(wordsCount)
        console.log(wordsCount)
        wrapCount++
        let sample = allWords.map((word, index)=>{if (index < 70){return allWords[Math.floor(Math.random()*allWords.length)]}}).filter((word)=> word != undefined).join(" ").split("");
        testSample = sample
        sample = sample.map((word, index)=>{return `<span class = ''>${sample[index]}</span>`})
        background.innerHTML = sample.join("");
        userInput.focus()
        userInput.value = "";
        lastInputLengh = 0
    }
}
function calcResult(){
    if (wrapCount == 0){
        console.log("no wraping")
        accuracy = calcAccuracy()
        currentSpeed = calcSpeed(userInput.value , mood)
    }else{
        let totalWrapAccuracy = 0;
        wrapAccuracy.forEach((wrap)=> totalWrapAccuracy+= wrap);
        accuracy = Math.floor((totalWrapAccuracy + calcAccuracy()) / (wrapAccuracy.length+1))
        currentSpeed = Math.ceil((wordsCount + userInput.value.split(" ").length)  / (mood/60))
    }
}
function calcAccuracy(){
    let correct = 0;
    let wrong = 0;
    background.childNodes.forEach((span)=> span.classList.contains("correct")? correct++ : span.classList.contains("wrong")? wrong++ : "")
    let all = correct+wrong;
    if (all == 0){
        return 0
    }else{
        return Math.floor(correct / all * 100)
    }
}
function calcSpeed(text, mood){
    return Math.ceil(text.split(" ").length/(mood/60))
}
function highScoreBreak(){
    if(currentSpeed > highScore){
        startConfetti(document.body, 3000);
        highScore = currentSpeed
    }
}
//   timer
function startTimer () {
    var circle = document.getElementById('timer');
    var text = document.getElementById('timer-text');
    var angle = 300;
    
    timer = setInterval(function () {
      circle.setAttribute("stroke-dasharray", angle + ", 20000");
      text.innerHTML = mood* angle/300;
      
      if (angle <= 0) {
        clearInterval(timer);
        circle.setAttribute("stroke-dasharray", 360 + ", 20000")
        text.innerHTML = mood;
    }
      angle -= 300/mood;
    }.bind(this), 1000);
  }


// UI Modification
results.innerHTML = `<span class="starting-text"> Start Typing!</span>`
function updateUI(){
    results.innerHTML = resultsElementHTML;
    document.getElementById("speed-result").innerHTML = currentSpeed;
    document.getElementById("accuracy-result").innerHTML = accuracy + "%";
    document.getElementById("highscore-result").innerHTML = highScore;
    document.querySelector(".background .overlay").style["z-index"] = "10";
}


// APP ENDPOINT FUNCTION
function startTest(mood, difficulty){
    // reassiging the variables for a new cycle
    lastInputLengh = 0;
    currentSpeed = 0;
    accuracy = 0;
    wordsCount = 0;
    wrapAccuracy = [];
    wrapCount = 0;
    userInput.value = "";

    // creating new random sequance of words
    let sample = allWords.map((word, index)=>{if (index < 70){return allWords[Math.floor(Math.random()*allWords.length)]}}).filter((word)=> word != undefined).join(" ").split("");
    testSample = sample
    sample = sample.map((word, index)=>{return `<span class = ''>${sample[index]}</span>`})
    background.innerHTML = sample.join("");
    userInput.focus();
    // removing the overlay on top of the text area to allow typing;
    document.querySelector(".background .overlay").style["z-index"] = "-1";
    // starting the timer 
    startTimer()

    setTimeout(() => {
        calcResult();
        highScoreBreak();
        updateUI()
    }, (mood * 1000)+ 2000);
}
document.getElementById("start-btn").addEventListener("click", ()=>startTest(mood, difficulty))

// setting the confettiful element 

const Confettiful = function(el, duration) {
    this.el = el;
    this.containerEl = null;
    this.duration = duration
    this.confettiFrequency = 3;
    this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D']; // color variations amoung individual confettis
    this.confettiAnimations = ['slow', 'medium', 'fast']; // animation variations (take a lokk at the CSS file)
    
    this._setupElements(); // calling the elements creatioin function
    this._renderConfetti(this.duration); // calling the elements rendering function function
  };
  // Elemens' setup function
  
  Confettiful.prototype._setupElements = function() {
    const containerEl = document.createElement('div');
    const elPosition = this.el.style.position;
    
    // to insure the position is either absolute or relative in order for the final effect to work properly
    if (elPosition !== 'relative' || elPosition !== 'absolute') {
      this.el.style.position = 'relative';
    }
    
    containerEl.classList.add('confetti-container'); // adding the class of the confetti container ( take a lokk at the CSS file)
    
    this.el.appendChild(containerEl);
    
    this.containerEl = containerEl;
  };
  // Elements' rendering function
  Confettiful.prototype._renderConfetti = function(duration = 3000) {
    let timeStart = Date.now() // calculation of the time of starting the effect
    this.confettiInterval = setInterval(() => {
      const confettiEl = document.createElement('div');
      const confettiSize = (Math.floor(Math.random() * 3) + 10) + 'px'; //random selection of size
      const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];//random selection of background color
      const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px'; //random selection of location (offset)
      const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)]; //random selection of animation (slow, medium, fast)
      
      confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;
  
      this.containerEl.appendChild(confettiEl);
      // termination of the effect after 3000 ms (Optional) 
      if(Date.now() - timeStart > duration){
        clearInterval(this.confettiInterval) // clearing the interval
        let confettiContainer = document.querySelectorAll(".confetti-container")
        confettiContainer.forEach((container)=> container.remove())
      }
      
    }, 20); 
    // The interval repeatition time is 20ms (optional).
    // Every time it runs it generates a new individual confetti with random color, size and animation
  };
  // you can add a condition or a function to start new confettiful effect at the spacified Container 
  // you can call the new effect just by using the startConfetti(selector, duration) funcion with the selector of the contianer and the desired duration of the effect inside it as showen below
  function startConfetti(Selector = document.body, duration){
    window.confettiful = new Confettiful(Selector, duration);
  }