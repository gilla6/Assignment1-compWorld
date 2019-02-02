function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.speed = 200;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
    this.x -= this.game.clockTick * this.speed;
    if (this.x < -500) this.x = 0;

};

function Guy(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/LastSurvivor.png"), 256, 1792, 256, 256, 0.5, 7, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/LastSurvivor.png"), 1536, 512 , 256, 256, 0.06, 7, false, false);
     this.slideAnimation = new Animation(ASSET_MANAGER.getAsset("./img/LastSurvivor.png"), 0, 1280 , 256, 256, 0.06, 8, false, false);
    this.jumping = false;
    this.sliding = false;
    this.radius = 100;
    this.ground = 350;
    Entity.call(this, game, 0, 360);
}

Guy.prototype = new Entity();
Guy.prototype.constructor = Guy;

Guy.prototype.update = function () {
    if (this.game.space) this.jumping = true;
     if(this.game.slide) this.sliding  =  true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 100;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
   

      if (this.sliding) {
        if (this.slideAnimation.isDone()) {
            this.slideAnimation.elapsedTime = 0;
            this.sliding = false;
        }
        var slideDistance = this.slideAnimation.elapsedTime / this.slideAnimation.totalTime;
        var totalHeight = 100;

        if (slideDistance > 0.5)
            slideDistance = 1 - slideDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (slideDistance * slideDistance - slideDistance));
        //this.y = this.ground - height;
       
    }



    
    Entity.prototype.update.call(this);
}

Guy.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x+40, this.y - 34);
    }else if(this.sliding){
         this.slideAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};
function Platform(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/platform.png"), 0, 40, 990, 88, 0.090, 12, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/platform.png"), 0, 1195 , 165, 260, 0.06, 8, false, false);
    this.jumping = false;
    this.radius = 100;
    this.ground = 350;
    Entity.call(this, game, 0, 350);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 100;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Platform.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x+40, this.y - 34);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/LastSurvivor.png");
ASSET_MANAGER.queueDownload("./img/background.png");
ASSET_MANAGER.queueDownload("./img/platform.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background.png"));
    var guy = new Guy(gameEngine);
    var plat = new Platform(gameEngine);
    gameEngine.addEntity(plat);
    gameEngine.addEntity(bg);
    gameEngine.addEntity(guy);
 
   
});
