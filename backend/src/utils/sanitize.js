function sanitizeFiles(files, userSubscription) {
  for (const [filename, content] of Object.entries(files)) {
    if (filename.endsWith('.js')) {
      if (content.includes('eval(') || content.includes('Function(')) {
        throw new Error('Potentially unsafe code detected in ' + filename);
      }
    }
    if (filename === 'manifest.json') {
      const manifest = JSON.parse(content);
      if (manifest.permissions && manifest.permissions.includes('<all_urls>') && userSubscription !== 'premium') {
        throw new Error('Advanced permission <all_urls> requires premium subscription');
      }
    }
  }
  return files;
}

module.exports = sanitizeFiles;