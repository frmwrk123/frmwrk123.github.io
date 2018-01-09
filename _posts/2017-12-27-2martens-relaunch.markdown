---
layout: post
title:  "Relaunch of 2martens.de"
date:   2017-12-27 18:00:00 +0200
categories: site
---

A few weeks back I have read about the Public Beta of Uberspace 7. I was immediately
intrigued to know more and above everything else, to use it. Furthermore I always wanted
to create a proper hub of my online activity but never had the time to do it.
In April 2015 I started using GitHub Pages to publish my political pieces on my own
site and not on Facebook. It worked for over a year but never really felt good enough.

Especially after the introduction of Let's Encrypt and the inability of custom domain
names AND HTTPS with GitHub Pages for the foreseeable future, I came to the conclusion
that it was time to relaunch my web presence. In addition the previous inhabitant
of 2martens.de was the project website of the 2martens Web Platform. That was an
ambitious Symfony-based project intending to provide a ready to go base framework
for web applications (similar to the Woltlab Community Framework) but based on Symfony.
The concepting phase went good and I was convinced of the project, even announced it
to others. But the development stalled when I encountered the obstacle that PHP
didn't provide a decent standard way to install plugins into your application.  
While I still think that the idea of the project was and is promising I effectively
stopped development on the 2martens Web Platform. As a result the domain 2martens.de
was blocked but not actively and productively used. A shame when you consider that
the domain is No. 1 on Google search results for the term 2martens, which is my 
identification pretty much everywhere.

These facts made it very clear to me that the relaunched website shall be on 2martens.de
and on Uberspace 7 and therefore with HTTPS and HTTP/2.0 optimizations. Lastly I had
to find time to do it. The Christmas break offered the perfect opportunity and time
for the relaunch, especially considering what happened in my life between the end
of September and early December (see [Jahresabschluss 2017][0]). That way the relaunch
of the website would in addition to the mere technical aspects also resemble the
renewed spirit in my life.

[0]: {{ site.baseurl }}{% link _posts/2017-12-15-jahresabschluss.markdown %}

## Planning

With the backstory out of the way, let's start with the juicy technical details.
It was clear to me that the relaunched website should continue to use Jekyll
as static page generator. Furthermore I was dying to use Font Awesome 5, which 
I had backed during it's Kickstarter campaign. In addition I wanted to use the new
Bootstrap 4. 

Just like GitHub Pages the new website should build automatically upon push to the
GitHub repository. Hence a Continuous Integration and Deployment solution was required.
My Jenkins installation was somehow broken and TeamCity also didn't really work
on my virtual server. Therefore I thought about aquiring a better vServer.
Thankfully I encountered some information on the Jekyll documentation that pointed
my in the direction of Travis CI. I had used Travis CI before but never for
deployment.

In the week before Christmas I created mockups of the new website that depicted
how it should look - roughly. With that done, it was time to implement the
relaunch.

## Implementation

First I identified the features of the relaunched website based on the mockups.
These features were:

- header menu
- sub menu for some header menu items
- my image in the sidebar
- privacy-friendly embedded videos
- footer menu
- "action boxes" on the top right corner of the content
- Font Awesome 5 SVG icons
- recent blog posts

And as a kind of stretch goal, I came up with these:

- privacy-friendly events list
- privacy-friendly Twitter feed
- landing pages

I identified the following tasks in addition to the features:

- update layout
- recategorize existing posts

As it is usually with development, plans change. So did this plan as I was updating the layout. The first task
was feature parity with the GitHub pages site. This required a complete overhaul of the style approach to make the
site render properly again with Bootstrap 4. Once that was achieved, I started to implement the features one
by one and ended up with better features than thought of in advance.

Essentially I moved all hard-coded values into data files and made things as automagically as possible. Goal was of course
to minimize the maintenance requirements. Long story short I ended up doing the following. Dynamic doesn't mean on
runtime but data-driven on compile time.

- dynamic sidebar boxes

  1. all html files under ``_includes/sidebar/`` are picked up as sidebar boxes
  2. specify which boxes you want to appear in YAML front matter (order matters)

- dynamic header menu (2 levels deep): specify header menu in ``_data/header-menu.yml``
- dynamic footer menu: specify footer menu in ``_data/footer-menu.yml``
- dynamic notification: specify notification in ``_data/notification.yml``
- dynamic promotion in footer menu: specify image location, link, etc in ``_data/promotion.yml``
- concentrated all author information in ``_data/author.yml``; contains:
  - name
  - image of author
  - brand name
  - brand logo
  - age
  - location
  - link to CV pdf
  - link to CV page
  - email for job offers
  - email for job offers in spam proof
  - email for politics
  - email for politics in spam proof
  - GitHub username
  - Twitter username
  - list of publications
  - list of skills
  - list of education
  - list of politics experience
- home page that shows posts from category ``site``
- CV page that draws information from ``_data/author.yml``
- Speeches page that shows posts from category ``speeches``
- Politics page that shows posts from category ``politics``
- G20 sub page that shows posts from category ``G20``
- Blog page that shows posts from category ``blog``

This setup allows simple maintenance. New posts just have to be created in the
``_posts`` directory and appear automatically at the right location. All data can
be changed at a single location and doesn't have to be updated everywhere.

While I implemented the relaunch website I took extreme care to use almost no
JavaScript and minimize external requests. The result is that only Font Awesome 5
is using JavaScript to replace the span tags with SVGs. External requests as of now
only happen for Youtube videos. I took care to embed them by using the youtube-nocookie.com
domain to hopefully ensure that data about visitors to my page are not saved until
they click on the video to play it. All embedded videos are entirely optional and
not required to understand the post or page content.

The result of my efforts is a website that fulfills all my initially set criteria 
and doesn't lose any of the posts previously available. The README in the [repository][1] 
describes in detail the steps necessary to use my website as a starting point for your
own personal website. It also explains the deployment.

I am looking forward to a productive year 2018 and I'm happy that I will have a far
more potent website, hosted on Asteroids (Uberspace 7), available to support me. 

[1]: https://github.com/2martens/2martens.de/