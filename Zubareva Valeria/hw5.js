function Exception(message) {
    this.message = message || 'Message';
}

function MenuItem() {
    this._consist = [].slice.call(arguments);
}

MenuItem.prototype.getConsist= function () {
    return this._consist;
};

MenuItem.prototype.calculatePrice = function () {
    var consist = this.getConsist();
    var price = 0;
    consist.forEach(function (point) {
        price += point.price;
    });
    return price;
};

MenuItem.prototype.calculateCalories = function () {
    var consist = this.getConsist();
    var calories = 0;
    consist.forEach(function (point) {
        calories += point.calories;
    });
    return calories;
};


function Hamburger(size, stuffing) {
    try {
        if (size == null || stuffing == null) {
            throw new Exception('no arguments');
        } else if (size != Hamburger.SIZE_SMALL && size != Hamburger.SIZE_LARGE) {
            throw new Exception('invalid size');
        } else {
            MenuItem.apply(this, arguments);
            this._size = size;
            this._stuffing = [stuffing].concat([].slice.call(arguments, 2));
        }
    } catch (e) {
        console.log(e.message);
    }

}


Hamburger.SIZE_SMALL = {
    'name': 'small',
    'price': 50,
    'calories': 20
};
Hamburger.SIZE_LARGE = {
    'name': 'large',
    'price': 100,
    'calories': 40
};
Hamburger.STUFFING_CHEESE = {
    'name': 'cheese',
    'price': 10,
    'calories': 20
};
Hamburger.STUFFING_SALAD = {
    'name': 'salad',
    'price': 20,
    'calories': 5
};
Hamburger.STUFFING_POTATO = {
    'name': 'potato',
    'price': 15,
    'calories': 10
};

Hamburger.prototype = Object.create(MenuItem.prototype);
Hamburger.prototype.constructor = Hamburger;

Hamburger.prototype.getSize = function () {
    return this._size;
};

Hamburger.prototype.getStuffing = function () {
    return this._stuffing;
};


function Salad(type) {
    try {
        if (type== null) {
            throw new Exception('no arguments');
        } else {
             MenuItem.call(this, type);
        }
    } catch (e) {
        console.log(e.message);
    }
}

Salad.CAESAR = {
    'name': 'caesar',
    'price': 100,
    'calories': 20
};
Salad.OLIVIE = {
    'name': 'olivie',
    'price': 50,
    'calories': 80
};

Salad.prototype = Object.create(MenuItem.prototype);
Salad.prototype.constructor = Salad;

function Drink(type) {
    try {
        if (type == null) {
            throw new Exception('no arguments');
        } else {
            MenuItem.call(this, type);
        }
    } catch (e) {
        console.log(e.message);
    }
}

Drink.COLA = {
    'name': 'cola',
    'price': 50,
    'calories': 40
};
Drink.COFFEE = {
    'name': 'coffee',
    'price': 80,
    'calories': 20
};

Drink.prototype = Object.create(MenuItem.prototype);
Drink.prototype.constructor = Drink;

function Order() {
    this._points = [].slice.call(arguments);
    this.paid = false;
}
Order.prototype.getPoints = function () {
    return this._points.slice(0);
};

Order.prototype.setPoints = function(points) {
    if(!this.paid){
        this._points = points;
    } else {
        console.log("Order was paid!")
    }
};

Order.prototype.calculatePrice = function () {
    var price = 0;
    this.getPoints().forEach(function (item) {
        price += item.calculatePrice();
    });
    return price;
};

Order.prototype.calculateCalories = function () {
    var price = 0;
    this.getPoints().forEach(function (item) {
        price += item.calculateCalories();
    });
    return price;
};

Order.prototype.add = function (item) {
        this.setPoints(this.getPoints().concat(item));
};

Order.prototype.del = function (item) {
    var points = this.getPoints();
    var itemPosition = points.indexOf(item);
    if (itemPosition > 0) {
        points.splice(itemPosition, 1);
    }
    this.setPoints(points);
};

Order.prototype.pay = function () {
    Object.defineProperty(this, '_points', {
        value: this.getPoints(),
        configurable: false,
        writable: false
        });
    this.paid = true;
};

function Menu(){
    this.hamburger1 = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_POTATO);
    this.hamburger2 = new Hamburger(Hamburger.SIZE_LARGE, Hamburger.STUFFING_CHEESE);
    this.cola = new Drink(Drink.COLA);
    this.coffe = new Drink(Drink.COFFEE);
    this.salad1 = new Salad(Salad.OLIVIE);
    this.salad2 = new Salad(Salad.OLIVIE);
}


var menu  = new Menu();
var order = new Order(menu.hamburger1, menu.hamburger2, menu.cola, menu.salad1);

order.add(menu.salad2);

order.pay();

order.del(menu.coffe);

console.log(order);
