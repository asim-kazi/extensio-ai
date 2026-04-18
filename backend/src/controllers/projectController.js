const { Project, Version } = require('../models');

exports.getUserProjects = async (req, res) => {
  const projects = await Project.findAll({ where: { userId: req.user.id }, include: [Version] });
  res.json(projects);
};

exports.getProjectVersions = async (req, res) => {
  const versions = await Version.findAll({ where: { projectId: req.params.projectId } });
  res.json(versions);
};

exports.getProject = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.projectId, userId: req.user.id } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.projectId, userId: req.user.id } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  await project.destroy();
  res.json({ success: true });
};