const expect = require("chai").expect;
const MongoClient = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const uri = process.env["MONGO_URI"];

("use strict");

module.exports = function (app) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    open: { type: Boolean, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    project: String,
  });

  let Issue = mongoose.model("Issue", issueSchema);
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      var project = req.params.project;
      let filterObject = Object.assign(req.query);
      filterObject["project"] = project;
      Issue.find(filterObject, (error, arrayOfResults) => {
        if (!error && arrayOfResults) {
          return res.json(arrayOfResults);
        }
      });
    })

    // POST
    .post(function (req, res) {
      let project = req.params.project;
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json({ error: "required field(s) missing" });
      }
      let addIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project,
      });

      addIssue.save((error, savedIssue) => {
        if (!error && savedIssue) {
          // console.log('Saved Issue is')
          // console.log(savedIssue)
          // Return object with the new issue data
          res.json(savedIssue);
        }
      });
    })

    // PUT
    .put(function (req, res) {
      var project = req.params.project;
      let updateObject = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] != "") {
          updateObject[key] = req.body[key];
        }
      });
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }
      if (Object.keys(updateObject).length < 2) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id,
        });
      }
      updateObject["updated_on"] = new Date().toUTCString();
      Issue.findByIdAndUpdate(
        req.body._id,
        updateObject,
        { new: true },
        (error, updatedIssue) => {
          if (!error && updatedIssue) {
            return res.json({
              result: "successfully updated",
              _id: req.body._id,
            });
          } else if (!updatedIssue) {
            return res.json({ error: "could not update", _id: req.body._id });
          }
        }
      );
    })
    .put(function (req, res) {
      var project = req.params.project;
      let updateObject = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] != "") {
          updateObject[key] = req.body[key];
        }
      });
      if (Object.keys(updateObject).length < 2) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id,
        });
      }
      updateObject["updated_on"] = new Date().toUTCString();
      Issue.findByIdAndUpdate(
        req.body._id,
        updateObject,
        { new: true },
        (error, updatedIssue) => {
          if (!error && updatedIssue) {
            return res.json({
              result: "successfully updated",
              _id: req.body._id,
            });
          } else if (!updatedIssue) {
            return res.json({
              error: "no update field(s) sent",
              _id: req.body._id,
            });
          }
        }
      );
    })

    // DELETE
    .delete(function (req, res) {
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      issueModel.findByIdAndRemove(_id, (err, removedIssue) => {
        if (err || !removedIssue) {
          return res.json({ error: "could not delete", _id: req.body._id });
        }
        return res.json({ result: "successfully deleted", _id: req.body._id });
      });
    });
};
