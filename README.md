# Simple @11ty/eleventy Image Gallery using Unsplash and loripsum.net - hosted on github pages

[![11ty docs here](https://www.11ty.dev/img/possum-balloon-original.webp)](https://www.11ty.dev/docs/)

## Getting Started

Make new directory, init, and install

```
gh repo create random-image-gallery-11ty
mkdir random-image-gallery-11ty
cd random-image-gallery-11ty
npm init -y
git init
git add -A
git commit -m "init"
npm install --save-dev @11ty/eleventy clean-css
```

Adjust `scripts` in `package.json`

`xdg-open package.json`

```
    "start": "npx eleventy --serve",
    "build": "env NODE_ENV=production npx eleventy --pathprefix 'random-image-gallery-11ty'",
    "debug": "DEBUG=* npx eleventy",
    "dry": "npx @11ty/eleventy --dryrun"

```
add `.eleventy.js`

```
cat > .eleventy.js << EOF
const CleanCSS = require("clean-css");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
  return {
    dir: {
        output: "docs"
   	}
  }
};
EOF
```

add `.eleventyignore`
```
cat > .eleventyignore << EOF
README.md
tmp/
EOF
```

add `.gitignore`
```
cat > .gitignore << EOF
node_modules/
tmp/
**/.env*
EOF
```

Create `_includes/partials/_style.css`

```
cat > _includes/partials/_style.css << EOF
.container {
	display: flex;
	flex-direction: column;
}
@media (min-width: 459px) {
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		grid-gap: 32px;
		grid-auto-flow: dense;
		width: 80%;
		margin: 0 auto;
	}
}

img {
	max-width: 100%;
	height: auto;
}

@media (max-width: 1440px) {
	.article:nth-child(31n + 1) {
		grid-column: 1 / -1;
	}
	.article:nth-child(16n + 2) {
		grid-column: -3 / -1;
	}
	.article:nth-child(16n + 10) {
		grid-column: 1 / -2;
	}
}

@media (min-width: 1440px) {
	.article:nth-child(16n + 2) {
		grid-column: -5 / -3;
	}
	.article:nth-child(16n + 10) {
		grid-column: 1 / -4;
	}
}
EOF
```


add `index.html`

```
cat > index.html << EOF
---
layout: layout.njk
title: Image Gallery
---
<main id='main' class="container">
{% for post in collections.posts %}
<article class="article">
    <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt }}" />
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <p>{{ post.data.description }}</p>
    <em>{{ post.date | date: "%Y-%m-%d" }}</em>
</article>
{% endfor %}
</main>

EOF
```

Make directory `_includes` and add `_includes/layout.njk` 

```
mkdir _includes

cat > _includes/layout.njk << EOF
<!doctype html>
<html lang="en">
	<head>
		{% include "partials/_head.njk" %}
	</head>
    <body>
        <h1>{{ title }}</h1>
        <p> {{ description }} </p>
        {{ content | safe }}
    </body>
</html>
EOF
```

Create directory `_includes/partials` and add `_includes/partials/_head.njk`
```
mkdir _includes/partials

cat > _includes/partials/_head.njk << EOF
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" /> 
<title>{{ title }}</title>
<meta name="description" content="{{ description }}">
<!-- capture the CSS content as a Nunjucks variable -->
{% set css %}
  {% include "partials/_style.css" %}
{% endset %}
<!-- feed it through our cssmin filter to minify -->
<style>
  {{ css | cssmin | safe }}
</style>
EOF
```

Make directory `src/posts/` and add `src/posts/posts.json` to create a `collection` called `posts`.
```
mkdir -p src/posts/

cat > src/posts/posts.json << EOF
{
  "layout": "layout.njk",
  "tags": ["posts"],
  "image": "src/img/dummy.jpg"
}
EOF
```

Make directory `src/img/`, and grab a dummy image from online while making a post for each image.

```
mkdir -p src/img/
`for i in {1..16}; do
	wget -O src/img/dummy${i}.jpg https://source.unsplash.com/600x600/?nature,water
	desc=$(curl https://loripsum.net/api/1/short/plaintext | tr -d ":;")
	text=$(curl https://loripsum.net/api/3/long/plaintext)
	cat > src/posts/post${i}.md << EOF
	---
	title: Gallery Post ${i}
	description: ${desc}
	image: src/img/dummy${i}.jpg
	---
	${text}
	EOF
	sleep 1
done`
```


`npm start`

## Host on Git Hub Pages with Travis-CI


```
cat > .travis.yml << EOF
language: node_js
node_js:
  - 12
before_script:
  - npm install @11ty/eleventy clean-css -g 
script: eleventy --pathprefix="/random-image-gallery-11ty/"
deploy:
  local-dir: docs
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN  # Set in travis-ci.org dashboard, marked secure
  keep-history: true
  on:
    branch: master
EOF
```


```
git add -A && git commit -m "everything all at once"
git branch -M main
git remote add origin git@github.com:danielclough/random-image-gallery-11ty.git
git push -u origin main
```