class Scene extends GuaScene{
  constructor(game) {
    super(game)
    this.paddle = Paddle(game)
    this.ball = Ball(game)
    this.score = 0
    this.blocks = loadLevel(game, 1)
    this.enableDrag=false
    var self=this
    game.registerAction('a', function(){
        self.paddle.moveLeft()
    })
    game.registerAction('d', function(){
        self.paddle.moveRight()
    })
    game.registerAction('f', function(){
        self.ball.fire()
    })
    game.canvas.addEventListener('mousedown', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        log(x, y, event)
        // 检查是否点中了 ball
        if (self.ball.hasPoint(x, y)) {
            // 设置拖拽状态
            self.enableDrag = true
        }
    })
    game.canvas.addEventListener('mousemove', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        // log(x, y, 'move')
        if (self.enableDrag) {
            log(x, y, 'drag')
            self.ball.x = x
            self.ball.y = y
        }
    })
    game.canvas.addEventListener('mouseup', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        log(x, y, 'up')
        self.enableDrag = false
    })
  }
  draw(){
    // draw 背景
    this.game.context.fillStyle = "#554"
    this.game.context.fillRect(0, 0, 400, 300)
    // draw
    this.game.drawImage(this.paddle)
    this.game.drawImage(this.ball)
    // draw blocks
    for (var i = 0; i < this.blocks.length; i++) {
        var block = this.blocks[i]
        if (block.alive) {
            this.game.drawImage(block)
        }
    }
    // draw labels
    this.game.context.fillText('分数: ' + this.score, 10, 290)
  }


  update () {
      if (window.paused) {
          return
      }

      this.ball.move()
      // 判断游戏结束
      if (this.ball.y > this.paddle.y) {
          // 跳转到 游戏结束 的场景
          var end = new SceneEnd(this.game)
          this.game.replaceScene(end)
      }
      // 判断相撞
      if (this.paddle.collide(this.ball)) {
          // 这里应该调用一个 ball.反弹() 来实现
          this.ball.反弹()
      }
      // 判断 ball 和 blocks 相撞
      for (var i = 0; i < this.blocks.length; i++) {
          var block = this.blocks[i]
          if (block.collide(this.ball)) {
              // log('block 相撞')
              block.kill()
              this.ball.反弹()
              // 更新分数
              this.score += 100
          }
      }
  }
}
