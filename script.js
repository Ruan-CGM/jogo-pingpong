const canvasEl = document.querySelector("canvas"),
canvasCtx = canvasEl.getContext("2d"),
gapX = 10

const mouse = { x: 0, y: 0}

//Objeto campo
const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  drawField: function () {
    //Desenha o campo
    //Define a cor e desenha
    canvasCtx.fillStyle = "#286047"
    canvasCtx.fillRect(0, 0, this.w, this.h)
  }
}

//Objeto linha
const line = {
  w: 15,
  h: field.h,
  drawLine: function() {
    canvasCtx.fillStyle = "#ffffff"

    //Desenha linha central
    // const x = window.innerWidth / 2 - lineWidth / 2
    // const y = 0
    // const largura = lineWidth
    // const altura = window.innerHeight

    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
  }
}

const raqueteEsquerda = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 200,
  _move: function () {
    this.y = mouse.y - this.h / 2
    //Esse this.h / 2, é dividindo a altura da raquete, para o mouse ficar
    //no meio da raquete esquerda
  },
  drawRaqueteEsquerda: function() {
    //Desenha raquete esquerda
    canvasCtx.fillRect(this.x, this.y, this.w, this.h)
   
    this._move()
  }
}

const raqueteDireita = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 200,
  velocidade: 5,
  _move: function () {
    if(this.y + this.h / 2 < bola.y + bola.r) {
      this.y += this.velocidade
    } else {
      this.y -= this.velocidade
    }
  },
  aumentoVelocidade: function () {
    this.velocidade += 1
  },
  drawRaqueteDireita: function() {
    //Desenha raquete direita
    canvasCtx.fillRect(this.x, this.y, this.w, this.h)

    this._move()
  }
}

const placar = {
  humano: 0,
  computador: 0,
  pontuacaoHumano: function () {
    this.humano++
  },
  pontuacaoComputador: function () {
    this.computador++
  },
  drawPlacar: function () {
    //Desenha o placar
    canvasCtx.font = "bold 72px Arial"
    canvasCtx.textAlign = "center"
    canvasCtx.textBaseline = "top"
    canvasCtx.fillStyle = "#01341D"
    canvasCtx.fillText(this.humano, field.w / 4, 50)
    canvasCtx.fillText(
        this.computador,
        field.w / 4 + field.w / 2,
        50
    )
  }
}

const bola = {
  x: field.w / 2, //eixoX da bola
  y: field.h / 2, //eixoY da bola
  r: 20, //raio da bola, tamanho
  velocidade: 5,
  direcaoX: 1,
  direcaoY: 1,
  _calculoDaPosicao: function () {
    //Verificar se o jogador 1 fez um ponto (x > largura do campo)
    if(this.x > field.w - this.r - raqueteDireita.w - gapX) {
      //Verifica se a raquete direita está na posição y da bola
      if(
        this.y + this.r > raqueteDireita.y 
      && this.y - this.r < raqueteDireita.y + raqueteDireita.h
    ) {
        //rebate a bola invertendo o sinal de x
        this._reverteX()
      } else {
        //pontuar o jogador 1
        placar.pontuacaoHumano()
        this._pontuacaoFeita()
      }
    }

    //Verifica se o jogador 2 fez um ponto (x < 0)
    if(this.x < this.r + raqueteEsquerda.w + gapX) {
      //Verifica se a raquete esquerda está na posição y da bola
      if(
        this.y + this.r > raqueteEsquerda.y &&
        this.y - this.r < raqueteEsquerda.y + raqueteEsquerda.h 
      ) {
        //rebate a bola invertendo o sinal de x
        this._reverteX()
      } else {
        //pontuar o jogador 2
        placar.pontuacaoComputador()
        this._pontuacaoFeita()
      }
    }


    //Verifica as laterias superior e inferior do campo
    if(
      (this.y - this.r < 0 && this.direcaoY < 0) ||
      (this.y > field.h - this.r && this.direcaoY > 0)
    ) {
      // No momento que o Y da bolinha, começar a descer, se ela for maior
      //que a altura de campo, vamos inverter. Menos o raio, para a bolinha
      //bater com a superfície e não no meio dela
      //Rebate a bola invertendo o sinal do eixo Y
      this._reverteY()
    }
  },
  _reverteX: function () {
    //1 * -1 = -1
    //-1 * -1 = 1
    this.direcaoX *= -1
  },
  _reverteY: function () {
    //1 * -1 = -1
    //-1 * -1 = 1
    this.direcaoY *= -1
  },
  _aumentoVelocidade: function () {
    this.velocidade += 2
  },
  _pontuacaoFeita: function () {
    this._aumentoVelocidade()
    raqueteDireita.aumentoVelocidade()

    this.x = field.w / 2
    this.y = field.h / 2
    //A bola irá para o meio do campo

  },
  _movimento: function () {
    this.x += this.direcaoX * this.velocidade
    this.y += this.direcaoY * this.velocidade
  },
  drawBola: function () {
    //Desenhando a bolinha
    canvasCtx.fillStyle = "#ffffff"
    canvasCtx.beginPath()
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    canvasCtx.fill()

    this._calculoDaPosicao()
    this._movimento()
  }
}

function setup() {
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h
}

function draw() {
  field.drawField()
  line.drawLine()

  raqueteEsquerda.drawRaqueteEsquerda()
  raqueteDireita.drawRaqueteDireita()

  placar.drawPlacar()

  bola.drawBola()
}


//Suavisando as animações
window.animateFrame = ( function() {
  return(
    window.requestAnimationFrame ||
    window.webkitRequestAnimateFrame ||
    window.mozRequestAnimateFrame ||
    window.oRequestAnimateFrame ||
    window.msRequetAnimateFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60)
    }
  )
})()

function main() {
  animateFrame(main)
  //A função main é um callback, ou seja ela está chamando o callbak do método de cima
  draw()
}

setup()
main()

//evento que ouve o mouse
canvasEl.addEventListener("mousemove", function(e) {
  mouse.x = e.pageX
  mouse.y = e.pageY
})
