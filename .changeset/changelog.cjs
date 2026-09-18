// A local issuer lets Yarn PnP resolve the explicitly declared changelog dependency.
const changelog = require("@changesets/changelog-github");

module.exports = changelog.default ?? changelog;
