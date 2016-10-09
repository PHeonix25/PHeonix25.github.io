FROM starefossen/github-pages
COPY . /usr/src/app
ENV LC_ALL C.UTF-8

## -- OR -- ##

# FROM jekyll/jekyll:pages
# VOLUME /srv/jekyll
# RUN chown -R jekyll:jekyll /srv/jekyll

EXPOSE 4000/tcp