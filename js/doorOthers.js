// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);
    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });
        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);
    // ==== Напишите свой код для открытия второй двери здесь ====
    var currentLevel = 0;
    var levels = 3;
    var confirmButton = this.popup.querySelector('.rules__confirm');
    var rules = this.popup.querySelector('.popup__rules');
    var sign = this.popup.querySelector('.popup__sign');
    var timerSign = this.popup.querySelector('.popup__timer');
    var sentence = this.popup.querySelector('.rules__sentence');
    var number = this.popup.querySelector('.rules__number');
    confirmButton.addEventListener('click', createLevel);
    var arrows = ['up', 'down', 'left', 'right'];
    var currentArrows = [];
    var indexOfCurrentArrows = 0;
    var scanSwipes = false;
    var timerValue = 5;
    //для жестов
    var start = {};
    var end = {};
    var tracking = false;
    var thresholdTime = 500;
    var thresholdDistance = 100;

    function createLevel(){
        rules.classList.add('hidden');
        sign.classList.remove('hidden');
        showArrows();
        function showArrows(){
            clean();
            timerSign.classList.remove('hidden');
            for (var i=0; i<(currentLevel+currentLevel+2); i++){
                var arrow = getRandomArror();
                currentArrows.push(arrow);
                var newdiv = document.createElement('div');
                newdiv.setAttribute('class', 'sign__arrow sign__arrow_pointer_'+arrow);
                sign.appendChild(newdiv);
            }
            startTimer(timerValue, function(){
                sign.classList.add('hidden');
                timerSign.classList.add('hidden');
                scanSwipes = true;
            });

            function getRandomArror(){
                return arrows[Math.floor(Math.random() * 4)];
            }
            function startTimer(duration, callback) {
                var timer = duration;
                var interval = setInterval(function () {
                    timerSign.textContent = timer;
                    if (--timer < 0) {
                        clearInterval(interval);
                        callback();
                    }
                }, 1000);
            }
            function clean(){
                currentArrows = [];
                while (sign.firstChild) {
                    sign.removeChild(sign.firstChild);
                }
            }

        }
    }
    //var o = this.popup.querySelector('.popup__output');
    function gestureStart(e) {
        /* Только для первого пальца*/
        if (e.isPrimary) {
            tracking = true;
            //start.t = new Date().getTime();
            start.t = e.timeStamp;
            start.x = e.clientX;
            start.y = e.clientY;
        } else {
            tracking = false;
        }
    }

    function gestureEnd(e) {
        if (tracking) {
            end.x = e.clientX;
            end.y = e.clientY;
        }
        tracking = false;
        var now = e.timeStamp;
        var deltaTime = now - start.t;
        var deltaX = end.x - start.x;
        var deltaY = end.y - start.y;
        /* Определяем свайп */
        if (deltaTime > thresholdTime) {
            /* Слишком медленный жест */
            return;
        } else {
            if ((deltaX > thresholdDistance)&&(Math.abs(deltaY) < thresholdDistance)) {
                //o.innerHTML = 'swipe right';
                if (scanSwipes) scanSwipe.call(this, 'right');
            } else if ((-deltaX > thresholdDistance)&&(Math.abs(deltaY) < thresholdDistance)) {
                //o.innerHTML = 'swipe left';
                if (scanSwipes) scanSwipe.call(this, 'left');
            } else if ((deltaY > thresholdDistance)&&(Math.abs(deltaX) < thresholdDistance)) {
                //o.innerHTML = 'swipe down';
                if (scanSwipes) scanSwipe.call(this, 'down');
            } else if ((-deltaY > thresholdDistance)&&(Math.abs(deltaX) < thresholdDistance)) {
                //o.innerHTML = 'swipe up';
                if (scanSwipes) scanSwipe.call(this, 'up');
            } else {
                //o.innerHTML = 'nooo';
            }
        }
        function scanSwipe(direction){
            console.log(direction +' : '+currentArrows[indexOfCurrentArrows]);
            if (direction==currentArrows[indexOfCurrentArrows]){
                indexOfCurrentArrows++;
                if (indexOfCurrentArrows==currentArrows.length){
                    currentLevel++;
                    timerValue=timerValue+3;
                    if (currentLevel==levels){
                        this.unlock();
                    }
                    else{
                        showText('Поздравляю! Ты прошел '+(currentLevel)+' уровень. Дальше стрелок больше, но и времени на их запоминание - '+timerValue+' секунд');
                    }
                    indexOfCurrentArrows=0;
                }
            }
            else{
                showText('Ты ошибся, попробуй еще раз!');
                indexOfCurrentArrows=0;
            }
        };
        function showText(text){
            rules.classList.remove('hidden');
            sentence.textContent = text;
            number.textContent = currentLevel+1;
        }
    }

    this.popup.addEventListener('pointerdown', gestureStart.bind(this), false);
    this.popup.addEventListener('pointerup', gestureEnd.bind(this), false);

    // ==== END Напишите свой код для открытия второй двери здесь ====
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);
    // ==== Напишите свой код для открытия третей двери здесь ====

    var picture = this.popup.querySelector('.popup__picture');
    var fingers = [];
    var moveCache = {
        x: 0,
        y: 0
    };
    var prevDiff = -1;
    var scale = 1;
    var minScale = 0.65;
    var transform = {
        scale: '',
        translate: ''
    };
    var confirmButton = this.popup.querySelector('.rules__confirm');
    var rules = this.popup.querySelector('.popup__rules');
    confirmButton.addEventListener('click', init.bind(this));

    function init(){
        picture.classList.remove('hidden');
        rules.classList.add('hidden');
        this.popup.addEventListener('pointerdown', pointerdownHandler.bind(this), false);
        this.popup.addEventListener('pointermove', pointermoveHandler.bind(this), false);
        this.popup.addEventListener('pointerup', pointerupHandler.bind(this), false);
        this.popup.addEventListener('pointercancel', pointerupHandler.bind(this), false);

        this.popup.querySelector('.popup__aim').addEventListener('pointerdown', function(){
            this.unlock();
        }.bind(this));
    }

    function pointerdownHandler(e) {
        // запоминаем пальчики
        fingers.push(e);
        moveCache.event = e;
    }

    function pointermoveHandler(e) {

        // Находим событие в кеше и обновляем его
        for (var i = 0; i < fingers.length; i++) {
            if (e.pointerId == fingers[i].pointerId) {
                fingers[i] = e;
                break;
            }
        }

        // Если пальчика 2, то обрабатываем zoom/pinch
        if (fingers.length == 2) {
            // любимая геометрия =)
            var curDiff = Math.sqrt(Math.pow(fingers[0].clientX - fingers[1].clientX, 2) + Math.pow(fingers[0].clientY - fingers[1].clientY, 2));
            if (prevDiff > 0) {
                if (curDiff > prevDiff) {
                    // увеличение расстояния
                    scale = scale+curDiff/6000;
                    if (scale>minScale) {
                        transform.scale = ' scale(' + scale  + ') ';
                        picture.style.webkitTransform = picture.style.transform = transform.translate + transform.scale;
                    }
                }
                if (curDiff < prevDiff) {
                    // уменьшения расстояния
                    scale = scale-curDiff/6000;
                    if (scale>minScale) {
                        transform.scale = ' scale(' + scale  + ') ';
                        picture.style.webkitTransform = picture.style.transform  = transform.translate + transform.scale;
                    }
                }
            }
            prevDiff = curDiff;
        } //если один пальчик, то обрабатываем перемещения
        else if (fingers.length == 1) {
            transform.translate = ' translate(' + (moveCache.x + fingers[0].clientX - moveCache.event.clientX) + 'px, '
                + (moveCache.y + fingers[0].clientY - moveCache.event.clientY)  + 'px) ';
            picture.style.webkitTransform = picture.style.transform = transform.translate + transform.scale;
        }
    }

    function pointerupHandler(e) {
        //Если пальца два, то очистим список
        if (fingers.length == 2) {
            fingers = [];
        }
        // Если палец один, то запишем координаты для перемещения картинки
        if (fingers.length == 1){
            moveCache.x = moveCache.x + fingers[0].clientX - moveCache.event.clientX;
            moveCache.y = moveCache.y + fingers[0].clientY - moveCache.event.clientY;
        }
        removeFinger(e);
        // Если пальцев меньше 2ух, то не следим за поворотом
        if (fingers.length < 2) {
            prevDiff = -1;
        }
    }

    function removeFinger(e) {
        for (var i = 0; i < fingers.length; i++) {
            if (fingers[i].pointerId == e.pointerId) {
                fingers.splice(i, 1);
                break;
            }
        }
    }

    // ==== END Напишите свой код для открытия третей двери здесь ====
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия сундука здесь ====

    var arrow = this.popup.querySelector('.popup__arrow');
    var fingers = [], cacheFingers = [], cacheMoveFingers = [];
    var moveCache = {
        x: 0,
        y: 0
    };
    var prevDiff = {
        x: 0,
        y: 1
    };
    var y = 0;
    var flag = false;
    var transform = {
        scale: '',
        translate: ''
    };
    var a, b;
    var confirmButton = this.popup.querySelector('.rules__confirm');
    var watches = this.popup.querySelector('.popup__watches');
    var rules = this.popup.querySelector('.popup__rules');
    confirmButton.addEventListener('click', init.bind(this));

    function init(){
        watches.classList.remove('hidden');
        rules.classList.add('hidden');
        this.popup.addEventListener('pointerdown', pointerdownHandler.bind(this), false);
        this.popup.addEventListener('pointermove', pointermoveHandler.bind(this), false);
        this.popup.addEventListener('pointerup', pointerupHandler.bind(this), false);
        this.popup.addEventListener('pointercancel', pointerupHandler.bind(this), false);
    }

    function pointerdownHandler(e) {
        // запоминаем пальчики
        fingers.push(e);
        moveCache.event = e;
        flag = true;
    }

    function pointermoveHandler(e) {
        // Находим событие в кеше и обновляем его
        for (var i = 0; i < fingers.length; i++) {
            if (e.pointerId == fingers[i].pointerId) {
                fingers[i] = e;
                break;
            }
        }

        // Если пальчика 2, то обрабатываем zoom/pinch
        if (fingers.length == 2) {
            // немножко математики
            var curDiff={};
            var obj={};
            var difference = [
                {
                    x:0,y:0
                },
                {
                    x:0,y:0
                }
            ];
            if (flag){
                prevDiff = curDiff;
            }
            if (flag && (cacheFingers.length>0)){
                obj.x = fingers[0].clientX - cacheFingers[0].clientX;
                obj.y = fingers[0].clientY - cacheFingers[0].clientY;
                difference.push(obj);
                obj.x = fingers[1].clientX-cacheFingers[1].clientX;
                obj.y = fingers[1].clientY-cacheFingers[1].clientY;
                difference.push(obj);
                flag = false;
            }
            cacheMoveFingers = fingers;
            fingers[0].clientX = fingers[0].clientX - difference[0].x;
            fingers[0].clientY = fingers[0].clientY - difference[0].y;
            fingers[1].clientX = fingers[1].clientX - difference[1].x;
            fingers[1].clientY = fingers[1].clientY - difference[1].y;
            curDiff.x = fingers[1].clientX - fingers[0].clientX;
            curDiff.y = fingers[1].clientY - fingers[0].clientY;
            if (prevDiff.x!==0 || prevDiff.y!==0 ){
                a = Math.acos(prevDiff.x/Math.sqrt(prevDiff.x*prevDiff.x+prevDiff.y*prevDiff.y));
                b = Math.acos(curDiff.x/Math.sqrt(curDiff.x*curDiff.x+curDiff.y*curDiff.y));
                if ((prevDiff.x <= 0) && (prevDiff.y <=0) && (a>=1.5708) && (a<=3.14159)) {
                    a=a+3.14159;
                }
                else if ((prevDiff.x >= 0) && (prevDiff.y <=0) && (a>=0) && (a<=1.5708)) {
                    a = 6.28319 - a;
                }
                if ((curDiff.x <= 0) && (curDiff.y <=0) && (b>=1.5708) && (b<=3.14159)) {
                    b=b+3.14159;
                }
                else if ((curDiff.x >= 0) && (curDiff.y <=0) && (b>=0) && (b<=1.5708)) {
                    b = 6.28319 - b;
                }

                if ((a>=4.71239) && (b<=1.5708)){
                    b=b+6.28319;
                }
                else if ((b>= 4.71239) && (a<=1.5708)){
                    a=a+6.28319;
                }
                y = y + (b-a);
                arrow.style.webkitTransform = arrow.style.transform  = 'rotate(' + y + 'rad)';
                prevDiff = curDiff;
            }
        } //если один пальчик, то обрабатываем перемещения
        else if (fingers.length == 1) {
            transform.translate = ' translate(' + (moveCache.x + fingers[0].clientX - moveCache.event.clientX) + 'px, '
                + (moveCache.y + fingers[0].clientY - moveCache.event.clientY)  + 'px) ';
        }
    }

    function pointerupHandler(e) {
        if (fingers.length == 2) {
            cacheFingers = cacheMoveFingers;
        }
        removeFinger(e);
        if (fingers.length < 2) {
            console.log(y);
            checkAnswer.call(this);
        }
    }

    function removeFinger(e) {
        for (var i = 0; i < fingers.length; i++) {
            if (fingers[i].pointerId == e.pointerId) {
                fingers.splice(i, 1);
                break;
            }
        }
    }

    function checkAnswer(){
        var i = Math.floor((y-3)/6.28319);
        if (y>=(3+6.28319*i) && y<(3.3+6.28319*i)){
            this.unlock();
        }
    }

    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;