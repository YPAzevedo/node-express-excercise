const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.status(200).json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { title, url, techs } = req.body;
  const { id } = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex === -1) {
    return res.status(400).json({
      error: true,
      message: 'Repository was not found',
    });
  }

  const repository = {
    title,
    url,
    techs,
  };

  Object.assign(repositories[repoIndex], repository);

  return res.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex =  repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({
      error: 'Repository not found',
    });
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repoIndex =  repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({
      error: 'Repository not found',
    });
  }

  Object.assign(repositories[repoIndex], { likes: repositories[repoIndex].likes + 1 });

  return res.status(200).json(repositories[repoIndex]);
});

module.exports = app;