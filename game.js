kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0, 0, 0, 1],
})


loadSprite('coin', './wbKxhcd.png')
loadSprite('evil-shroom', './KPO3fR9.png')
loadSprite('brick', './pogC9x5.png')
loadSprite('block', './M6rwarW.png')
loadSprite('mario', './Wb1qfhK.png')
loadSprite('mushroom', './0wMd92p.png')
loadSprite('surprise', './gesQ1KP.png')
loadSprite('unboxed', './bdrLpi6.png')
loadSprite('pipe-top-left', './ReTPiWY.png')
loadSprite('pipe-top-right', './hj2GK4n.png')
loadSprite('pipe-bottom-left', './c1cYSbt.png')
loadSprite('pipe-bottom-right', './nqQ79eI.png')

loadSprite('blue-block', '/fVscIbn.png')
loadSprite('blue-brick', '/3e5YRQd.png')
loadSprite('blue-steel', '/gqVoI2b.png')
loadSprite('blue-evil-shroom', '/SvV4ueD.png')
loadSprite('blue-surprise', '/RMqCc1G.png')

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '     %   =*=%=                        ',
            '                                      ',
            '                            -+        ',
            '                    ^   ^   ()        ',
            '==============================   =====',
       
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
    }

    const gameLevel = addLevel(map, levelCfg)

     const socoreLabel = add ([
        text('test'),
        pos(30, 6),
        layer('ui'),
        {
            value: 'test',
        }
    ])
    add([text('level ' + 'test', pos(4,6))])

    const player = add([
        sprite('mario'), solid(),
        pos(30,0),
        body(),
        origin('bot')
    ])

})

go("game")