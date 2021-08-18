const getList = page => page.parent().nextAll("ul").first().find("li a");

const getRelease = page => page("div[class='release-entry'] div[class~='release-main-section']")
    .eq(0).find("a").eq(0).text().trim();

module.exports = {
    getList,
    getRelease
};