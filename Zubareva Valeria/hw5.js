function Exception(message) {
    this.message = message || 'Message';
}

function MenuItem() {
    this._consist = [].slice.call(arguments);
}

MenuItem.prototype.getConsist = function () {
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

try {
    function Hamburger(size, stuffings) {
        if (size === undefined) {
            throw new Exception('Missing argument "size"');
        } else if (size !== Hamburger.SIZE_SMALL && size !== Hamburger.SIZE_LARGE) {
            throw new Exception('Invalid size');
        } else if (stuffings.length === 0 || stuffings === undefined) {
            throw new Exception('Missing argument "stuffings"');
        } else {
            for (var i = 0; i < stuffings.length; i++) {
                if (stuffings[i] !== Hamburger.STUFFING_SALAD && stuffings[i] !== Hamburger.STUFFING_POTATO && stuffings[i] !== Hamburger.STUFFING_CHEESE) {
                    throw new Exception('Invalid stuffings');
                }
            }
            MenuItem.apply(this, stuffings.concat(size));
            this._size = size;
            this._stuffing = stuffings;
        }
    }
} catch (e) {
    console.error(e.message);
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

try {
    function Salad(type, portion) {
        if (type === undefined) {
            throw new Exception('Missing argument "type"');
        } else if (type !== Salad.OLIVIE && type !== Salad.CAESAR) {
            throw new Exception('Incorrect argument type');
        } else if (portion === undefined) {
            throw new Exception('Missing argument "portion"');
        } else {
            MenuItem.call(this, type);
            this._portion = portion;
            this._type = type;
        }
    }
} catch (e) {
    console.error(e.message);
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
Salad.STANDARTPRTION = 100;

Salad.prototype = Object.create(MenuItem.prototype);
Salad.prototype.constructor = Salad;

Salad.prototype.getPortion = function () {
    return this._portion;
};
Salad.prototype.getType = function () {
    return this._type;
};

Salad.prototype.calculatePrice = function () {
    return this.getType().price / Salad.STANDARTPRTION * this.getPortion();
};

Salad.prototype.calculateCalories = function () {
    return this.getType().calories / Salad.STANDARTPRTION * this.getPortion();
};
try {
    function Drink(type) {
        if (type === undefined) {
            throw new Exception('Missing argument "type"');
        } else if (type !== Drink.COFFEE && type !== Drink.COLA) {
            throw new Exception('Incorrect argument type');
        } else {
            MenuItem.call(this, type);
        }
    }
} catch (e) {
    console.error(e.message);
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
try {
    Order.prototype.setPoints = function (points) {

        if (this.paid) {
            throw new Exception('Order was "payd! You cannot change it!"');
        } else {
            this._points = points;
        }

    }
} catch (e) {
    console.error(e.message);
}
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
        writable: false
    });
    this.paid = true;
};

function Menu() {
}

Menu.prototype.hamburger = function () {
    var size = arguments[0];
    var stuffings = [].slice.call(arguments, 1);
    return new Hamburger(size, stuffings);
};
Menu.prototype.drink = function () {
    var type = arguments[0];
    return new Drink(type);
};
Menu.prototype.salad = function () {
    var type = arguments[0];
    var portion = arguments[1];
    return new Salad(type, portion);
};

var myMenu = new Menu();
var drink1 = myMenu.drink(Drink.COLA);
var drink2 = myMenu.drink(Drink.COFFEE);
var salad1 = myMenu.salad(Salad.CAESAR, 200);
var hamburger1 = myMenu.hamburger(Hamburger.SIZE_LARGE, Hamburger.STUFFING_CHEESE, Hamburger.STUFFING_POTATO);
var order = new Order(drink1, drink2, salad1, hamburger1);

order.add(myMenu.salad(Salad.OLIVIE, 100));
order.del(salad1);

order.pay();

// order.add(myMenu.salad(Salad.OLIVIE, 100));
console.log(order, order.calculatePrice(), order.calculateCalories());

