const express = require('express');
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * HTTP Methods:
 * 
 * GET: get information from the backend.
 * POST: create something on the backend.
 * PUT/PATCH: modify something on the backend.
 * DELETE: delete something on the backend.
 */

  /**
  * Param types:
  * 
  * Query params: filters and pagiantion.
  * Route params: identify resources (modify/create).
  * Body params: content to create or modify.
  */

  /**
  * Middleware: intercepts requests. 
  * It can stop requests or modify data on the request.
  */


const projects = [];

const logRequests = (req, res, next) => {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()} ${url}]`;

  console.time(logLabel);

  next(); //Call the route you requested.

  console.timeEnd(logLabel);// Called after you call the route.
}

const validateProjectId = (req, res, next) => {
  const { id } = req.params;

  if(!isUuid(id)){
    return status(400).json({
      error: "Not a valid ID."
    })
  }

  return next()
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (req, res) => {
  const { search } = req.query;

  const result = search ?
    projects.filter(item => item.project.toLowerCase().includes(search.toLowerCase())) 
    : 
    projects;

  return res.json(result);
});

app.get('/projects/:id', (req, res) => {
  const { params } = req;

  if(params.id > projects.length) {
    return res.status(404).json({
      error: 'Project not found.'
    });
  } ;

  return res.json(projects[params.id]);
})

app.post('/projects', (req, res) => {
  const { project } = req.body

  const newProject = { id: uuid(), project }

  projects.push(newProject);

  return res.json(projects)
})

app.put('/projects/:id', (req, res) => {
  const { body, params } = req;

  const projectIndex = projects.findIndex(item => item.id === params.id)

  if(projectIndex < 0) {
    return res.status(400).json({
      error: 'No project found.'
    })
  }

  const project = {
    id: params.id,
    project: body.project,
  }
  
  projects[projectIndex] = project;

  return res.json(projects);
})

app.delete('/projects/:id', (req, res) => {
  const { params } = req

  const projectIndex = projects.findIndex(item => item.id === params.id)

  if(projectIndex < 0) {
    return res.status(400).json({
      error: 'No project found.'
    })
  }

  projects.splice(projectIndex, 1);
  
  return res.json(projects);
})

app.listen(3333, () => {
  console.log('💯- Backend started!');
});

