# Personal Website

[![Build Status](https://travis-ci.org/2martens/2martens.github.io.png?branch=2.0)](https://travis-ci.org/2martens/2martens.github.io)

This repository hosts my personal website. It is jekyll powered with all required
dependencies described in the Gemfile. If you wanted, you could create the very same
website with this repository that you can find under the official URL.

You can use it as a starting point for your own website. In the following I will describe
what you need to change to make it your own (minimal changes).

## Customization

- _config.yml: this contains the site configuration, update it to meet your needs
- _data/: this directory contains data files that allow for easy website changes
- _data/author.yml: this file describes the key values for the author (website owner),
  the values are also used to populate the CV page and the author sidebar box
- _data/footer-menu.yml: defines the footer menu
- _data/header-menu.yml: defines the header menu
- _data/notification.yml: defines the global configuration and if it is visible
- _data/promotion.yml: defines the promotion and if it is visible
- assets/: required static files
- assets/images/uberspace-badge-*.png: must be changed to accomodate your promotional image
- assets/images/brand.svg: must be changed to your brand image
- assets/pdf/cv.pdf: change for your CV in PDF format
- _posts/: delete and write your own posts

Beyond this no changes are absolutely necessary. No links are hard-coded in the pages,
layouts or include files beyond the technical dependencies.
