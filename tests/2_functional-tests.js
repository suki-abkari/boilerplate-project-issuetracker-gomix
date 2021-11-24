const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
let id;
chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("POST /api/issues/{project}", function() {
    // 1. Create an issue with every field: POST request to /api/issues/{project}
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body._id);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.open, true);
          assert.exists(res.body.created_on);
          assert.exists(res.body.updated_on);
          id = res.body._id;
          done();
        });
    });

    // 2. Create an issue with only required fields: POST request to /api/issues/{project}
    test("Required fields filled in, Optional Fields Blank", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Only required fields filled in",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Only required fields filled in"
          );
          assert.equal(res.body.status_text, "");
          assert.exists(res.body.created_on);
          assert.exists(res.body.updated_on);
          done();
        });
    });

    // 3. Create an issue with missing required fields: POST request to /api/issues/{project}
    test('Missing required fields => { error: "required field(s) missing" }', function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET /api/issues/{project}", function() {
    // 4. View issues on a project: GET request to /api/issues/{project}
    test("No filter", function(done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    // 5. View issues on a project with one filter: GET request to /api/issues/{project}
    test("One filter", function(done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ issue_text: "text" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_text, "text");
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    // 6. View issues on a project with multiple filters: GET request to /api/issues/{project}
    test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ issue_title: "Title", issue_text: "text" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_title, "Title");
          assert.equal(res.body[0].issue_text, "text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project}", function() {
    // 7. Update one field on an issue: PUT request to /api/issues/{project}
    test('One field to update => { result: "successfully updated", _id: _id }', function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id,
          issue_title: "Updated Title",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body.result, "successfully updated");
          assert.deepEqual(res.body._id, id);
          done();
        });
    });

    // 8. Update multiple fields on an issue: PUT request to /api/issues/{project}
    test('Multiple fields to update => {result: "successfully updated", _id: _id}', function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id,
          issue_title: "Updated Title",
          issue_text: "updated issue text",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body.result, "successfully updated");
          assert.deepEqual(res.body._id, id);
          done();
        });
    });

    // 9. Update an issue with missing _id: PUT request to /api/issues/{project}
    test('No _id submitted => { error: "missing _id" }', function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_title: "Updated Title",
          issue_text: "updated issue text",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    // 10. Update an issue with no fields to update: PUT request to /api/issues/{project}
    test('No fields to update => { error: "no update field(s) sent", _id: _id }', function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id,
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, id);
          done();
        });
    });

    // 11. Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test('Invalid _id => { error: "could not update" }', function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: 50,
          issue_title: "Updated Title",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });

  suite("DELETE /api/issues/{project}", function() {
    // 12. Delete an issue: DELETE request to /api/issues/{project}
    test('Valid _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: id
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, id);
          done();
        });
    });

    // 13. Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test('Invalid _id => { error: "could not delete", "_id": _id }', function(done) {
      const wrongId = '';
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: wrongId
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, wrongId);
          done();
        });
    });

    // 14. Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test('No _id => { error: "missing _id" }', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});





