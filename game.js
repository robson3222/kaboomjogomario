kaboom({
    global: true,
    fullscreen: true,
    debug: true,
    scale: 1.9,
    clearColor: [0, 1, 1, 1],
})


const MOVE_SPEED = 160
const JUMP_FORCE = 460
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 400
const ENEMY_SPEED = 20


let isJumping = true
let isBig = false

loadRoot('./')

loadSprite('coin', './wbKxhcd.png')
loadSprite('evil-shroom', './KPO3fR9.png')
loadSprite('brick', './pogC9x5.png')
loadSprite('block', './M6rwarW.png')

loadSprite('mario', './marioImgur.png', {
  sliceX: 3.9,
  anims: {
      idle: {
        from: 0,
        to: 0,
      },
      move: {
        from: 1,
        to: 2
      },
  },
})

loadSprite('mushroom', './0wMd92p.png')
loadSprite('surprise', './gesQ1KP.png')
loadSprite('unboxed', './bdrLpi6.png')
loadSprite('pipe-top-left', './ReTPiWY.png')
loadSprite('pipe-top-right', './hj2GK4n.png')
loadSprite('pipe-bottom-left', './c1cYSbt.png')
loadSprite('pipe-bottom-right', './nqQ79eI.png')

loadSprite('blue-block', './fVscIbn.png')
loadSprite('blue-brick', './3e5YRQd.png')
loadSprite('blue-steel', './gqVoI2b.png')
loadSprite('blue-evil-shroom', './SvV4ueD.png')
loadSprite('blue-surprise', './RMqCc1G.png')

scene("game", ({ level , score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      '                                                                                                                                                      ',
      '                                                                                                                                                      ',
      '                                                                                                                                                      ',
      '                                                                                                                                                      ',
      '                                                                                                                                                      ',
      '     %   =*=%=         =                                                                                                                              ',
      '                      =                                       $$$$$                             $    $         $                                      ',
      '                     =      -+               %          *        $$$$$    *  *        -+    = =  $   $   $       $           %                 -+     ',
      '                    ^   ^   ()                                                        ()                                             ^^^^^^^^  ()     ',
      '==============================   =====================================================================================================================',
    ],
    [
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£        @@@@@@              x x        £',
      '£                          x x x        £',
      '£                        x x x x  x   -+£',
      '£               z   z  x x x x x  x   ()£',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ],
    [
      '£                                              £',
      '£                                              £',
      '£                                              £',
      '£                                              £',
      '£                                              £',
      '£                      x x                     £',
      '£      $$$$$$$                    x x x        £',
      '£      $$$$$$$                  x x x x  x   -+£',
      '£       $$$$$$$        z   z  x x x x x  x   ()£',
      '=========================================@@@@@@@',
    ]
  ]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid()],
    '$': [sprite('coin'), 'coin'],
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
    '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous'],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '£': [sprite('blue-brick'), solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],

  }

  const gameLevel = addLevel(maps[level], levelCfg)

  const scoreLabel = add([
    text('score: '  +score, 10),
    pos(12, 5),
    layer('ui'),
    {
      value: score,
    }
  ])

  add([text('level ' + parseInt(level + 1) ), pos(40, 6)])
  
  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
          timer -= dt()
          if (timer <= 0) {
            this.smallify()
          }
        }
      },
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(1)
        CURRENT_JUMP_FORCE = JUMP_FORCE
        timer = 0
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(2)
        timer = time
        isBig = true     
      }
    }
  }

  const player = add([
    sprite('mario',{
      aninSpeed: 0.1,
      frame: 0
    }),
     solid(),
    pos(60, 0),
    body(),
    big(),
    origin('bot'),
    {
        speed:120,
    }
  ])

  action('mushroom', (m) => {
    m.move(10, 10)
    
  })

  player.on("headbutt", (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
  })

  player.collides('mushroom', (m) => {
    destroy(m)
    player.biggify(6)
  })

  player.collides('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  action('dangerous', (d) => {
    d.move(-ENEMY_SPEED, 0)
  })

  player.collides('dangerous', (d) => {
    if (isJumping) {
      destroy(d)
    } else {
      go("lose", { score: + scoreLabel.value})
    }
  })

  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: + scoreLabel.value})
    }
  })

  player.collides('pipe', () => {
    keyPress('down', () => {
      go('game', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value,
        Big: isBig
      })
    })
  })

  keyDown('left', () => {
    player.flipX(true)
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.flipX(false)
    player.move(MOVE_SPEED, 0)
  })
  
 


//animate
  keyPress('left', () =>{
    player.flipX(true)
    player.play('move')
  })

  keyPress('right', () =>{
    player.flipX(false)
    player.play('move')
  })


keyRelease('left', () => {
  player.play('idle')
})

keyRelease('right', () => {
  player.play('idle')
})


  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})

scene("lose", ({ score }) => {
  add([ text('Aperte enter vc Perdeu, total de moedas: ' +score, 9), origin('center'), pos(width()/2, height()/2)])
  keyPress('enter', () => {
    go("game", {level: 0, score: 0, big: isBig,})
  })
})

go("game", { level: 0, score: 0})