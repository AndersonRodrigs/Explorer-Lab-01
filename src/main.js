import "./css/index.css"
import Imask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    discover: ["#5890A6", "#A9D0D9"],
    jcb: ["#005ABB", "#000049"],
    default: ["#000000", "#808080"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `/cc-${type}.svg`)
}

const securityCode = document.getElementById("security-code")
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = Imask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePatern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: Imask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: Imask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}

const expirationDateMasked = Imask(expirationDate, expirationDatePatern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardtype: "discover"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:35\d{0,2})\d{0,12}/,
      cardtype: "jcb"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const founMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return founMask
  }
}

const cardNumberMasked = Imask(cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerHTML =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerHTML = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerHTML = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerHTML = date.length === 0 ? "02/32" : date
}
