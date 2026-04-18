const express = require('express');
const { getUserProjects, getProjectVersions, getProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);
router.get('/', getUserProjects);
router.get('/:projectId', getProject);
router.get('/:projectId/versions', getProjectVersions);
router.delete('/:projectId', deleteProject);

module.exports = router;