 //<div class="card">
               // <div class="card-inner">
                    //<div class="card-front">
                       // <img src="/images/card-JackClubs.png" alt="" class="card-img">
                    //</div>
                   // <div class="card-back">
                       // <img src="/images/card-back-Blue.png" alt="" class="card-img">
                   // </div>
               // </div>
           // </div>
           const cardObjectDefinition = [
            {id:1, imagePath:'/images/card-KingHearts.png'},
            {id:2, imagePath:'/images/card-JackClubs.png'},
            {id:3, imagePath:'/images/card-QueenDiamonds.png'},
            {id:4, imagePath:'/images/card-AceSpades.png'}
           ]

           const aceId = 4

           const cardBackImgPath = '/images/card-back-blue.png'

          

           let cards = []

           const playGameButtonElem = document.getElementById('playGame')

            const cardContainerElem = document.querySelector('.card-container')

           const colllapsedGridAreaTemplate = ' "a a" "a a"'
           const cardCollectCellClass = ".card-pos-a"

           const numCards = cardObjectDefinition.length


           let cardPositions = []


           let gameInProgress = false
           let shufflingInProgress = false
           let cardsRevealead = false


           const currentGameStatusElem = document.querySelector('.current-status')
           const scoreContainerElem = document.querySelector('.header-score-container')
           const scoreElem = document.querySelector('.score')
           const roundContainerElem = document.querySelector('.header-round-container')
           const roundElem = document.querySelector('.round')



           const winColor = "green"
           const loseColor = "red"
           const parimaryColor = "black"


           let roundNum = 0
           let maxRound = 4
           let score = 0




           


          loadGame()

          function gameOver()
          {
            updateStatusElement(scoreContainerElem, "none")
            updateStatusElement(scoreContainerElem, "none")

            const gameOverMessage = `Game Over! Final Score  - <span class= 'badge'>${score}</span>
                                    Click 'Play Game' button to play again`

            updateStatusElement(currentGameStatusElem, "block", parimaryColor, gameOverMessage)
            
            gameInProgress = false
            playGameButtonElem.disabled = false
          }

          function endRound()
          {
            setTimeout(() => {
                if(roundNum == maxRound){
                    gameOver()
                    return
                }
                else
                {
                    startRound()
                }
            },3000)
          }

          function chooseCard(card)
          {
            if(canChooseCard())
            {
                evaluateCardChoice(card)
                flipCard(card,false)

                setTimeout(() => {
                    flipCards(false)
                    updateStatusElement(currentGameStatusElem, "block", parimaryColor, "Card Positions revealed")

                    endRound()



                },3000)
                cardsRevealead = true
            }
            
          }


          function calculateScoreToAdd(roundNum)
          {
            if(roundNum == 1)
            {
                return 100
            }
            else if (roundNum == 2)
            {
                return 50
            }
             else if (roundNum == 3)
            {
                return 25
            }
             else 
            {
                return 10
            }
          }

          function calculateScore()
          {
            const scoreToAdd = calculateScoreToAdd(roundNum)
            score = score+ scoreToAdd
          }

          function updateScore()
          {
            calculateScore()
            updateStatusElement(scoreElem, "block", parimaryColor, ` <span class = 'badge'>${score}</span>`)
          }

          function updateStatusElement(elem, display, color, innerHtml)
          {
            elem.style.display = display
            if(arguments.length > 2)
            {
                elem.style.color = color
                elem.innerHtml = innerHtml
            }

          }

          function  outputChoiceFeedBack(hit)
          {
            if(hit)
            {
                updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)")
            }
            else
             {
                updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(")
            }
          }


          function evaluateCardChoice(card)
          {
            if(card.id == aceId)
            {
                updateScore()
                outputChoiceFeedBack(true)
            }
            else
            {
                outputChoiceFeedBack(false)
            }
          }


          function canChooseCard()
          {
            return gameInProgress == true && !shufflingInProgress && !cardsRevealead
          }
          

           function loadGame(){
            createCards()

            cards = document.querySelectorAll('.card')

            playGameButtonElem.addEventListener('click', ()=>startGame())

            updateStatusElement(scoreContainerElem, "none")
            updateStatusElement(roundContainerElem, "none")


           }

           function startGame(){
            initializeNewGame()
            startRound()
           }

           function initializeNewGame()
           {
            score = 0
            roundNum = 0

            shufflingInProgress = false

            updateStatusElement(scoreContainerElem,"flex")
            updateStatusElement(roundContainerElem,"flex")

            updateStatusElement(scoreElem,"block",parimaryColor, `Score <span class='badge'>${score}</span>`)
            updateStatusElement(scoreElem,"block",parimaryColor, `Round <span class='badge'>${roundNum}</span>`)
            

           }


           function startRound(){
            initializeNewRound()
            collectCards()
           flipCards(true)
            shuffleCards()
           }

           function initializeNewRound()
           {
            roundNum++
            playGameButtonElem.disabled = true

            gameInProgress = true
            shufflingInProgress = true
            cardsRevealead = false


            updateStatusElement(currentGameStatusElem, "block", parimaryColor, "Shuffling...")

            updateStatusElement(roundElem, "block", parimaryColor, `Round <span class='badge'>${roundNum}</span>`)
           }


            function collectCards(){
                transformGridArea(colllapsedGridAreaTemplate)
                addCardsToGridAreaCell(cardCollectCellClass)
            }

            function transformGridArea(areas){
                cardContainerElem.computedStyleMap.gridTemplateAreas = areas
            }

            function addCardsToGridAreaCell(cellPositionClassName){
                const cellPositionElem = document.querySelector(cellPositionClassName)
                cards.forEach((card, index) =>{
                    addChildElement(cellPositionElem, card)
                }) 
            }

            function flipCard(card, flipToBack){

                const innerCardElem = card.firstchild

                if(flipToBack &&  ! innerCardElem.classList.contains('flip-it'))
                {
                    innerCardElem.classList.add('flip-it')
                }
                else if (innerCardElem.classList.contains('flip-it'))
                {
                    innerCardElem.classList.remove('flip-it')
                }

            }

            function flipCards(flipToBack){
                cards.forEach((card, index) =>{
                    setTimeout(() => {
                        flipCard(card,flipToBack)
                    }, index * 100)
                })
            }

            function shuffleCards(){
                const id = setInterval(shuffle, 12)
                let shuffleCount = 0
                
                function shuffle()
                {

                    randomizeCardPositions()

                    if(shuffleCount == 500)
                    {
                        clearInterval(id)
                        shufflingInProgress = false
                        dealCards()
                        updateStatusElement(currentGameStatusElem, "block", parimaryColor, "Please click the card that you think is yhe Ace of Spades...")
                    }
                    else{
                        shuffleCount++;
                    }
                }

            }

            function randomizeCardPositions(){

                const random1 = Math.floor(Math.random() * numCards) + 1
                const random2 = Math.floor(Math.random() * numCards) + 1
                

                const temp = cardPositions[random1 - 1]
                
                cardPositions[random1 - 1] = cardPositions[random2 - 1]
                cardPositions[random2 - 1] = temp

            }

            function dealCards(){
                addCardsToAppropriateCell()
                const areaTemplate = returnGridAreaMappedToCardPos()

                transformGridArea(areaTemplate)
            }


            function returnGridAreaMappedToCardPos(){

                let firstPart = ""
                let secondPart = ""
                let areas = ""

                cards.forEach((card, index) => {
                    if(cardPositions(index) == 1)
                    {
                        areas = areas + "a"
                    }
                    else if (cardPositions(index) == 2)
                    {
                        areas = areas + "b"
                    }
                      else if (cardPositions(index) == 3)
                    {
                        areas = areas + "c"
                    }
                      else if (cardPositions(index) == 4)
                    {
                        areas = areas + "d"
                    }
                    if (index == 1)
                    {
                        firstPart = areas.substring(0, areas.length - 1)
                        areas = "";
                    }
                    else if (index == 3) 
                    {
                        secondPart = areas.substring(0, areas.length - 1)
                    }
                    return `"${firstPart}" "${secondPart}"`
                 })
            }

            function addCardsToAppropriateCell(){
                cards.forEach((card) =>{
                    addCardToGridCell(card)
                })
            }
          

           function createCards()
           {
            cardObjectDefinition.forEach((cardItem) => {
                createCard(cardItem)
            })
           }

           function createCard(cardItem) {


            //create div element that make up a card
            const cardElem = createElement('div')
            const cardInnerElem = createElement('div')
            const cardFrontElem = createElement('div')
            const cardBackElem = createElement('div')

            //create front and back image elements for a card
            const cardFrontImg = createElement('img')
            const cardBackImg = createElement('img')



           //add class and id to card element
            addClassToElement(cardElem, 'card')
            addIdToElement(cardElem, cardItem.id)


            //add class to inner card element
            addClassToElement(cardInnerElem, 'card-inner')

            //add class to front card element
            addClassToElement(cardFrontElem, 'card-front')

            //add class to back card element
            addClassToElement(cardBackElem, 'card-back')

            //add src attribute and appropriate value to img element - back of card
            addSrcToImageElem(cardBackImg, cardBackImgPath)

            //add src attribute and appropriate value to img element - front of card
            addSrcToImageElem(cardFrontImg, cardItem.imagePath)

            //assign class to back image element of back of card
            addClassToElement(cardBackImg, 'card-img')

            //assign class to front image element of front of card
            addClassToElement(cardFrontImg, 'card-img')

           
            //add front image element as child element to front card element
            addChildElement(cardFrontElem, cardFrontImg)


            //add back image element as child element to back card element
            addChildElement(cardBackElem, cardBackImg)

            //add front card element as child element to inner card element
            addChildElement(cardInnerElem, cardFrontElem)

            //add back card element as child element to inner card element
            addChildElement(cardInnerElem, cardBackElem)

            //add inner card element as child element to card element
            addChildElement(cardElem, cardInnerElem)

            //add card element as child element to appropriate grid cell
            addCardToGridCell(cardElem)

            initializeCardPositions(cardElem)

            attachClickEventHandlerToCard(cardElem)



           }

           function attachClickEventHandlerToCard(card){
            card.addEventListener('click', () => chooseCard(card))
           }

           function initializeCardPositions(card){
            cardPositions.push(card.id)
           }


           function createElement(elemType){
            return document.createElement(elemType)
           }

           function addClassToElement(elem, className){
            elem.classList.add(className)
            
           }


           function addIdToElement(elem, id){
            elem.id = id
           }


           function addSrcToImageElem(imgElem, src){
            imgElem.src = src
           }


           function addChildElement(parentElem, childElem){
            parentElem.appendChild(childElem)
           }


           function addCardToGridCell(card){

            const cardPositionClassName = mapCardIdToGridCell(card)

            const cardPosElem = document.querySelector(cardPositionClassName)

            addChildElement(cardPosElem, card)

           }

           function mapCardIdToGridCell(card){
            if(card.id == 1) 
            {
                return '.card-pos-a'
            }
            else if(card.id == 2)
            {
               return '.card-pos-b'
            }
             else if(card.id == 3)
            {
               return '.card-pos-c'  
            }
            else if(card.id == 4)
            {
               return '.card-pos-d' 
            }
           }

           
