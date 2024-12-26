export const concatenateLexicographically=(str1, str2)=> {
  // Compare the two strings lexicographically
  if (str1.localeCompare(str2) < 0) {
    return `${str1}_${str2}_`;
  } else {
    return `${str2}_${str1}_`;
  }
}


