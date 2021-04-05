const CleanCSS = require("clean-css");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
};
