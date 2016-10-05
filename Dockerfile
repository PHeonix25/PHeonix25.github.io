FROM starefossen/github-pages

COPY . /usr/src/app

# Install program to configure locales
RUN apt-get update 
RUN apt-get install -y locales
RUN dpkg-reconfigure locales && \
  locale-gen --purge C.UTF-8 && \
  /usr/sbin/update-locale LANG=C.UTF-8

# Install needed default locale for Makefly
RUN echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && locale-gen

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

EXPOSE 4000/tcp