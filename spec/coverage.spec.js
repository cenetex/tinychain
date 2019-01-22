const fs = require('fs');
const path = require('path');

// Third Party Libraries
const jshint = require('jshint').JSHINT;

describe('Project', () => {
    // Get all the .js files in the ./ and ./lib folders 
    const files = fs.readdirSync('./lib').map(T => path.join('./lib', T))
        .concat(fs.readdirSync('.').map(T => path.join('.', T))
        .filter(T => path.extname(T) === '.js'));

    it('contains a spec file for each .js file in the root and root/lib folder', () => {
        files.forEach((file, i) => {
            expect(fs.existsSync(path.join('spec', path.basename(file) + '.spec.js')));
        });
    });
    it('files pass jshint', () => {
        const options = JSON.parse(fs.readFileSync('.jshintrc'));
        files.forEach(T => {
            jshint(fs.readFileSync(T).toString(), options);
            jshint.errors.forEach(err => {
                fail(T + JSON.stringify(err));
            });
        });
    });
});