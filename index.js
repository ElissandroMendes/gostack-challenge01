const express = require("express");

const server = express();
server.use(express.json());
server.use(countNumberRequests);

const projects = [];
let numberRequisitions = 0;

function countNumberRequests(req, res, next) {
  console.log("#Requests", ++numberRequisitions);
  return next();
}

function findProjectIndex(id) {
  return projects.findIndex(v => {
    return v.id == id;
  });
}

function checkIfProjectExist(req, res, next) {
  const { id } = req.params;
  let index = findProjectIndex(id);
  if (index == -1) {
    return res.status(404).json({ message: "Project not found." });
  }
  req.projectIndex = index;
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({
    id,
    title,
    tasks: []
  });
  return res.status(200).json({ message: "Project created" });
});

server.put("/projects/:id", checkIfProjectExist, (req, res) => {
  const { projectIndex } = req;
  const { title } = req.body;

  projects[projectIndex].title = title;

  return res.status(200).json({ message: "Project title changed." });
});

server.post("/projects/:id/tasks", checkIfProjectExist, (req, res) => {
  const { projectIndex } = req;
  const { title } = req.body;

  projects[projectIndex].tasks.push(title);

  return res.status(200).json({ message: "Task added." });
});

server.delete("/projects/:id", checkIfProjectExist, (req, res) => {
  const { projectIndex } = req;

  projects.splice(projectIndex, 1);

  return res.send();
});
server.listen(3000);
