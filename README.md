# Personal Website

[![Build Status](https://api.travis-ci.org/2martens/2martens.de.png)](https://travis-ci.org/2martens/2martens.de)
[![Website Status](https://img.shields.io/website-up-down-green-red/:protocol(https|http)/:2martens.de.svg)](https://2martens.de)

This repository hosts my personal website. It is jekyll powered with all required
dependencies described in the Gemfile. If you wanted, you could create the very same
website with this repository that you can find under the official URL.

You can use it as a starting point for your own website. In the following I will describe
what you need to change to make it your own (minimal changes).

## Guest posts

If you want to contribute a post, feel free to submit a pull request with a post.
Make sure to add the value "author" with your name.

## Customization

- _config.yml: this contains the site configuration, update it to meet your needs
- _data/: this directory contains data files that allow for easy website changes
- _data/author.yml: this file describes the key values for the author (website owner),
  the values are also used to populate the CV page and the author sidebar box
- _data/footer-menu.yml: defines the footer menu
- _data/header-menu.yml: defines the header menu
- _data/notification.yml: defines the global configuration and if it is visible
- _data/promotion.yml: defines the promotion and if it is visible
- _data/cdn.yml: defines whether a CDN is used and what it's URL is
- _data/lazy-loading.yml: defines whether images are loaded lazily
- assets/: required static files
- assets/images/uberspace-badge-*.png: must be changed to accomodate your promotional image
- assets/images/brand.svg: must be changed to your brand image
- assets/pdf/cv.pdf: change for your CV in PDF format
- _posts/: delete and write your own posts
- _includes/: no need to touch, nothing hard-coded inside
- _includes/sidebar/: contains available sidebar boxes, 
  add files here and then you can already use the new sidebar box
- pages/: directory for pages, don't forget permalink variable for new pages,
  update every page but 404.html and cv.html to your situation
- index.html: you should probably update the text here
- .htaccess: remove the part that rewrites jim.2martens.de to 2martens.de

Beyond this no changes are absolutely necessary. No links are hard-coded in the pages,
layouts or include files beyond the technical dependencies.

The sidebar is configured via variables in the YAML front matter. By default the
author sidebar box is shown everywhere. You can customize this by adding the variable
``sidebarboxes`` to the front matter of a post, page or category. Then specify all
boxes you want to use by their file name without the extension in the order they 
should appear separated by a whitespace each. Look into existing pages for examples.

Without any new files other than posts, these categories are supported out of the box:

- speeches (appears under Speeches menu point)
- politics (appear under Politics menu point)
- politics G20 (appears both under Politics and Politics/G20 menu points)
- cs (appears under Computer Science menu point)
- blog (appears under Blog menu point)  
- site (appears on home page)

## Responsive images

If you want to include responsive images in posts, use the following:

```
{% include image.html alt="<your alt text>" link="<the relative link to the image>" %}
```

If you have enabled a CDN and are in a production environment (JEKYLL_ENV set to production)
the URL of the image will use the CDN. Otherwise it will be relative to the root directory
of the website. The advantage in this approach is quite obvious. If you want to change
the HTML of an image, you just need to change the image.html and the link to a potential CDN
only has to be changed in one location and not in potentially thousands of img tags or the 
markdown equivalent. The HTML provided by image.html automatically adds "img-fluid" to all
images which makes them responsive by using Bootstrap.

## Continuous Integration and Deployment

The .travis.yml file is already in a good state to use it for own needs. But you need
to update it to make it work for you. In the following I will list the absolute
minimal changes you need to do.

- scripts/deploy.sh: change martens7 to your Uberspace user 
  and wolf.uberspace.de to your host
- .travis.yml: update the known hosts for your Uberspace host, 
  update the before_deploy section (first dash)
- deploy_ed25519.enc: change to your encrypted SSH key

To understand how to prepare the SSH connection, follow this link:
https://oncletom.io/2016/travis-ssh-deploy/