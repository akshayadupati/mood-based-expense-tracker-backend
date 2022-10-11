const { Model } = require("mongoose");
const model = require("../models/model");

// POST : http://localhost:8080/api/categories
async function create_categories(req, res) {
  console.log("req body", req);
  const Create = new model.Categories({
    transactionMood: "Normal",
    color: "#003f5c",
  });

  await Create.save(function (err) {
    if (!err) return res.json(Create);
    return res
      .status(400)
      .json({ message: `Error while creating categories. Reason : ${err}` });
  });
}

// GET : http://localhost:8080/api/categories
async function get_categories(req, res) {
  console.log("req body", req);
  let data = await model.Categories.find({});
  let filteredData = data.map((eachCategory) =>
    Object.assign(
      {},
      {
        transactionMood: eachCategory.transactionMood,
        color: eachCategory.color,
      }
    )
  );
  return res.json(filteredData);
}

// POST : http://localhost:8080/api/transaction
async function create_transaction(req, res) {
  if (!req.body) {
    return res.status(400).json("POST HTTP data not provided");
  }
  let {
    expenseName,
    expenseType,
    transactionAmount,
    transactionMood,
    transactionDate,
  } = req.body;

  const create = await new model.Transaction({
    expenseName,
    expenseType,
    transactionMood,
    transactionAmount,
    transactionDate,
  });

  create.save(function (err) {
    if (!err) {
      return res.json(create);
    }
    return res.status(400).json({
      message: `Error occured while adding transaction. Reason : ${err}`,
    });
  });
}

// GET : http://localhost:8080/api/transaction
async function get_transaction(req, res) {
  let data = await model.Transaction.find({});
  return res.json(data);
}

// DELETE : http://localhost:8080/api/transaction
async function delete_transaction(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: `Request body not found` });
  }
  await model.Transaction.deleteOne(req.body, function (err) {
    if (!err) {
      res.json("Record deleted");
    }
  })
    .clone()
    .catch(function (err) {
      return res.json("Error while deleting the record");
    });
}

//GET : /api/labels
async function get_labels(req, res) {
  model.Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "transactionMood",
        foreignField: "transactionMood",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((response) => {
      let data = response.map((eachData) =>
        Object.assign(
          {},
          {
            _id: eachData._id,
            expenseName: eachData.expenseName,
            expenseType: eachData.expenseType,
            transactionMood: eachData.transactionMood,
            transactionAmount: eachData.transactionAmount,
            transactionDate: eachData.transactionDate,
            color: eachData.categories_info.color,
          }
        )
      );
      res.json(data);
    })
    .catch((err) => {
      res.status(404).json(`Lookup Error while aggregation : ${err}`);
    });
}

module.exports = {
  create_categories,
  get_categories,
  create_transaction,
  get_transaction,
  delete_transaction,
  get_labels,
};
