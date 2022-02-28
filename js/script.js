function start() {
  $('#inicio').hide()

  $('#fundoGame').append("<div id='player' class='anima1'></div>")
  $('#fundoGame').append("<div id='enemy1' class='anima2'></div>")
  $('#fundoGame').append("<div id='enemy2'></div>")
  $('#fundoGame').append("<div id='friend' class='anima3'></div>")
  $('#fundoGame').append("<div id='score'></div>")
  $('#fundoGame').append("<div id='energy'></div>")

  var jogo = {}
  var gameOver = false
  var canShot = true
  var speed = 5
  var positionY = parseInt(Math.random() * 334)

  var score = 0
  var savedFriends = 0
  var lostFriends = 0
  var currentEnergy = 3

  var KEY = {
    W: 87,
    S: 83,
    D: 68
  }

  jogo.keyPress = []

  var shotSound = document.getElementById('shotSound')
  var explosionSound = document.getElementById('explosionSound')
  var backgroundSound = document.getElementById('backgroundSound')
  var gameOverSound = document.getElementById('gameOverSound')
  var lostFriendSound = document.getElementById('lostFriendSound')
  var rescueFriendSound = document.getElementById('rescueFriendSound')

  //Música em loop
  backgroundSound.addEventListener(
    'ended',
    function () {
      backgroundSound.currentTime = 0
      backgroundSound.play()
    },
    false
  )
  backgroundSound.play()

  $(document).keydown(function (e) {
    jogo.keyPress[e.which] = true
  })

  $(document).keyup(function (e) {
    jogo.keyPress[e.which] = false
  })

  jogo.timer = setInterval(loop, 30)

  function loop() {
    moveFundo()
    moveJogador()
    moveEnemy1()
    moveEnemy2()
    moveFriend()
    colision()
    scored()
    energyBar()
  }

  function moveFundo() {
    let left = parseInt($('#fundoGame').css('background-position'))
    $('#fundoGame').css('background-position', left - 1)
  }

  function moveJogador() {
    if (jogo.keyPress[KEY.W]) {
      let top = parseInt($('#player').css('top'))
      $('#player').css('top', top - 10)

      if (top <= 0) {
        $('#player').css('top', top + 10)
      }
    }

    if (jogo.keyPress[KEY.S]) {
      let top = parseInt($('#player').css('top'))
      $('#player').css('top', top + 10)

      if (top >= 434) {
        $('#player').css('top', top - 10)
      }
    }

    if (jogo.keyPress[KEY.D]) {
      shot()
    }
  }

  function moveEnemy1() {
    let positionX = parseInt($('#enemy1').css('left'))
    $('#enemy1').css('left', positionX - speed)
    $('#enemy1').css('top', positionY)

    if (positionX <= 0) {
      positionY = parseInt(Math.random() * 334)
      $('#enemy1').css('left', 694)
      $('#enemy1').css('top', positionY)
    }
  }

  function moveEnemy2() {
    let positionX = parseInt($('#enemy2').css('left'))
    $('#enemy2').css('left', positionX - 3)

    if (positionX <= 0) {
      $('#enemy2').css('left', 775)
    }
  }

  function moveFriend() {
    let positionX = parseInt($('#friend').css('left'))
    $('#friend').css('left', positionX + 1)

    if (positionX > 906) {
      $('#friend').css('left', 0)
    }
  }

  function shot() {
    shotSound.play()

    if (canShot === true) {
      canShot = false

      let top = parseInt($('#player').css('top'))
      let positionX = parseInt($('#player').css('left'))
      let shotX = positionX + 190
      let topShot = top + 40
      $('#fundoGame').append("<div id='shot'></div")
      $('#shot').css('top', topShot)
      $('#shot').css('left', shotX)

      var timeShot = window.setInterval(executeShot, 30)
    }

    function executeShot() {
      let positionX = parseInt($('#shot').css('left'))
      $('#shot').css('left', positionX + 15)

      if (positionX > 900) {
        window.clearInterval(timeShot)
        timeShot = null
        $('#shot').remove()
        canShot = true
      }
    }
  }

  function explosion1(enemy1X, enemy1Y) {
    explosionSound.play()

    $('#fundoGame').append("<div id='explosion1'></div")
    $('#explosion1').css('background-image', 'url(imgs/explosao.png)')
    let div = $('#explosion1')
    div.css('top', enemy1Y)
    div.css('left', enemy1X)
    div.animate({ width: 200, opacity: 0 }, 'slow')

    let timeExplosion = window.setInterval(removeExplosion, 1000)

    function removeExplosion() {
      div.remove()
      window.clearInterval(timeExplosion)
      timeExplosion = null
    }
  }

  function colision() {
    let colision1 = $('#player').collision($('#enemy1'))
    let colision2 = $('#player').collision($('#enemy2'))
    let colision3 = $('#shot').collision($('#enemy1'))
    let colision4 = $('#shot').collision($('#enemy2'))
    let colision5 = $('#player').collision($('#friend'))
    let colision6 = $('#enemy2').collision($('#friend'))

    if (colision1.length > 0) {
      currentEnergy--

      let enemy1X = parseInt($('#enemy1').css('left'))
      let enemy1Y = parseInt($('#enemy1').css('top'))
      explosion1(enemy1X, enemy1Y)

      positionY = parseInt(Math.random() * 334)
      $('#enemy1').css('left', 694)
      $('#enemy1').css('top', positionY)
    }

    if (colision2.length > 0) {
      currentEnergy--

      let enemy2X = parseInt($('#enemy2').css('left'))
      let enemy2Y = parseInt($('#enemy2').css('top'))
      explosion2(enemy2X, enemy2Y)

      $('#enemy2').remove()
      repositionEnemy2()
    }

    if (colision3.length > 0) {
      score = score + 100
      speed = speed + 1

      enemy1X = parseInt($('#enemy1').css('left'))
      enemy1Y = parseInt($('#enemy1').css('top'))

      explosion1(enemy1X, enemy1Y)
      $('#shot').css('left', 950)

      positionY = parseInt(Math.random() * 334)
      $('#enemy1').css('left', 694)
      $('#enemy1').css('top', positionY)
    }

    if (colision4.length > 0) {
      score = score + 50

      enemy2X = parseInt($('#enemy2').css('left'))
      enemy2Y = parseInt($('#enemy2').css('top'))
      $('#enemy2').remove()

      explosion2(enemy2X, enemy2Y)
      $('#shot').css('left', 950)

      repositionEnemy2()
    }

    if (colision5.length > 0) {
      savedFriends++
      rescueFriendSound.play()

      repositionFriend()
      $('#friend').remove()
    }

    if (colision6.length > 0) {
      lostFriends++

      friendX = parseInt($('#friend').css('left'))
      friendY = parseInt($('#friend').css('top'))
      explosion3(friendX, friendY)
      $('#friend').remove()

      repositionFriend()
    }
  }

  function repositionEnemy2() {
    var timeColision4 = window.setInterval(reposition4, 5000)

    function reposition4() {
      window.clearInterval(timeColision4)
      timeColision4 = null

      if (gameOver === false) {
        $('#fundoGame').append("<div id='enemy2'></div")
      }
    }
  }

  function repositionFriend() {
    var friendTime = window.setInterval(reposicion6, 6000)

    function reposicion6() {
      window.clearInterval(friendTime)
      friendTime = null

      if (gameOver === false) {
        $('#fundoGame').append("<div id='friend' class='anima3'></div>")
      }
    }
  }

  function explosion2(enemy2X, enemy2Y) {
    explosionSound.play()

    $('#fundoGame').append("<div id='explosion2'></div")
    $('#explosion2').css('background-image', 'url(imgs/explosao.png)')
    var div2 = $('#explosion2')
    div2.css('top', enemy2Y)
    div2.css('left', enemy2X)
    div2.animate({ width: 200, opacity: 0 }, 'slow')

    var timeExplosion2 = window.setInterval(removeExplosion2, 1000)

    function removeExplosion2() {
      div2.remove()
      window.clearInterval(timeExplosion2)
      timeExplosion2 = null
    }
  }

  function explosion3(friendX, friendY) {
    lostFriendSound.play()

    $('#fundoGame').append("<div id='explosion3' class='anima4'></div")
    $('#explosion3').css('top', friendY)
    $('#explosion3').css('left', friendX)

    let explosionTime3 = window.setInterval(resetExplosion3, 1000)

    function resetExplosion3() {
      $('#explosion3').remove()
      window.clearInterval(explosionTime3)
      explosionTime3 = null
    }
  }

  function scored() {
    $('#score').html(
      '<h2> Pontos: ' +
        score +
        ' Amigos Salvos: ' +
        savedFriends +
        ' Amigos Perdidos: ' +
        lostFriends +
        ' </h2>'
    )
  }

  function energyBar() {
    if (currentEnergy === 3) {
      $('#energy').css('background-image', 'url(imgs/energia3.png)')
    }

    if (currentEnergy === 2) {
      $('#energy').css('background-image', 'url(imgs/energia2.png)')
    }

    if (currentEnergy === 1) {
      $('#energy').css('background-image', 'url(imgs/energia1.png)')
    }

    if (currentEnergy === 0) {
      
      $('#energy').css('background-image', 'url(imgs/energia0.png)')

      EndGame()
    }
  }

  function EndGame() {
    gameOver = true;
    backgroundSound.pause();
    gameOverSound.play()
    
    window.clearInterval(jogo.timer);
    jogo.timer = null;
    
    $("#player").remove();
    $("#enemy1").remove();
    $("#enemy2").remove();
    $("#friend").remove();
    
    $("#fundoGame").append("<div id='end'></div>");
    
    $("#end").html("<h1> Game Over </h1><p>Sua pontuação foi: " + score + "</p>" + "<div id='restart' onClick=restartGame()><h3>Jogar Novamente</h3></div>");
    }
}

document.getElementById('inicio').addEventListener('click', () => {
  start()
})

function restartGame() {
	gameOverSound.pause();
	$("#end").remove();
	start()
}