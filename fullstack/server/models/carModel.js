/**
 * Create a Car.
 * @param {number} id - The unique identifier for the car.
 * @param {Wheel} wheelType - The type of wheels the car has.
 * @param {string} usageType - The usage type of the car (e.g., Personal, Commercial).
 * @param {Exterior} exteriorType - The exterior details of the car.
 * @param {Interior} interiorType - The interior details of the car.
 * @param {number} price - The price of the car.
 */
class Car {
  constructor(id, baseModel, exteriorType, interiorType, price) {
    this.id = id;
    this.baseModel = baseModel;
    this.wheelType = wheelType;
    this.exteriorType = exteriorType;
    this.interiorType = interiorType;
    this.price = price;
  }
}

/**
 * @param {string} model
 * @param {string} make
 * @param {number} year
 */
class CarBase {
  constructor(id, model, make, year, bodyStyle) {
    this.id = id;
    this.model = model;
    this.make = make;
    this.year = year;
    this.bodyStyle = bodyStyle;
  }
}

/**
 * Create an Interior.
 * @param {number} id - The unique identifier for the interior.
 * @param {string} material - The material used for the interior (e.g., Leather, Cloth).
 * @param {string} color - The color of the interior.
 * @param {number} price - The price of the interior.
 */
class Interior {
  constructor(id, material, color, price) {
    this.id = id;
    this.material = material;
    this.color = color;
    this.price = price;
  }
}

/**
 * Create an Exterior.
 * @param {number} id - The unique identifier for the exterior.
 * @param {string} finish - The finish type of the exterior (e.g., Matte, Gloss).
 * @param {string} color - The color of the exterior.
 * @param {number} price - The price of the exterior.
 */
class Exterior {
  constructor(id, finish, color, price) {
    this.id = id;
    this.finish = finish;
    this.color = color;
    this.price = price;
  }
}

/**
 * Create a Wheel.
 * @param {number} id - The unique identifier for the wheel.
 * @param {string} name - The name/type of the wheel.
 * @param {number} price - The price of the wheel.
 */
class Wheel {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

export default {
  Wheel,
  Interior,
  Exterior,
  CarBase,
  Car
};
