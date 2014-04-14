var getUpgradePath, semver;

semver = require("semver");

getUpgradePath = function(current, all) {
  var compacted, relevant, sorted;
  if (!semver.valid(current)) {
    return all;
  }
  relevant = all.map(function(ver) {
    if (semver.gt(ver, current)) return ver;
  });
  compacted = relevant.filter(function(value) {
    return value;
  });
  sorted = compacted.sort(semver.compare);
  return sorted;
};

module.exports = function(model, upgradeSpecs, versionProp) {
  var originalVersion, upgradePath, version;

  versionProp = versionProp != null ? versionProp : "version"

  originalVersion = model[versionProp] || null;
  upgradePath = getUpgradePath(originalVersion, Object.keys(upgradeSpecs));

  if (!(upgradePath.length > 0)) return model;

  upgradePath.forEach(function(version){
    model = upgradeSpecs[version](model);
    model[versionProp] = version;
  });

  if (!model.upgraded) {
    model.upgraded = originalVersion + ",";
  }
  model.upgraded += upgradePath.join(",");
  return model;
};
