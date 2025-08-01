let player;
let customer;
let vipCustomer = null;
let currentDrink = [];
let score = 0;
let time = 60;
let gameStarted = false;
let gameOver = false;
let gameDifficulty = 'normal';

let ingredients = [];
let drinksMade = 0;

let normalModeButton;
let hardModeButton;
let startGameButton;
let tutorialButton;
let backToMenuButton;

let intervalId;

let annoyingCustomer = null;
const ANNOYING_CUSTOMER_SPAWN_CHANCE = 0.2;
const ANNOYING_CUSTOMER_CLICK_THRESHOLD = 10;

const VIP_CUSTOMER_SPAWN_CHANCE = 0.05;

let showTutorialScreen = false;
let difficultySelected = false;

let restartGameButton;
let goToMenuButton;
let clearRankingButton;


let ranking = [];


class Ingredient {
    constructor(name, x, y, size) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = this.getIngredientColor(name);
        this.hoverColor = color(180, 180, 180);
    }

    getIngredientColor(name) {
        switch (name) {
            case "Coffee Bean": return color(139, 69, 19);
            case "Water": return color(173, 216, 230);
            case "Milk": return color(255, 255, 255);
            case "Tea Bag": return color(0, 100, 0);
            case "Lemon": return color(255, 255, 0);
            case "Chocolate": return color(70, 40, 0);
            case "Ice": return color(190, 220, 255);
            default: return color(200, 200, 200);
        }
    }

    show() {
        if (this.isMouseOver()) {
            fill(this.hoverColor);
        } else {
            fill(this.color);
        }
        rect(this.x, this.y, this.size, this.size, 5);

        if (this.name === "Coffee Bean" || this.name === "Chocolate" || this.name === "Tea Bag") {
            fill(255);
        } else {
            fill(0);
        }

        textSize(12);
        textAlign(CENTER, CENTER);
        text(this.name, this.x + this.size / 2, this.y + this.size / 2);
    }

    isMouseOver() {
        return mouseX > this.x && mouseX < this.x + this.size &&
               mouseY > this.y && mouseY < this.y + this.size;
    }
}


class Button {
    constructor(text, x, y, w, h, buttonColor = null, hoverColor = null) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = buttonColor || color(150, 200, 255);
        this.hoverColor = hoverColor || color(120, 170, 225);
    }

    show() {
        if (this.isMouseOver()) {
            fill(this.hoverColor);
        } else {
            fill(this.color);
        }
        drawingContext.shadowOffsetX = 3;
        drawingContext.shadowOffsetY = 3;
        drawingContext.shadowBlur = 8;
        drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
        rect(this.x, this.y, this.w, this.h, 10);
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.text, this.x + this.w / 2, this.y + this.h / 2);
    }

    isMouseOver() {
        return mouseX > this.x && mouseX < this.x + this.w &&
               mouseY > this.y && mouseY < this.y + this.h;
    }
}

class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 70;
        this.w = 50;
        this.h = 50;
        this.speed = 5;
        this.color = color(0, 150, 255);
        this.holdingDrink = false;
        this.currentReadyDrink = null;
    }

    show() {
        fill(this.color);
        rect(this.x - this.w / 2, this.y, this.h, this.h);

        if (this.holdingDrink && this.currentReadyDrink) {
            let drinkColor;
            switch (this.currentReadyDrink.name) {
                case "Coffee": drinkColor = color(100, 50, 0); break;
                case "Latte": drinkColor = color(180, 120, 60); break;
                case "Tea": drinkColor = color(150, 100, 0); break;
                case "Lemonade": drinkColor = color(255, 255, 0); break;
                case "Choco Shake": drinkColor = color(70, 40, 0); break;
                case "Iced Coffee": drinkColor = color(90, 45, 0, 200); break;
                case "Milk Shake": drinkColor = color(230, 230, 255); break;
                default: drinkColor = color(100); break;
            }

            let cupX = this.x;
            let cupY = this.y - 30;
            let cupWidth = 25;
            let cupHeight = 35;
            let liquidHeight = cupHeight * 0.8;

            fill(200);
            stroke(0);
            strokeWeight(1);
            rect(cupX - cupWidth / 2, cupY - cupHeight / 2, cupWidth, cupHeight, 3, 3, 0, 0);

            fill(150);
            rect(cupX - cupWidth / 2, cupY - cupHeight / 2 + cupHeight - 5, cupWidth, 5, 0, 0, 3, 3);

            fill(drinkColor);
            noStroke();
            rect(cupX - cupWidth / 2 + 2, cupY - cupHeight / 2 + cupHeight - liquidHeight, cupWidth - 4, liquidHeight - 3);

            if (this.currentReadyDrink.name === "Iced Coffee" || this.currentReadyDrink.name === "Lemonade" || this.currentReadyDrink.name === "Milk Shake") {
                fill(220, 240, 255, 180);
                let iceSize = cupWidth * 0.3;
                ellipse(cupX - cupWidth / 2 + 5, cupY - cupHeight / 2 + cupHeight - liquidHeight + 5, iceSize, iceSize);
                ellipse(cupX + cupWidth / 2 - 5, cupY - cupHeight / 2 + cupHeight - liquidHeight + 10, iceSize * 0.8, iceSize * 0.8);
                ellipse(cupX - cupWidth / 2 + 10, cupY - cupHeight / 2 + cupHeight - liquidHeight + 15, iceSize * 0.9, iceSize * 0.9);
            }

            fill(0);
            textSize(9);
            textAlign(CENTER, CENTER);
            text(this.currentReadyDrink.name, cupX, cupY - cupHeight / 2 - 5);
        }
    }

    move() {
        this.x = mouseX;
        this.x = constrain(this.x, this.w / 2, width - this.w / 2);
    }
}

// 손님 클래스
class Customer {
    constructor() {
        this.x = width - 80;
        this.y = height * 0.7 - 20;
        this.w = 40;
        this.h = 40;
        this.color = color(100, 100, 100);
        this.order = this.generateOrder();
        this.orderDisplayTime = frameCount;

        const basePatience = 60 * 10;

        let patienceReductionPerDrink = 0;
        let minPatience = 0;

        if (gameDifficulty === 'normal') {
            patienceReductionPerDrink = 60 * 0.4;
            minPatience = 60 * 3;
        } else {
            minPatience = 60 * 2;
            const midGameThreshold = 10;
            const lateGameThreshold = 25;

            if (drinksMade >= lateGameThreshold) {
                patienceReductionPerDrink = 60 * 0.8;
            } else if (drinksMade >= midGameThreshold) {
                patienceReductionPerDrink = 60 * 0.6;
            } else {
                patienceReductionPerDrink = 60 * 0.4;
            }
        }

        this.patience = max(minPatience, basePatience - (drinksMade * patienceReductionPerDrink));
    }

    show() {
        fill(this.color);
        ellipse(this.x, this.y, this.w, this.h);

        if (this.order) {
            fill(255);
            stroke(0);
            rect(this.x - 120, this.y - 50, 100, 40, 5);
            triangle(this.x - 20, this.y - 10, this.x - 30, this.y - 10, this.x - 25, this.y - 20);

            fill(0);
            textSize(12);
            textAlign(LEFT, TOP);
            text(this.order.name, this.x - 115, this.y - 40);
        }

        if (this.order) {
            let elapsedTime = frameCount - this.orderDisplayTime;
            let remainingPatience = max(0, this.patience - elapsedTime);
            let patienceRatio = remainingPatience / this.patience;

            let barWidth = 50;
            let barHeight = 8;
            let barX = this.x - barWidth / 2;
            let barY = this.y - this.h / 2 - barHeight - 10;

            fill(150);
            noStroke();
            rect(barX, barY, barWidth, barHeight, 2);

            let barColor = lerpColor(color(255, 0, 0), color(0, 255, 0), patienceRatio);
            fill(barColor);
            rect(barX, barY, barWidth * patienceRatio, barHeight, 2);
        }
    }

    generateOrder() {
        let drinks = [
            { name: "Coffee", ingredients: ["Coffee Bean", "Water"] },
            { name: "Latte", ingredients: ["Coffee Bean", "Milk"] },
            { name: "Tea", ingredients: ["Tea Bag", "Water"] },
            { name: "Lemonade", ingredients: ["Lemon", "Water", "Ice"] },
            { name: "Choco Shake", ingredients: ["Chocolate", "Milk", "Ice"] },
            { name: "Iced Coffee", ingredients: ["Coffee Bean", "Water", "Ice"] },
            { name: "Milk Shake", ingredients: ["Ice", "Milk"] }
        ];
        return random(drinks);
    }

    canBeServed(servedDrink) {
        if (!this.order || !servedDrink) return false;

        const distanceX = abs(player.x - this.x);
        const distanceY = abs(player.y - (this.y + this.h / 2));

        return servedDrink.name === this.order.name &&
               distanceX < 50 &&
               distanceY < 100;
    }

    receiveDrink() {
        this.order = null;
        return true;
    }
}

// 진상 손님 클래스
class AnnoyingCustomer extends Customer {
    constructor() {
        super();
        this.color = color(255, 0, 0);
        this.order = null;
        this.w = 50;
        this.h = 50;
        this.clicksNeeded = ANNOYING_CUSTOMER_CLICK_THRESHOLD;
        this.clicksMade = 0;
        this.x = width - 80;
        this.y = height * 0.7 - 20;
        this.patience = 60 * 5;
    }

    show() {
        fill(this.color);
        ellipse(this.x, this.y, this.w, this.h);

        fill(255);
        textSize(14);
        textAlign(CENTER, CENTER);
        text("Annoying!", this.x, this.y - this.h/2 - 20);

        fill(0);
        textSize(16);
        text(`${this.clicksMade}/${this.clicksNeeded}`, this.x, this.y + this.h/2 + 15);
    }

    canBeServed(servedDrink) {
        return false;
    }

    receiveDrink() {}

    isMouseOver() {
        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < this.w / 2;
    }
}

// VIP 손님 클래스
class VIPCustomer extends Customer {
    constructor() {
        super();
        this.color = color(150, 0, 200);
        this.w = 45;
        this.h = 45;
        this.patience = 60 * 30;
        this.drinksToReceive = 3;
        this.drinksReceived = 0;
        this.order = this.generateOrder();
        this.orderDisplayTime = frameCount;
    }

    show() {
        fill(this.color);
        ellipse(this.x, this.y, this.w, this.h);

        if (this.order) {
            fill(255, 255, 150);
            stroke(0);
            rect(this.x - 120, this.y - 50, 100, 40, 5);
            triangle(this.x - 20, this.y - 10, this.x - 30, this.y - 10, this.x - 25, this.y - 20);

            fill(0);
            textSize(12);
            textAlign(LEFT, TOP);
            text(`VIP: ${this.order.name}`, this.x - 115, this.y - 40);
            textSize(10);
            text(`(${this.drinksReceived + 1}/${this.drinksToReceive})`, this.x - 115, this.y - 30);
        }

        if (this.order) {
            let elapsedTime = frameCount - this.orderDisplayTime;
            let remainingPatience = max(0, this.patience - elapsedTime);
            let patienceRatio = remainingPatience / this.patience;

            let barWidth = 50;
            let barHeight = 8;
            let barX = this.x - barWidth / 2;
            let barY = this.y - this.h / 2 - barHeight - 10;

            fill(150);
            noStroke();
            rect(barX, barY, barWidth, barHeight, 2);

            let barColor = lerpColor(color(255, 0, 0), color(0, 255, 0), patienceRatio);
            fill(barColor);
            rect(barX, barY, barWidth * patienceRatio, barHeight, 2);
        }
    }

    receiveDrink() {
        this.drinksReceived++;
        console.log(`VIP customer received drink ${this.drinksReceived}/${this.drinksToReceive}`);
        if (this.drinksReceived < this.drinksToReceive) {
            this.order = this.generateOrder();
            this.orderDisplayTime = frameCount;
            return false;
        } else {
            this.order = null;
            return true;
        }
    }
}

let resetButtonPos = { x: 50, y: 440, width: 40, height: 50 };

const drinkRecipes = [
    { name: "Coffee", ingredients: ["Coffee Bean", "Water"] },
    { name: "Latte", ingredients: ["Coffee Bean", "Milk"] },
    { name: "Tea", ingredients: ["Tea Bag", "Water"] },
    { name: "Lemonade", ingredients: ["Lemon", "Water", "Ice"] },
    { name: "Choco Shake", ingredients: ["Chocolate", "Milk", "Ice"] },
    { name: "Iced Coffee", ingredients: ["Coffee Bean", "Water", "Ice"] },
    { name: "Milk Shake", ingredients: ["Ice", "Milk"] }
];


function setup() {
    createCanvas(600, 500);
    player = new Player();

    let ingSize = 60;
    let ingStartX = 50;
    let ingStartY = height - 150;
    let ingSpacing = 10;

    ingredients.push(new Ingredient("Coffee Bean", ingStartX, ingStartY, ingSize));
    ingredients.push(new Ingredient("Water", ingStartX + ingSize + ingSpacing, ingStartY, ingSize));
    ingredients.push(new Ingredient("Milk", ingStartX + (ingSize + ingSpacing) * 2, ingStartY, ingSize));
    ingredients.push(new Ingredient("Tea Bag", ingStartX + (ingSize + ingSpacing) * 3, ingStartY, ingSize));

    let ingStartY2 = ingStartY - ingSize - ingSpacing;
    ingredients.push(new Ingredient("Lemon", ingStartX, ingStartY2, ingSize));
    ingredients.push(new Ingredient("Chocolate", ingStartX + ingSize + ingSpacing, ingStartY2, ingSize));
    ingredients.push(new Ingredient("Ice", ingStartX + (ingSize + ingSpacing) * 2, ingStartY2, ingSize));

    normalModeButton = new Button("Normal Mode", width / 2 - 100, height / 2 + 20, 200, 50, color(0, 180, 0));
    hardModeButton = new Button("Hard Mode", width / 2 - 100, height / 2 + 90, 200, 50, color(200, 0, 0));
    tutorialButton = new Button("How to Play", width / 2 - 100, height / 2 + 160, 200, 50, color(0, 100, 180));

    // 메뉴로 돌아가기 버튼
    backToMenuButton = new Button("Back to Menu", width / 2 - 100, height - 60, 200, 40, color(100, 100, 100));

    // 랭킹 로드
    loadRanking();

    textAlign(CENTER, CENTER);
    frameRate(60);
}

function draw() {
    if (!gameStarted) {
        if (showTutorialScreen) {
            showTutorialScreenContent();
        } else {
            showStartScreen();
        }
    } else if (gameOver) {
        showGameOverScreen();
    } else {
        // 인게임 로직
        drawCafeBackground();

        player.show();
        player.move();

        for (let ing of ingredients) {
            ing.show();
        }

        drawTrashCanButton();
        if(annoyingCustomer) annoyingCustomer.show();
        else if(vipCustomer) vipCustomer.show();
        else customer.show();

        let currentActiveCustomer = annoyingCustomer || vipCustomer || customer;

        if (currentActiveCustomer && player.holdingDrink && player.currentReadyDrink) {
            if (currentActiveCustomer.canBeServed(player.currentReadyDrink)) {
                let customerLeaves = currentActiveCustomer.receiveDrink();

                if (currentActiveCustomer === vipCustomer) {
                    if (customerLeaves) {
                        score += 100; time += 20;
                        vipCustomer = null;
                        customer = new Customer();
                    }
                } else { // 일반 손님
                    score += 10; drinksMade++; time += 2;
                    customer.order = null;
                    customer.orderDisplayTime = frameCount;
                }

                player.holdingDrink = false;
                player.currentReadyDrink = null;
                currentDrink = [];
            }
        }

        if (!annoyingCustomer && !vipCustomer) {
            if (!customer.order) {
                if (frameCount - customer.orderDisplayTime > 180) {
                    if (random() < VIP_CUSTOMER_SPAWN_CHANCE) {
                        vipCustomer = new VIPCustomer();
                    } else if (gameDifficulty === 'hard' && random() < ANNOYING_CUSTOMER_SPAWN_CHANCE) {
                        annoyingCustomer = new AnnoyingCustomer();
                    } else {
                        customer = new Customer();
                    }
                }
            } else {
                if (frameCount - customer.orderDisplayTime > customer.patience) {
                    customer.order = null;
                    customer.orderDisplayTime = frameCount;
                    if (gameDifficulty === 'hard') {
                        score = max(0, score - 20);
                        time = max(0, time - 5);
                    } else {
                        score = max(0, score - 5);
                    }
                }
            }
        } else if (vipCustomer) {
            if (vipCustomer.order && frameCount - vipCustomer.orderDisplayTime > vipCustomer.patience) {
                vipCustomer = null;
                customer = new Customer();
            }
        }

        fill(0);
        textSize(18);
        textAlign(LEFT, TOP);
        text("Score: " + score, 10, 10);
        text("Time: " + time, width - 100, 10);
    }
}

function showStartScreen() {
    background(230, 210, 190);
    fill(180, 150, 120);
    rect(0, height * 0.7, width, height * 0.3);
    fill(139, 69, 19);
    rect(0, height * 0.6 - 20, width, 40);

    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = 5;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
    fill(100, 60, 20);
    rect(width / 2 - 170, height / 2 - 180, 340, 120, 15);
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    fill(255, 240, 200);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("The Brew Master", width / 2, height / 2 - 130);

    // 커피잔 아이콘
    fill(255);
    ellipse(width / 2 - 110, height / 2 - 130, 40, 40);
    fill(100, 50, 0);
    ellipse(width / 2 - 110, height / 2 - 130, 30, 30);
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(width / 2 - 110 + 20, height / 2 - 130, 20, 20, HALF_PI, PI + HALF_PI);
    noStroke();

    if (!difficultySelected) {
        normalModeButton.show();
        hardModeButton.show();
        tutorialButton.show();
    } else {
        fill(50);
        textSize(24);
        text(`Difficulty: ${gameDifficulty.toUpperCase()}`, width / 2, height / 2 - 20);
        startGameButton.show();
    }
}

function showTutorialScreenContent() {
    background(240, 240, 240);
    fill(50);
    textSize(32);
    textAlign(CENTER, TOP);
    text("How to Play", width / 2, 30);

    textSize(16);
    textAlign(LEFT, TOP);
    let y = 80;
    let lineHeight = 24;
    let sectionSpacing = 20;
    let indent = 20;

    text("🎯 목표: 손님들이 화내기 전에 주문한 음료를 만들어 서빙하세요!", 50, y);
    y += lineHeight * 2;

    text("🕹️ 플레이 방법:", 50, y);
    y += lineHeight;
    text("- 마우스를 움직여 바리스타를 조작합니다.", 50 + indent, y);
    y += lineHeight;
    text("- 재료를 클릭하여 음료를 만듭니다.", 50 + indent, y);
    y += lineHeight;
    text("- 완성된 음료를 들고 손님에게 다가가 서빙합니다.", 50 + indent, y);
    y += lineHeight;
    text("- 쓰레기통을 클릭해 잘못 만든 음료를 버릴 수 있습니다.", 50 + indent, y);
    y += lineHeight + sectionSpacing;

    text("📜 음료 레시피:", 50, y);
    y += lineHeight;
    // 레시피를 2열로 배치하여 공간 확보
    let recipeY = y;
    for (let i = 0; i < drinkRecipes.length; i++) {
        let recipe = drinkRecipes[i];
        let xPos = (i < 4) ? 50 + indent : width / 2 + 10;
        if (i === 4) recipeY = y; // 두 번째 열 시작 시 Y좌표 초기화
       
        text(`- ${recipe.name}: ${recipe.ingredients.join(' + ')}`, xPos, recipeY);
       
        if (i < 3 || i >= 4) {
            recipeY += lineHeight;
        }
    }

    backToMenuButton.show();
}

function drawCafeBackground() {
    background(240, 230, 210);
    fill(160, 100, 50);
    noStroke();
    rect(0, height * 0.7, width, height * 0.3);
    fill(120, 80, 40);
    rect(0, height - 100, width, 100);
    fill(180, 150, 100);
    rect(0, height - 105, width, 5);
    fill(100, 60, 20);
    rect(50, height - 100, 10, 80);
    rect(width - 60, height - 100, 10, 80);
    fill(150, 100, 60);
    rect(width - 150, height * 0.7 - 20, 80, 5);
    fill(100, 60, 20);
    rect(width - 120, height * 0.7 - 20, 5, 20);
    rect(width - 100, height * 0.7 - 20, 5, 20);
    fill(120, 80, 40);
    rect(width / 2 - 100, 80, 200, 10);
    fill(90, 50, 20);
    ellipse(width / 2 - 50, 70, 30, 30);
    fill(70, 40, 10);
    ellipse(width / 2 + 50, 70, 25, 25);
    fill(80);
    rect(200, height - 105 - 40, 40, 40, 5);
    fill(50);
    rect(210, height - 105 - 40 - 10, 20, 10, 2);
    fill(150, 100, 60);
    rect(width - 250, height - 105 - 30, 50, 30, 3);
    fill(255);
    rect(width - 245, height - 105 - 25, 40, 20, 2);
    let menuBoardX = 20, menuBoardY = 150, menuBoardW = 150, menuBoardH = 100;
    fill(120, 80, 40);
    rect(menuBoardX, menuBoardY, menuBoardW, menuBoardH, 8);
    fill(255);
    textSize(18);
    textAlign(CENTER, TOP);
    text("Now Making", menuBoardX + menuBoardW / 2, menuBoardY + 10);
    textSize(14);
    textAlign(LEFT, TOP);
    fill(255);
    if (player.holdingDrink && player.currentReadyDrink) {
        text(" > " + player.currentReadyDrink.name + " (Ready!)", menuBoardX + 10, menuBoardY + 40);
    } else {
        if (currentDrink.length === 0) {
            text(" - No Ingredients", menuBoardX + 10, menuBoardY + 40);
        } else {
            let yOffset = 40;
            for (let i = 0; i < currentDrink.length; i++) {
                text(" - " + currentDrink[i], menuBoardX + 10, menuBoardY + yOffset + (i * 18));
            }
        }
    }
}

function drawTrashCanButton() {
    let x = resetButtonPos.x, y = resetButtonPos.y, w = resetButtonPos.width, h = resetButtonPos.height;
    fill(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h ? color(180, 180, 180) : color(150, 150, 150));
    stroke(0);
    strokeWeight(1);
    rect(x, y + h * 0.2, w, h * 0.8, 5);
    rect(x - w * 0.1, y, w * 1.2, h * 0.2, 5, 5, 0, 0);
    stroke(50);
    line(x + w * 0.3, y + h * 0.4, x + w * 0.3, y + h * 0.9);
    line(x + w * 0.5, y + h * 0.4, x + w * 0.5, y + h * 0.9);
    line(x + w * 0.7, y + h * 0.4, x + w * 0.7, y + h * 0.9);
}

function decreaseTime() {
    if (gameStarted && !gameOver) {
        time--;
        if (time <= 0) {
            time = 0;
            gameOver = true;
            saveRanking(score);
            clearInterval(intervalId);
        }
    }
}

function startGame(difficulty) {
    gameDifficulty = difficulty;
    gameStarted = true;
    gameOver = false;
    score = 0;
    time = 60;
    drinksMade = 0;
    customer = new Customer();
    customer.order = null;
    customer.orderDisplayTime = frameCount - 180;
    annoyingCustomer = null;
    vipCustomer = null;
    player.holdingDrink = false;
    player.currentReadyDrink = null;
    currentDrink = [];
    clearInterval(intervalId);
    intervalId = setInterval(decreaseTime, 1000);
    difficultySelected = false;
}

function restartGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    time = 60;
    drinksMade = 0;
    customer = new Customer();
    customer.order = null;
    customer.orderDisplayTime = frameCount - 180;
    annoyingCustomer = null;
    vipCustomer = null;
    player.holdingDrink = false;
    player.currentReadyDrink = null;
    currentDrink = [];
    clearInterval(intervalId);
    intervalId = setInterval(decreaseTime, 1000);
}


function goToMainMenu() {
    gameStarted = false;
    gameOver = false;
    showTutorialScreen = false;
    difficultySelected = false;
    clearInterval(intervalId);
}

function makeDrink(ingredientsList) {
   
    const sortedIngredients = [...ingredientsList].sort();
   
    for (let recipe of drinkRecipes) {
        const sortedRecipeIngredients = [...recipe.ingredients].sort();
       
        if (sortedIngredients.length === sortedRecipeIngredients.length &&
            sortedIngredients.every((ing, index) => ing === sortedRecipeIngredients[index])) {
            return recipe;
        }
    }
    return null;
}

function saveRanking(finalScore) {
    let now = new Date();
    let formattedDate = `${now.getFullYear()}.${nf(now.getMonth() + 1, 2)}.${nf(now.getDate(), 2)} ${nf(now.getHours(), 2)}:${nf(now.getMinutes(), 2)}`;
   
    ranking.push({ score: finalScore, difficulty: gameDifficulty, date: formattedDate });
    ranking.sort((a, b) => b.score - a.score);

   
    if (ranking.length > 5) {
        ranking = ranking.slice(0, 5);
    }
   
    localStorage.setItem('brewMasterRanking', JSON.stringify(ranking));
    console.log("Ranking saved:", ranking);
}

function loadRanking() {
    let storedRanking = localStorage.getItem('brewMasterRanking');
    if (storedRanking) {
        ranking = JSON.parse(storedRanking);
        console.log("Ranking loaded:", ranking);
    } else {
        ranking = [];
    }
}

function clearRanking() {
    localStorage.removeItem('brewMasterRanking');
    ranking = [];
    console.log("Ranking cleared.");
}


function showGameOverScreen() {
    background(50, 50, 50, 220);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER!", width / 2, height / 2 - 150);

    textSize(36);
    text(`Your Score: ${score}`, width / 2, height / 2 - 90);

   
    fill(255, 255, 100);
    textSize(24);
    text("--- RANKING ---", width / 2, height / 2 - 30);
    textSize(20);
    textAlign(LEFT, TOP);
    let rankY = height / 2 + 10;
    if (ranking.length === 0) {
        fill(200);
        textAlign(CENTER, TOP);
        text("No Ranking Yet!", width / 2, rankY);
    } else {
        for (let i = 0; i < ranking.length; i++) {
            let r = ranking[i];
            text(`${i + 1}. ${r.score} pts (${r.difficulty.toUpperCase()}) - ${r.date}`, width / 2 - 150, rankY + (i * 25));
        }
    }
   
    // 버튼 배치
    restartGameButton = new Button("Restart Game", width / 2 - 100, height - 120, 200, 50, color(0, 150, 0));
    goToMenuButton = new Button("Go to Menu", width / 2 - 100, height - 60, 200, 40, color(100, 100, 100));
    clearRankingButton = new Button("Clear Ranking", width - 150, 10, 140, 30, color(200, 50, 50), color(180, 30, 30));


    restartGameButton.show();
    goToMenuButton.show();
    clearRankingButton.show();
}

function mousePressed() {
    if (!gameStarted) {
        if (showTutorialScreen) {
            if (backToMenuButton.isMouseOver()) {
                showTutorialScreen = false;
                difficultySelected = false;
            }
        } else {
            if (!difficultySelected) {
                if (normalModeButton.isMouseOver()) {
                    gameDifficulty = 'normal';
                    difficultySelected = true;
                    startGameButton = new Button("START GAME", width / 2 - 100, height / 2 + 90, 200, 50, color(50, 200, 50));
                } else if (hardModeButton.isMouseOver()) {
                    gameDifficulty = 'hard';
                    difficultySelected = true;
                    startGameButton = new Button("START GAME", width / 2 - 100, height / 2 + 90, 200, 50, color(50, 200, 50));
                } else if (tutorialButton.isMouseOver()) {
                    showTutorialScreen = true;
                }
            } else {
                if (startGameButton && startGameButton.isMouseOver()) {
                    startGame(gameDifficulty);
                }
            }
        }
    } else if (!gameOver) {
        if (annoyingCustomer && annoyingCustomer.isMouseOver()) {
            annoyingCustomer.clicksMade++;
            if (annoyingCustomer.clicksMade >= annoyingCustomer.clicksNeeded) {
                score += 20; time += 5;
                annoyingCustomer = null;
                customer = new Customer();
                customer.order = null;
                customer.orderDisplayTime = frameCount;
            }
            return;
        }

        let currentActiveCustomer = vipCustomer || (!annoyingCustomer && customer);

        if (!player.holdingDrink && currentActiveCustomer) {
            for (let ing of ingredients) {
                if (ing.isMouseOver()) {
                    currentDrink.push(ing.name);
                    let made = makeDrink(currentDrink);
                    if (made) {
                        player.currentReadyDrink = made;
                        player.holdingDrink = true;
                    }
                    break;
                }
            }
        }

        if (mouseX > resetButtonPos.x && mouseX < resetButtonPos.x + resetButtonPos.width &&
            mouseY > resetButtonPos.y && mouseY < resetButtonPos.y + resetButtonPos.height) {
            currentDrink = [];
            player.holdingDrink = false;
            player.currentReadyDrink = null;
        }
    } else if (gameOver) {
        if (restartGameButton && restartGameButton.isMouseOver()) {
            restartGame();
        } else if (goToMenuButton && goToMenuButton.isMouseOver()) {
            goToMainMenu();
        } else if (clearRankingButton && clearRankingButton.isMouseOver()) {
            clearRanking();
        }
    }
}