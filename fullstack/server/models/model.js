/**
 * Cars, base information of a car
 * @param {number} id - The unique identifier for the car
 * @param {string} model
 * @param {CarLogos} make
 * @param {number} year - Year of the car, between 1930 to current time
 * @param {number} specs
 * @param {string} body_type
 * @param {number} price_estimate
 * @param {CarGalleries}
 */
class Cars {
  constructor(
    id,
    model,
    make,
    year,
    specs,
    body_type,
    price_estimate,
    gallery_id
  ) {
    this.id = id;
    this.model = model;
    this.make = make;
    this.year = year;
    this.specs = specs;
    this.body_type = body_type;
    this.price_estimate = price_estimate;
    this.gallery_id = gallery_id;
  }
}

/**
 * @param {number} id
 * @param {number} car_id
 */
class CarGalleries {
  constructor(id, car_id) {
    this.id = id;
    this.car_id = car_id;
  }
}

/**
 * @param {number} id
 * @param {string} logo
 * @param {string} make
 */
class CarLogos {
  constructor(id, logo, make) {
    this.id = id;
    this.logo = logo;
    this.make = make;
  }
}

/**
 * @param {number} id
 */
class CarReplies {
  constructor(
    id,
    user_id,
    review_comment,
    created_at,
    votes,
    updated_at,
    replying_to_reply,
    replying_to_review
  ) {
    this.id = id;
    this.user_id = user_id;
    this.review_comment = review_comment;
    this.created_at = created_at;
    this.votes = votes;
    this.updated_at = updated_at;
    this.replying_to_reply = replying_to_reply;
    this.replying_to_review = replying_to_review;
  }
}

class Pictures {
  constructor(id, url, gallery_id) {
    this.id = id;
    this.url = url;
    this.gallery_id = gallery_id;
  }
}

class RepairGuides {
  constructor(
    id,
    car_id,
    mechanic_id,
    title,
    guide_description,
    markdown_content,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.car_id = car_id;
    this.mechanic_id = mechanic_id;
    this.title = title;
    this.guide_description = guide_description;
    this.markdown_content = markdown_content;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

class RepairGuidesMedias {
  constructor(id, guide_id, media_url, description) {
    this.id = id;
    this.guide_id = guide_id;
    this.media_url = media_url;
    this.description = description;
  }
}

class CarSpecs {
  constructor(
    id,
    car_id,
    horsepower,
    mpg,
    seating_capacity,
    cargo_volume,
    engine_volume,
    seats,
    drivetrain
  ) {
    this.id = id;
    this.car_id = car_id;
    this.horsepower = horsepower;
    this.mpg = mpg;
    this.seating_capacity = seating_capacity;
    this.cargo_volume = cargo_volume;
    this.engine_volume = engine_volume;
    this.seats = seats;
    this.drivetrain = drivetrain;
  }
}

export  {
    Cars,
    CarGalleries,
    CarLogos,
    CarSpecs,
    RepairGuidesMedias,
    RepairGuides,
    Pictures,
    CarReplies
};