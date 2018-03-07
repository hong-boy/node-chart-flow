const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
module.exports = {
    plugins: [
        cssnext(),
        autoprefixer()
    ]
};
