/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const router = express.Router();
const checkLogin = require("../middleware/checkLogin");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

router.use(express.json());

// GET ALL THE TODOS
// Execute By TryCatch
// router.get("/", async (req, res) => {
//   try {
//       const result= await Todo.find({status: "active"})
//     .select({
//       _id: 0,
//       _v:0,
//       date: 0,
//     })
//     .limit(2)
//     res.status(200).json({result, Message: "Succesfuly Data Find"})
//   } catch (err) {
//     res.status(500).json({err, Error: "There was a server side error!"})
//   }
// });

// Execute By Promise
router.get("/", checkLogin, async (req, res) => {
  await Todo.find({})
    .populate("user")
    .select({
      _id: 0,
      _v: 0,
      date: 0,
    })
    .limit()
    .exec()
    .then((result) => {
      res.status(200).json({ result, Message: "Succesfuly Data Find" });
    })
    .catch((err) => {
      res.status(500).json({ err, Error: "There was a server side error!" });
    });
});

// GET A TODO by ID
// Execute By Promise
// router.get("/:id", async (req, res) => {
//   await Todo.find({ _id: req.params.id })
//     .then((result) => {
//       res.status(200).json({ result, Message: "Succesfuly Data Find" });
//     })
//     .catch((err) => {
//       res.status(500).json({ err, Error: "There was a server side error!" });
//     });
// });

// Execute By TryCatch
router.get("/:id", async (req, res) => {
  try {
    const result = await Todo.find({ _id: req.params.id });
    res.status(200).json({ result, Message: "Succesfuly Data Find" });
  } catch (err) {
    res.status(500).json({ err, Error: "There was a server side error!" });
  }
});

// POST A TODO
// Execute By TryCatch
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });

  try {
    const result = await newTodo.save();

    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: result._id,
        },
      }
    );
    res
      .status(200)
      .json({ result, message: "Todo was inserted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was a server side error!  Error is" + err });
  }
});

// Same Post Anathor Way

// router.post("/", async (req, res) => {
//   const newTodo = new Todo(req.body);
//   let result = await newTodo.save();
//   res.send(result);
// });

// POST MULTIPLE TODO
// Execute By TryCatch

router.post("/all", async (req, res) => {
  try {
    const result = await Todo.insertMany(req.body);
    res
      .status(200)
      .json({ result, Message: "Todo were inserted successfully" });
  } catch (err) {
    res.status(500).json({ err, error: "There was a server side error!" });
  }
});

// PUT TODO
// Execute By Promise

router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          status: req.body.status,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({ result, message: "Todo was updated successfully!" });
  } catch (err) {
    res.status(500).json({ err, error: "There was a server side error!" });
  }
});

// Execute By Promise
router.put("/:id", async (req, res) => {
  await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        status: req.body.status,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((result) => {
      res
        .status(200)
        .json({ result, message: "Todo was updated successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ err, error: "There was a server side error!" });
    });
});

// DELETE A TODO
// Execute By TryCatch
// router.delete("/:id", async (req, res) => {
//   try {
//     const result = await Todo.deleteOne({ _id: req.params.id });
//     res.status(200).json({ result, message: "Todo was deleted successfully!" });
//   } catch (err) {
//     res.status(500).json({ err, error: "There was a server side error!" });
//   }
// });

// Execute By Promise

router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id })
    .then((result) => {
      res
        .status(200)
        .json({ result, message: "Todo was deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ err, error: "There was a server side error!" });
    });
});

// DELETE ALL TODO
// Execute By TryCatch & thenCatch with Default errorHandler

// router.delete("/", async (req, res) => {
//   try {
//      await Todo.deleteMany({})
//     .then((result) => {
//       if(result.deleteCount === 0 ){
//         res.status(400).json({Result:"List is Empty! Nothing Delete."})
//       }
//       res.status(200).json({  message: "Todo was deleted successfully!" + result});
//     })
//     .catch((err) => errorHandler(res, err));
//   } catch (err) {
//     errorHandler(res,err)
//     res.status(500).json({ err, error: "There was a server side error!" });
//   }
// });

// Execute By Promise

// router.delete("/", async (req, res) => {
//   deleteTodo =
//   await Todo.deleteMany({
//     title: "Fazle Hasan"
//   }).then((result) => {
//       res
//         .status(200)
//         .json({ result, message: "Todo was deleted successfully!" });
//     })
//     .catch((err) => {
//       res.status(500).json({ err, error: "There was a server side error!" });
//     });
// });

// Execute By TryCatch
router.delete("/", async (req, res) => {
  try {
    result = await Todo.deleteMany({});
    res.status(200).json({ result, message: "Todo was deleted successfully!" });
  } catch (err) {
    res.status(500).json({ err, error: "There was a server side error!" });
  }
});
module.exports = router;
