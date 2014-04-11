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

module.exports = function(model, versionFloors) {
  var originalVersion, upgradePath, version;

  originalVersion = model.ssVersion || null;
  upgradePath = getUpgradePath(originalVersion, Object.keys(versionFloors));

  if (!(upgradePath.length > 0)) return model;

  upgradePath.forEach(function(version){
    model = versionFloors[version](model);
    model.ssVersion = version;
  });

  if (!model.upgraded) {
    model.upgraded = originalVersion + ",";
  }
  model.upgraded += upgradePath.join(",");
  return model;
};
