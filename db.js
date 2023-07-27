const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const initDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nithinkumarkatru:hello@cluster0.zrplywq.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to database");
  } catch (error) {
    console.log("Error while connecting to db");
  }
};

const user_Schema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  age: {
    type: Number,
  },
  car_details: {
    make: {
      type: String,
    },
    model: {
      type: String,
    },
    year: {
      type: String,
    },
    plateNumber: {
      type: String,
    },
  },
});

user_Schema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

user_Schema.pre("updateOne", function (next) {
  const user = this;
  if (user.licenseNumber) {
    bcrypt.hash(user.licenseNumber, 10, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.licenseNumber = hash;
      next();
    });
  } else {
    next();
  }
});

const cusotmer = mongoose.model("Drivetest", user_Schema);

module.exports = {
  initDatabase,
  cusotmer,
};
