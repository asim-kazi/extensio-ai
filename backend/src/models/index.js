const User = require('./User');
const Project = require('./Project');
const Version = require('./Version');

User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(Version, { foreignKey: 'projectId' });
Version.belongsTo(Project, { foreignKey: 'projectId' });

Project.belongsTo(Version, { as: 'currentVersion', foreignKey: 'currentVersionId' });

module.exports = { User, Project, Version };