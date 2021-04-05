const CleanCSS = require("clean-css");
module.exports = function(eleventyConfig) {
    dir: {
        output: "docs"
    },
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
};
