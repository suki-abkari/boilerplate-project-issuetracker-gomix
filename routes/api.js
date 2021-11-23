
const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const uri = process.env['MONGO_URI']

'use strict';

module.exports = function(app) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  let issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    open: { type: Boolean, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    project: String
  })

  let Issue = mongoose.model('Issue', issueSchema)
  app.route('/api/issues/:project')
    .get(function(req, res) {
      let project = req.params.project;
    })

    // POST
    .post(function(req, res) {
      let project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json('Required fields missing from request')
      }
      let addIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project
      })

      addIssue.save((error, savedIssue) => {
        if (!error && savedIssue) {
          // console.log('Saved Issue is')
          // console.log(savedIssue)
          // Return object with the new issue data
          res.json(savedIssue)
        }
      })
    })

    // PUT
    .put(function(req, res) {
      var project = req.params.project;
      let updateObject = {}
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] != '') {
          updateObject[key] = req.body[key]
        }
      })
      if (Object.keys(updateObject).length < 2) {
        return res.json('no updated field sent')
      }
      updateObject['updated_on'] = new Date().toUTCString()
      Issue.findByIdAndUpdate(
        req.body._id,
        updateObject,
        { new: true },
        (error, updatedIssue) => {
          if (!error && updatedIssue) {
            return res.json('successfully updated')
          } else if (!updatedIssue) {
            return res.json('could not update ' + req.body._id)
          }
        }
      )
    })

    // DELETE
    .delete(function(req, res) {
      let project = req.params.project;


    });

};
