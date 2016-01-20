
export function listsHaveCommon(list1, list2) {
  /*
   * Returns true if one element of list1 is also in list2
   * false otherwise
   */
  for (let i=0, l=list2.length; i < l; i++) {
    if (list1.indexOf(list2[i]) > -1) return true
  }
  return false
}

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
}
