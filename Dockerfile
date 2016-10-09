FROM starefossen/github-pages

COPY . /usr/src/app

# Install program to configure locales
# RUN apt-get update 
# RUN apt-get install -y locales
# RUN locale-gen --purge C.UTF-8
# RUN /usr/sbin/update-locale LANG=C.UTF-8

# Set default locale for the environment
ENV LC_ALL C.UTF-8
# ENV LANG en_US.UTF-8
# ENV LANGUAGE en_US.UTF-8

EXPOSE 4000/tcp