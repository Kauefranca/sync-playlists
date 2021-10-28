exports.godlessRegex = /\[[^)]*\]|\([^)]*\)|{\([^)]*\}|lyrics|ft|feat.*|nightcore|[^0-9a-zA-Z \n']+/gi;

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