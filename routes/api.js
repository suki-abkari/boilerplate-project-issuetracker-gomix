
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
  console.log(Issue)

  app.route('/api/issues/:project')
    .get(function(req, res) {
      let project = req.params.project;

    })

    .post(function(req, res) {
      let project = req.params.project;
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
          console.log('Saved Issue is')
          console.log(savedIssue)
        }
      })
    })

    .put(function(req, res) {
      let project = req.params.project;

    })

    .delete(function(req, res) {
      let project = req.params.project;

    });

};
