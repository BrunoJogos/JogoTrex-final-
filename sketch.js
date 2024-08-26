var PLAY = 1
var END = 0
var gameState = PLAY
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudGroup, cloudImage;
var cactusGroup, obs1,obs2,obs3,obs4,obs5,obs6;
var score = 0
var restart, restartImage
var gameOver, gameOverImage
var jumpSound, dieSound, checkpointSound


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  cloudImage = loadImage("cloud.png")

  groundImage = loadImage("ground2.png")

  obs1 = loadImage("obstacle1.png")
  obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obstacle3.png")
  obs4 = loadImage("obstacle4.png")
  obs5 = loadImage("obstacle5.png")
  obs6 = loadImage("obstacle6.png")

  restartImage = loadImage("restart.png")
  gameOverImage = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkPoint.mp3")
}

function setup() {
  //tela
  //          L:600 A:200
  createCanvas(windowWidth, windowHeight);

  //criar um sprite trex
  trex = createSprite(width/6-50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;
    
  //criar um sprite ground (chão)
  ground = createSprite(width/3,height-20,width-200,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  invisibleGround = createSprite(width/3,height-10,width-200,10)
  invisibleGround.visible = false

  restart = createSprite(width/2,height/2+60)
  restart.addImage("restart",restartImage)
  restart.scale = 0.5

  gameOver = createSprite(width/2,height/2)
  gameOver.addImage("gameOver",gameOverImage)
  gameOver.scale = 0.5

  //grupo de nuvens
  cloudGroup = new Group()
  //grupo de cactus
  cactusGroup = new Group()

  //raio de colisão
  trex.setCollider("circle",0,0,40)
  trex.debug = false
  //IA{
  //trex.setCollider("rectangle",0,0,trex.width + 100,trex.height)
  //trex.debug = false        
  //}
}
        
function draw() {
  background(180);

  text("pontuação:" + score,width-100,50)
  
  //console.log(frameCount)

  //verificar GameState
  if(gameState === PLAY){

    //ground
   ground.velocityX = -(4+score/100)
   if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

   //score
   score = score + Math.round(getFrameRate() / 60)
    if(score > 0 && score % 200 === 0){
      checkpointSound.play()
    }

   //pular quando a barra de espaço for pressionada
    if (touches.lenght>0||keyDown("space") && trex.y > height-40) {
      trex.velocityY = -14.5;
      jumpSound.play()
      touches = []
    }

    //gravidade
    trex.velocityY = trex.velocityY + 0.8

    //Nuvens
    spawnClouds()

    //obstaculos
    spawnObstacles()

    if(trex.isTouching(cactusGroup)){
      //trex.velocityY = -14.5
      //jumpSound.play()
      gameState = END
      dieSound.play()
    }

    restart.visible = false
    gameOver.visible = false

  }
  else if (gameState === END){
    ground.velocityX = 0

    cactusGroup.setVelocityXEach(0)
    cactusGroup.setLifetimeEach(-1)

    cloudGroup.setVelocityXEach(0)
    cloudGroup.setLifetimeEach(-1)

    trex.changeAnimation("collided", trex_collided)
    trex.velocityY = 0

    restart.visible = true
    gameOver.visible = true

    if(touches.lenght>0||mousePressedOver(restart)){
      reset()
      touches = []
    }

  }

  //collide
  trex.collide(invisibleGround);
  drawSprites();
}
function spawnClouds(){
  if(frameCount % 60 === 0){
    var clouds = createSprite(width,height-100,40,10)
    clouds.addImage("cloud",cloudImage)
    clouds.scale = 0.15
    clouds.velocityX = -(3+score/100)
    clouds.y = Math.round(random(30,80))
    clouds.depth = trex.depth
    trex.depth ++
    clouds.lifetime = width/3
    console.log("profundidade do trex: " + trex.depth)
    console.log("profundidade das nuvens: " + clouds.depth)
    
    //adicionar grupo de nuvens
    cloudGroup.add(clouds)
 }
  }
function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacles = createSprite(width,height-40,10,40)
    obstacles.velocityX = -(4+score/100)
    obstacles.debug = false
    var numero = Math.round(random(1,6))
    switch(numero){
      case 1:
        obstacles.addImage(obs1)
        obstacles.scale = 0.1 
      break;

      case 2:
        obstacles.addImage(obs2)
        obstacles.scale = 0.1 
      break;

      case 3:
        obstacles.addImage(obs3)
        obstacles.scale = 0.15 
      break;

      case 4:
        obstacles.addImage(obs4)
        obstacles.scale = 0.06 
      break;

      case 5:
        obstacles.addImage(obs5)
        obstacles.scale = 0.06 
      break;

      case 6:
        obstacles.addImage(obs6)
        obstacles.scale = 0.15 
      break;
       
      default:
      break;
    }
    obstacles.lifetime = width/4

    //adcionar grupo de cactus
    cactusGroup.add(obstacles)

  }
}

function reset(){
  gameState = PLAY
  cloudGroup.destroyEach()
  cactusGroup.destroyEach()
  score = 0
  trex.changeAnimation("running", trex_running)
}
  