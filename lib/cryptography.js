const forge = require('node-forge');

exports.ED25519 = forge.pki.ed25519;
exports.encode64 = forge.util.encode64;
exports.decode64 = forge.util.decode64;
exports.SHA256 = (message) => {
    let md = forge.md.sha256.create();
    md.update(message);
    return md.digest().toHex();
};
exports.MD5 = (message) => {
    let md = forge.md.md5.create();
    md.update(message);
    return md.digest().toHex();
};