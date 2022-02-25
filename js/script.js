function start() {
  $('#inicio').hide()

  $('#fundoGame').append("<div id='player' class='anima1'></div>")
  $('#fundoGame').append("<div id='enemy1' class='anima2'></div>")
  $('#fundoGame').append("<div id='enemy2'></div>")
  $('#fundoGame').append("<div id='friend' class='anima3'></div>")

  var jogo = {}
  var speed = 5
  var positionY = parseInt(Math.random() * 334)

  var canShot = true

  var KEY = {
    W: 87,
    S: 83,
    D: 68
  }

  jogo.keyPress = []

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

  function colision() {
	let colision1 = ($("#player").collision($("#enemy1")));
	

	console.log(colision1);

} 
}

document.getElementById('inicio').addEventListener('click', () => {
  start()
})
