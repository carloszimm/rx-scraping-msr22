const getList = page => page.parent().next().find("li a");

module.exports = {
    getList
};