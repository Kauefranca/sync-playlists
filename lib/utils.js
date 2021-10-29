exports.godlessRegex = /\[[^)]*\]|\([^)]*\)|{\([^)]*\}|lyrics|ft|feat.*|nightcore|[^0-9a-zA-ZÀ-ÖØ-öø-ÿ \n']+/gi;

/**
 * Decode a unicoded string
 *
 * @param {String} str Unicoded string
 * @returns {String} Decode string
 */
exports.removeUnicode = (str) => {
    var r = /\\u([\d\w]{4})/gi;
    str = str.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
    return decodeURIComponent(str);
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
exports.generateRandomString = (length) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};