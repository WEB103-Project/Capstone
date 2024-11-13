/**
 * Cars - Basic information of a car
 */
class Cars {
  constructor(id, url, make, model, year, vin, car_short_desc, mpg, hp, body_type, price_estimate, seating_capacity, engine_type, drivetrain, mileage, transmission, ext_color, gallery_id) {
    this.id = id;
    this.url = url;
    this.make = make;
    this.model = model;
    this.year = year;
    this.vin = vin;
    this.car_short_desc = car_short_desc;
    this.mpg = mpg;
    this.hp = hp;
    this.body_type = body_type;
    this.price_estimate = price_estimate;
    this.seating_capacity = seating_capacity;
    this.engine_type = engine_type;
    this.drivetrain = drivetrain;
    this.mileage = mileage;
    this.transmission = transmission;
    this.ext_color = ext_color;
    this.gallery_id = gallery_id;
  }
}

/**
 * CarGalleries - Gallery of images associated with a car
 */
class CarGalleries {
  constructor(id, car_id) {
    this.id = id;
    this.car_id = car_id;
  }
}

/**
 * Pictures - Pictures within a gallery
 */
class Pictures {
  constructor(id, url, gallery_id) {
    this.id = id;
    this.url = url;
    this.gallery_id = gallery_id;
  }
}

/**
 * CarSpecs - Specifications for a car
 */
class CarSpecs {
  constructor(id, car_id, horsepower, mpg, seating_capacity, cargo_volume, engine_type, seats, drivetrain) {
    this.id = id;
    this.car_id = car_id;
    this.horsepower = horsepower;
    this.mpg = mpg;
    this.seating_capacity = seating_capacity;
    this.cargo_volume = cargo_volume;
    this.engine_type = engine_type;
    this.seats = seats;
    this.drivetrain = drivetrain;
  }
}

/**
 * CarPriceHistories - Historical pricing data for a car
 */
class CarPriceHistories {
  constructor(id, car_id, price, date_recorded) {
    this.id = id;
    this.car_id = car_id;
    this.price = price;
    this.date_recorded = date_recorded;
  }
}

/**
 * CarLogos - Logos associated with car makes
 */
class CarLogos {
  constructor(id, logo, make) {
    this.id = id;
    this.logo = logo;
    this.make = make;
  }
}

/**
 * Users - User information
 */
class Users {
  constructor(id, username, role, email, first_name, last_name, phone_number, created_at) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone_number = phone_number;
    this.created_at = created_at;
  }
}

/**
 * CarReview - Reviews left by users for cars
 */
class CarReview {
  constructor(id, user_id, car_id, review_score, review_title, review_comment, created_at, updated_at) {
    this.id = id;
    this.user_id = user_id;
    this.car_id = car_id;
    this.review_score = review_score;
    this.review_title = review_title;
    this.review_comment = review_comment;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

/**
 * CarReplies - Replies to car reviews, supports nested replies
 */
class CarReplies {
  constructor(id, user_id, review_comment, created_at, votes, updated_at, replying_to_reply, replying_to_review) {
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

/**
 * CarCommonIssues - Common issues reported for cars
 */
class CarCommonIssues {
  constructor(id, car_id, issue_title, issue_description, reported_by, created_at) {
    this.id = id;
    this.car_id = car_id;
    this.issue_title = issue_title;
    this.issue_description = issue_description;
    this.reported_by = reported_by;
    this.created_at = created_at;
  }
}

/**
 * RepairGuides - Guides for repairing cars, created by mechanics
 */
class RepairGuides {
  constructor(id, car_id, mechanic_id, title, guide_description, markdown_content, created_at, updated_at) {
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

/**
 * RepairGuideMedias - Media associated with repair guides
 */
class RepairGuideMedias {
  constructor(id, guide_id, media_url, media_type, description) {
    this.id = id;
    this.guide_id = guide_id;
    this.media_url = media_url;
    this.media_type = media_type;
    this.description = description;
  }
}

/**
 * CarAnalytics - Analytics and technical details for cars, including service history
 */
class CarAnalytics {
  constructor(id, car_id, last_serviced, mileage, technical_issues, mechanic_notes) {
    this.id = id;
    this.car_id = car_id;
    this.last_serviced = last_serviced;
    this.mileage = mileage;
    this.technical_issues = technical_issues;
    this.mechanic_notes = mechanic_notes;
  }
}

export {
  Cars,
  CarGalleries,
  Pictures,
  CarSpecs,
  CarPriceHistories,
  CarLogos,
  Users,
  CarReview,
  CarReplies,
  CarCommonIssues,
  RepairGuides,
  RepairGuideMedias,
  CarAnalytics
};
