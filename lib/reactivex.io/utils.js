//solution based on
//https://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
function removeText(elem) {
  return elem.clone()    //clone the element
    .children() //select all the children
    .remove()   //remove all the children
    .end()  //again go back to selected element
    .text()
    .trim();
}

// function based on https://typeofnan.dev/how-to-split-an-array-into-a-group-of-arrays-in-javascript/
function createGroups(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
}

module.exports = {
  createGroups,
  removeText
}