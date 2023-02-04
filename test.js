let mongoose = require("mongoose");
const server = "mongodb://127.0.0.1:27017/test1";

// connect to DB
mongoose
  .connect(server, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

/** Create a person with this prototype: */
const person = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: [{ type: String }],
});
const personneModel = mongoose.model("person", person);

/*  Create  a Record of a Model: */
const personne = new personneModel({
  name: "Safa",
  age: 26,
  favoriteFoods: ["Pasta", "Pizza", "Cheescake"],
});
/** save */
personne
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error(err);
  });

// Create Many Records with model.create()
const arrayOfPersonne = [
  {
    name: "Eva",
    age: 30,
    favoriteFoods: ["Fettuccine Alfredo", "Sushi", "Quiche"],
  },
  {
    name: "Paule",
    age: 24,
    favoriteFoods: ["Pasta", "Cheeseburgers", "French Fries"],
  },
  { name: "Safa", age: 10, favoriteFoods: ["Riz", "Glasse", "Fries"] },

  { name: "Aline", age: 15, favoriteFoods: ["Pasta", "Chocolat", "Fries"] },
  { name: "Safa", age: 20, favoriteFoods: ["Gateau", "Glasse", "Manga"] },
];

personneModel
  .create(arrayOfPersonne)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log(err));

/** Use model.find() to Search Your Database */
personneModel
  .find({
    name: "Safa", // search query
  })
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error(err);
  });

/**Use model.findOne() to Return a Single Matching Document from Your Database */
personneModel
  .findOne({ favoriteFoods: "Pasta" })
  .then((data) => console.log("data", data));

/**Use model.findById() to Search Your Database By _id */

personneModel
  .find({ _id: "63de6647ec95d75ce6744d68" })
  .then((data) => console.log(data));

// /**Perform Classic Updates by Running Find, Edit, then Save */

personneModel
  .findOne({ _id: "63de6647ec95d75ce6744d68" })
  .then((personne) => {
    personne.favoriteFoods.push("hamburger");
    personne.markModified("favoriteFoods");
    personne.save((err, data) => console.log(data));
  })
  .catch((er) => console.log(er));

// /**Perform New Updates on a Document Using model.findOneAndUpdate() */

const filter = { name: "Safa" };
const update = { age: 20 };

personneModel.countDocuments(filter); // 0

let doc = personneModel
  .findOneAndUpdate(filter, update, {
    new: true,
    upsert: false,
  })
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// /**Delete One Document Using model.findByIdAndRemove */

personneModel
  .findOneAndDelete({ _id: "63de5fe4e584d017c36dd8e5" })
  .then((err) => console.log("deleted"));

/**MongoDB and Mongoose - Delete Many Documents with model.remove()*/
//remove depercated
personneModel.deleteOne({ name: "Aline" }).then(() => console.log("OK"));

/**Chain Search Query Helpers to Narrow Search Results */

personneModel
  .find({ favoriteFoods: "Pasta" }) // find all users
  .limit(2) // limit to 10 items
  .sort({ name: 1 }) // sort ascending by firstName
  .select({ name: true, favoriteFoods: true }) // select firstName only
  .exec() // execute the query
  .then((docs) => {
    console.log(docs);
  })
  .catch((err) => {
    console.error(err);
  });
