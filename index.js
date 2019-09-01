const express = require("express");

const server = express();
server.use(express.json());

const projects = [];

function findProjectIndex(id) {
  return projects.findIndex(v => {
    return v.id == id;
  });
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

server.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = findProjectIndex(id);

  console.log("index", projectIndex);
  let status = 200;
  let message = "Project title changed.";
  if (projectIndex !== -1) {
    projects[projectIndex].title = title;
  } else {
    status = 404;
    message = "Project not found.";
  }
  return res.status(status).json({ message });
});

server.post("/projects/:id/tasks", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = findProjectIndex(id);
  let status = 200;
  let message = "Task added.";
  if (projectIndex !== -1) {
    projects[projectIndex].tasks.push(title);
  } else {
    status = 404;
    message = "Project not found.";
  }
  return res.status(status).json({ message });
});
server.listen(3000);
