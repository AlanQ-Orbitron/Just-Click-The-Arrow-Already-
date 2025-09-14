//screen Size
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

//elements
const clickArrow = document.getElementById("arrow");
const clone_clickArrow = clickArrow.cloneNode(true);
document.body.appendChild(clone_clickArrow);
const maxwell = document.getElementById("maxwell_div");

//audio
const maxwell_loop = document.getElementById("maxwell_loop")
//maxwell_loop.play()

var tick = 0, click = 0;
var velocity;
var cursor_pos_x, cursor_pos_y;

var isJumping;
var isMoving;
var isAlreadyRan = true;
var isAvoidingCursor = true;

var increamentX = 1, increamentY = 1;


//document events
document.addEventListener("mousemove", mouseMove)
clickArrow.addEventListener("click", mb1ClickEventRun)


//60/s ticker
const rtTimer = setInterval(function() {

    if (isAlreadyRan) {
        clickArrow.refresh();
        clone_clickArrow.positionSet(clickArrow.rect.left, clickArrow.rect.top);
        clone_clickArrow.refresh();
        isAlreadyRan = false;
    }

    clickArrow.slideAndMove(0, 0.98);
    clone_clickArrow.slideAndMove(0, 0.98);

    if (isAvoidingCursor) {
        avoidCursor();
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
    if (click < 5) {
        isJumping = true;
        jump();
    } else if (click < 20) {
        isJumping = false;
    }
}

function avoidCursor(){
    clickArrow.refresh();
    var cursorDistance = ((clickArrow.originX - cursor_pos_x) ** 2 + (clickArrow.originY - cursor_pos_y) ** 2) ** 0.5;
    if (cursorDistance <= (((windowWidth ** 2 + windowHeight ** 2) ** 0.5) * 0.05)) {
        clickArrow.angle = Math.atan2((clickArrow.originY - cursor_pos_y), (clickArrow.originX - cursor_pos_x));
        clone_clickArrow.angle = clickArrow.angle;
        clickArrow.slideAndMove(5, 0.98)
        clone_clickArrow.slideAndMove(5, 0.98)
    } else if (cursorDistance <= (((windowWidth ** 2 + windowHeight ** 2) ** 0.5) * 0.1)) {
        clickArrow.angle = Math.atan2((clickArrow.originY - cursor_pos_y), (clickArrow.originX - cursor_pos_x));
        clone_clickArrow.angle = clickArrow.angle;
        clickArrow.slideAndMove(2, 0.98)
        clone_clickArrow.slideAndMove(2, 0.98)
    }
    var cursorDistance = ((clone_clickArrow.originX - cursor_pos_x) ** 2 + (clone_clickArrow.originY - cursor_pos_y) ** 2) ** 0.5;
    if (cursorDistance <= (((windowWidth ** 2 + windowHeight ** 2) ** 0.5) * 0.05)) {
        clone_clickArrow.angle = Math.atan2((clone_clickArrow.originY - cursor_pos_y), (clone_clickArrow.originX - cursor_pos_x));
        clickArrow.angle = clone_clickArrow.angle;
        clickArrow.slideAndMove(5, 0.98)
        clone_clickArrow.slideAndMove(5, 0.98)
    } else if (cursorDistance <= (((windowWidth ** 2 + windowHeight ** 2) ** 0.5) * 0.1)) {
        clone_clickArrow.angle = Math.atan2((clone_clickArrow.originY - cursor_pos_y), (clone_clickArrow.originX - cursor_pos_x));
        clickArrow.angle = clone_clickArrow.angle;
        clickArrow.slideAndMove(2, 0.98)
        clone_clickArrow.slideAndMove(2, 0.98)
    }

}

function DVD(DOM) {
    DOM.refresh();

    if (DOM.rect.left <= 0 || DOM.rect.left + DOM.rect.width >= window.innerWidth) {increamentX *= -1;}
    if (DOM.rect.top <= 0 || DOM.rect.top + DOM.rect.height >= window.innerHeight) {increamentY *= -1;}

    DOM.positionAdd(increamentX, increamentY);
}

//Jumping Sequence
function jump() {
    clickArrow.positionSet(Math.floor(Math.random() * (windowWidth - clickArrow.rect.width)), Math.floor(Math.random() * (windowHeight - clickArrow.rect.height)));
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

// #endregion
