const contentBox = document.getElementsByClassName("public-DraftEditor-content")[0]
const titleBox = document.getElementsByTagName("textarea")[0]
const buttons = [...document.getElementsByTagName("button")]
const headers = [...document.getElementsByTagName("h1")]
const comments = [...document.getElementsByClassName("Comment")]
const posts = [...document.getElementsByClassName("Post")]
const divs = [...document.getElementsByTagName("div")]
let postContent;
let submitButton;
buttons.forEach(button => {
  if (button.textContent == "Post" && button.childElementCount == 0) submitButton = button;
})
divs.forEach(div => {
  if (div.getAttribute("data-click-id") == "text") postContent = div;
})

console.log({ contentBox, titleBox, submitButton, postContent, headers })

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const findPositionsRegx = /\d{1,2}\d{0,2}\/\d{1,2}\d{0,2}\W?([a-zA-Z]{3,4})[\W$]{0,2}\d{1,4}[CPcp]?/g;
const findPositionsRegx2 = /([a-zA-Z]{3,4})[\W$]{0,2}\d{1,4}[CPcp]?\W?\d{1,2}\d{0,2}\/\d{1,2}\d{0,2}/g;
const findPositionsRegx3 = /([a-zA-Z]{3,4})\W?\d{1,2}\d{0,2}\/\d{1,2}\d{0,2}[\W$]{0,2}\d{1,4}[CPcp]?/g;
const findPositionsRegx4 = /([a-zA-Z]{3,4})[\W$]{0,2}\d{1,4}[CPcp]\W??\d{1,2}\d{0,2}\/\d{1,2}\d{0,2}/g;
const findTickers = (text) => {
  let matches = [...text.matchAll(findPositionsRegx)]
  let matches2 = [...text.matchAll(findPositionsRegx2)]
  let matches3 = [...text.matchAll(findPositionsRegx3)]
  let matches4 = [...text.matchAll(findPositionsRegx4)]
  matches = matches.concat(matches2)
  matches = matches.concat(matches3)
  matches = matches.concat(matches4)
  return matches;
}
const getMatches = (content, matches) => {
  let tickers = []
  matches.forEach(match => {
    const ticker = match[1]
    const randIndex = getRandomInt(0, memeTickers.length - 1)
    const newTicker = memeTickers[randIndex]
    content = content.split(ticker).join(newTicker)
    tickers.push([ticker, newTicker])
  })
  return { content, tickers }
}
const memeTickers = ["XES", "ROPE", "SALT", "WSBF"]
const fixValue = (elem) => {
  let content = elem.value
  const matches = findTickers(content)
  content = getMatches(content, matches)
  elem.value = content.content
  return content.tickers
}
const fixContent = (elem, tickers) => {
  let content = elem.innerHTML
  const matches = findTickers(content)
  content = getMatches(content, matches)
  console.log("Updating post with content", content)
  elem.innerHTML = content.content
  if (tickers) tickers.forEach(tickerSet => {
    console.log("for overriding with tickerset", tickerSet)
    const sourceTicker = tickerSet[0]
    const targetTicker = tickerSet[1]
    elem.innerHTML = elem.innerHTML.split(sourceTicker).join(targetTicker)
  })
  return content.tickers
}
if (submitButton) submitButton.addEventListener("mouseover", (event) => {
  fixContent(contentBox)
  fixValue(titleBox)
})
setTimeout(() => {
  let force
  if (postContent) {
    force = fixContent(postContent)
  }
  headers.forEach(header => {
    fixContent(header, force)
  })
  comments.forEach(comment => {
    fixContent(comment, force)
  })
  posts.forEach(post => {
    const divs = posts.getElementsByTagName("div")
    divs.forEach(div => {
      if (div.getAttribute("data-click-id") == "text" || div.getAttribute("data-click-id") == "background") {
        fixContent(div)
      }
    })
  })
}, 50)
