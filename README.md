# [Issue Tracker](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)

### Requirement
<code>npm install mongodb@latest</code> <br>
<code>npm install mongoose@latest</code>


### GET

### POST
The post function() should return an object with the required fields
<img src="public/img/post_output.png" />

### PUT 

### DELETE


## Tests 
1. Create an issue with every field: POST request to /api/issues/{project}
2. Create an issue with only required fields: POST request to /api/issues/{project}
3. Create an issue with missing required fields: POST request to /api/issues/{project}
4. View issues on a project: GET request to /api/issues/{project}
5. View issues on a project with one filter: GET request to /api/issues/{project}
6. View issues on a project with multiple filters: GET request to /api/issues/{project}
7. Update one field on an issue: PUT request to /api/issues/{project}
8. Update multiple fields on an issue: PUT request to /api/issues/{project}
9. Update an issue with missing _id: PUT request to /api/issues/{project}
10. Update an issue with no fields to update: PUT request to /api/issues/{project}
11. Update an issue with an invalid _id: PUT request to /api/issues/{project}
12. Delete an issue: DELETE request to /api/issues/{project}
13. Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
14. Delete an issue with missing _id: DELETE request to /api/issues/{project}

### Test example
<img src="public/img/tests_example.png" />



## [ Demo](https://boilerplate-project-issuetracker.sukainaabkari.repl.co)
