//screen Size
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

//elements
const clickArrow = document.getElementById("arrow");
const clone_clickArrow = clickArrow.cloneNode(true);
document.body.appendChild(clone_clickArrow);
document.body.appendChild(clickArrow); 

class ElementGroup {
    constructor(identity) {
        this.identity = identity
    }

    forEach(callback) {
        this.identity.forEach(callback);
    }
}

const arrowGroup = new ElementGroup([clickArrow, clone_clickArrow]);
arrowGroup.forEach(function(rs) {
    rs.style.position = "absolute";
})

const maxwell = document.getElementById("maxwell_div");



//audio
const maxwell_loop = document.getElementById("maxwell_loop")
maxwell_loop.play()

var tick = 0, click = 0;
var velocity;
var cursor_pos_x, cursor_pos_y;

var isJumping;
var isMoving;
var isAlreadyRan = true;
var isAvoidingCursor = false;

var increamentX = 1, increamentY = 1;

//document events
document.addEventListener("mousemove", mouseMove)
clickArrow.addEventListener("click", mb1ClickEventRun)


//60/s ticker
const rtTimer = setInterval(function() {

    if (isAlreadyRan) {
        clickArrow.refresh();
        clone_clickArrow.refresh();
        clone_clickArrow.positionSet(clickArrow.rect.left, clickArrow.rect.top);
        isAlreadyRan = false;
    }

    arrowGroup.forEach(function(rs) {
        rs.slideAndMove(0, 0.98)
    })

    if (isAvoidingCursor) {
        avoidCursor(clickArrow, arrowGroup);
        avoidCursor(clone_clickArrow, arrowGroup);
    }

    tick = (tick >= 59) ? 0 : tick + 1;
    if (tick % 30 == 0 && isJumping) {
        jump();
    }

    DVD(maxwell);

}, 1000/60);


function mouseMove(event){
    cursor_pos_x = event.clientX;
    cursor_pos_y = event.clientY;
}

function mb1ClickEventRun(){
    click++;
    if (click < 2) {
        isJumping = true;
        jump();
    } else if (click < 5) {
        jump();
        isAvoidingCursor = false
    } else if (click < 20) {
        isJumping = false;
    }
}

function avoidCursor(DOM, Group){
    DOM.refresh();
    var cursorDistance = ((DOM.originX - cursor_pos_x) ** 2 + (DOM.originY - cursor_pos_y) ** 2) ** 0.5;
    if (cursorDistance <= (((windowWidth ** 2 + windowHeight ** 2) ** 0.5) * 0.01)) {
        DOM.angle = Math.atan2((DOM.originY - cursor_pos_y), (DOM.originX - cursor_pos_x));
        Group.forEach(function(rs) {
            rs.angle = DOM.angle;
            rs.slideAndMove(4, 0.98);
            rs.wrapAround();
        })
    } else if (cursorDistance <= (((windowWidth ** 2 + windowHeight ** 2) ** 0.5) * 0.05)) {
        DOM.angle = Math.atan2((DOM.originY - cursor_pos_y), (DOM.originX - cursor_pos_x));
        Group.forEach(function(rs) {
            rs.angle = DOM.angle;
            rs.slideAndMove(1, 0.98);
            rs.wrapAround();
        })
    }
}

function DVD(DOM) {
    DOM.refresh();

    if (DOM.isScreenBorderTouch("horizontal")) {increamentX *= -1;}
    if (DOM.isScreenBorderTouch("vertical")) {increamentY *= -1;}

    DOM.positionAdd(increamentX, increamentY);
}

//Jumping Sequence
function jump() {
    var x = Math.floor(Math.random() * (windowWidth - clickArrow.rect.width))
    var y = Math.floor(Math.random() * (windowHeight - clickArrow.rect.height))
    arrowGroup.forEach(function(rs) {
        rs.positionSet(x , y);
    })
    
}

// #region helper functions

HTMLElement.prototype.refresh = function() { //refresh the postional data
    this.rect = this.getBoundingClientRect();
    this.sizeX = this.rect.width;
    this.sizeY = this.rect.height;
    this.originX = this.rect.left + (this.sizeX / 2);
    this.originY = this.rect.top + (this.sizeY / 2);
}

HTMLElement.prototype.positionSet = function(x, y) {
    this.style.left = x + "px";
    this.style.top = y + "px";
}

HTMLElement.prototype.originSet = function(x, y) {
    this.style.left = x - this.getBoundingClientRect().width / 2 + "px";
    this.style.top = y - this.getBoundingClientRect().height / 2 + "px";
}

HTMLElement.prototype.positionAdd = function(dx, dy) {
    this.style.left = dx + this.getBoundingClientRect().left + "px";
    this.style.top = dy + this.getBoundingClientRect().top + "px";
}

HTMLElement.prototype.directionAdd = function(magnitude, angle) {
    this.positionAdd(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
}

HTMLElement.prototype.slideAndMove = function(velocity, friction) {
    this.refresh();
    this.velocity = (this.velocity < velocity || this.velocity === undefined) ? velocity : this.velocity;
    this.directionAdd(this.velocity, this.angle);
    this.velocity *= friction;
    if (this.velocity <= 0) {
        this.velocity = 0
        isMoving = false
    }  else if (!this.isMoving) {
        this.isMoving = true
    }
}

HTMLElement.prototype.isScreenBorderTouch = function(type) {
    switch(type) {
        case undefined:
            return this.rect.left < 0 || this.rect.right > window.innerWidth || this.rect.top < 0 || this.rect.bottom > window.innerHeight;
        case "horizontal":
            return this.rect.left < 0 || this.rect.right > window.innerWidth;
        case "left":
            return this.rect.left < 0;
        case "right":
            return this.rect.right > window.innerWidth;
        case "vertical":
            return this.rect.top < 0 || this.rect.bottom > window.innerHeight;
        case "top":
            return this.rect.top < 0;
        case "bottom":
            return this.rect.bottom > window.innerHeight;
    }
}

HTMLElement.prototype.wrapAround = function() {
    this.refresh();
    if (this.isScreenBorderTouch("right")) {
        this.style.left = this.rect.left - window.innerWidth - this.rect.width + "px";
    }
    if (this.isScreenBorderTouch("left")) {
        this.style.left = this.rect.left + window.innerWidth + this.rect.width + "px";
    }
    if (this.isScreenBorderTouch("top")) {
        this.style.top = this.rect.top - window.innerHeight - this.rect.height + "px";
    }
    if (this.isScreenBorderTouch("bottom")) {
        this.style.top = this.rect.top + window.innerHeight + this.rect.height + "px";
    }
}

// #endregion
