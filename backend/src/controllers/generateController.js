const { generateExtensionFiles } = require('../services/aiService');
const { createZipFromFiles } = require('../services/zipService');
const { Project, Version } = require('../models');
const sanitizeFiles = require('../utils/sanitize');
const fs = require('fs');

exports.generateFromPrompt = async (req, res) => {
  try {
    const { prompt, projectName, projectId } = req.body;
    const userId = req.user.id;
    const userStatus = req.user.subscriptionStatus || 'free';

    // --- NEW: SUBSCRIPTION LIMIT CHECK ---
    // Count how many projects the user already has
    const projectCount = await Project.count({ where: { userId } });

    // If it's a NEW project (not editing an existing one), check limits
    if (!projectId) {
      if (userStatus === 'free' && projectCount >= 1) {
        return res
          .status(403)
          .json({ error: 'LIMIT_REACHED', message: 'Free limit reached.' });
      }
      if (userStatus === 'plus' && projectCount >= 2) {
        return res
          .status(403)
          .json({ error: 'LIMIT_REACHED', message: 'Plus limit reached.' });
      }
      // 'pro' has no limits, so it bypasses this check
    }
    // -------------------------------------

    const files = await generateExtensionFiles(prompt);
    sanitizeFiles(files, userStatus);

    let project;
    if (projectId) {
      project = await Project.findOne({ where: { id: projectId, userId } });
      if (!project) return res.status(404).json({ error: 'Project not found' });
    } else {
      project = await Project.create({
        userId,
        name: projectName || 'Untitled',
        description: prompt,
      });
    }

    const lastVersion = await Version.findOne({
      where: { projectId: project.id },
      order: [['versionNumber', 'DESC']],
    });
    const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    const zipPath = await createZipFromFiles(files);

    const version = await Version.create({
      projectId: project.id,
      prompt,
      files,
      versionNumber,
    });

    project.currentVersionId = version.id;
    await project.save();

    res.download(zipPath, `${project.name}-v${versionNumber}.zip`, (err) => {
      if (err) console.error('Download error:', err);
      fs.unlink(zipPath, () => {});
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
