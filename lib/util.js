const createDirIfNotExist = dir => {
  // checks directory existence
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

const getList = page => page.parent().nextAll("ul").first().find("li a");

const getRelease = page => page("div[class='release-entry'] div[class~='release-main-section']")
  .first().find("a").first().text().trim();

module.exports = {
  createDirIfNotExist,
  getList,
  getRelease
};