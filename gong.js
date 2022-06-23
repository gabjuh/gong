'use strict'


const audioTest = new Audio('Alarm03.wav')
const gongAudio1 = new Audio('gong_1.mp3')
const gongAudio2 = new Audio('gong_2.mp3')
const testButton = document.querySelector('#test')
const activateButton = document.getElementById('activate')
const deactivateButton = document.getElementById('deactivate')
const inputs = document.querySelectorAll('#inputs input')
const countDownElement = document.querySelector('#countdown')
const countDownNumbers = document.querySelector('#countdown h1')
const info = document.getElementById('info')
const firstGongLabel = document.getElementById('firstGong')
const secondGongLabel = document.getElementById('secondGong')


const hour = 17
const minute = 47
const second = 30

const secondGongDelay = 1

// const firstGongHour = () => document.getElementById('firstGongHour')
// const firstGongMinute = () => document.getElementById('firstGongMinute')
// const secondGongHour = () => document.getElementById('secondGongHour')

// const secondGongMinute = () => document.getElementById('secondGongMinute')

const setGongNrsInHtml = () => {
  firstGongLabel.querySelector('.hour').textContent = forceTwoDigits(hour)
  firstGongLabel.querySelector('.minute').textContent = forceTwoDigits(minute)
  secondGongLabel.querySelector('.hour').textContent = forceTwoDigits(hour)
  secondGongLabel.querySelector('.minute').textContent = forceTwoDigits(minute + secondGongDelay)
}

const numberInputs = document.querySelectorAll('#inputs input')

let active = false
let firstClick = true
let firstGongAlreadyDone = false

const init = (currentDate) => {
  activateTimer()
  setDeactivateTimerButton()
  setTestButton()
  setGongNrsInHtml()
  // setEvListenerForInputFiels()

}

// Create dinamically the variables for these input fields and add eventlistener for changes:
// firstGongHour, firstGongMinute, secondGongHour, secondGongMinute
// const setEvListenerForInputFiels = () => {
//   numberInputs.forEach(inp => {
//     let el = window[inp.id] = inp.value
//     inp.addEventListener('change', (e) => {
//       inp.value = e.target.value
//       console.log(e.target)
//     })
//   })
// }

const forceTwoDigits = nr => {
  let nrInString = nr.toString()
  return nrInString.length === 1 ? '0' + nrInString : nrInString
}

const hideDigitsIfNull = nrInStr => nrInStr === '00' ? '' : `${nrInStr}:`

const setCurrentTime = setInterval(() => {
    let time = new Date()
    document.getElementById('currentTime').innerHTML = 
      `${forceTwoDigits(time.getHours())}:${forceTwoDigits(time.getMinutes())}:${forceTwoDigits(time.getSeconds())}`
  }, 1000
)

const setInfo = (msg = '', color = 'danger') => {
  info.textContent = msg
  info.classList.remove('text-danger', 'text-success', 'text-info')
  info.classList.add(`text-${color}`)
}

const endTime = (secondGong = 0) => {
  let time = new Date()
  // console.log(firstGongHour().value + ':' + firstGongMinute().value)
  // time.setHours(parseInt(firstGongHour().value), parseInt(firstGongMinute().value))
  // time.setHours(firstGongHour.value, firstGongMinute.value)
  time.setHours(hour, minute + secondGong, second)
  return time
}

const timerObj = {
  id: 'countdown',
  firstGong: endTime(),
  secondGong: endTime(secondGongDelay),
  debug: false
}

const setTestButton = () => testButton.addEventListener('click', () => audioTest.play())

const activateTimer = () => {
  deactivateButton.setAttribute('disabled', 'disabled')
  activateButton.addEventListener('click', () => {
    Timer(timerObj)    
  })
}

const deactivateTimer = () => {
  deactivateButton.setAttribute('disabled', 'disabled')
  activateButton.removeAttribute('disabled')
  countDownElement.classList.add('deactivatedCountdownColor')
  // inputs.forEach(input => {
  //   input.removeAttribute('disabled')
  // })
}

// Stop button
const setDeactivateTimerButton = () => {
    deactivateButton.addEventListener('click', () => deactivateTimer())
}

const Timer = (object) => {
  const countDown = setInterval(() => {
    let currentDate, distanceFirst, distanceSecond
    
    currentDate = new Date()
    
    if (currentDate > object.firstGong && firstClick && currentDate > object.secondGong) {
      setInfo('Diese Uhrzeit ist vorbei, bitte anpassen!')
      return
    }

    firstClick = false

    activateButton.setAttribute('disabled', 'disabled')
    deactivateButton.removeAttribute('disabled')

    distanceFirst = object.firstGong - currentDate
    distanceSecond = object.secondGong - currentDate

    countDownNumbers.textContent = 
      hideDigitsIfNull(forceTwoDigits(Math.floor((distanceSecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))))
      + hideDigitsIfNull(forceTwoDigits(Math.floor((distanceSecond % (1000 * 60 * 60)) / (1000 * 60))))
      + forceTwoDigits(Math.floor((distanceSecond % (1000 * 60)) / 1000))

    if (!firstGongAlreadyDone) {
      setInfo('Bitte das Fenster nicht schließen!', 'info')
      firstGongLabel.classList.add('border', 'border-success')
    }

    countDownElement.classList.remove('deactivatedCountdownColor')
    // inputs.forEach(input => {
    //   input.setAttribute('disabled', 'disabled')
    // })
    active = true

    if (object.debug) {
      console.log(`Time remaining: ${distanceSecond}`)
    }

    // 1
     // If time runs out for the first Gong
     if (object.firstGong < currentDate && !firstClick && !firstGongAlreadyDone) {
      gongAudio1.play()
      console.log(`First Gong, ${secondGongDelay} Minutes left!`)     
      setInfo(`Erster Gong ist vorbei, ${secondGongDelay} Minuten sind verblieben!`, 'success')
      firstGongLabel.classList.remove('border', 'border-success')
      secondGongLabel.classList.add('border', 'border-success')
      firstGongAlreadyDone = true
    }

    // 2
    // If time runs out for the second Gong
    if (distanceSecond < 0 && !firstClick) {
      clearInterval(countDown)
      countDownNumbers.innerHTML = '00:00:00'
      gongAudio2.play()
      console.log('Time is out!')     
      setInfo('Die Zeit ist abgelaufen!', 'success')
      secondGongLabel.classList.remove('border', 'border-success')
      deactivateTimer() 
      active = false
      firstClick = true
      firstGongAlreadyDone = false
    }

    // If timer will be aborted
    if (!active) {
      clearInterval(countDown)
      countDownNumbers.innerHTML = '00:00:00'
      deactivateTimer()
    }
  }, 1000)
}

init()