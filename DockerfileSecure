FROM node:latest

# File Author / Maintainer
LABEL authors="Vincent Wang"

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# Fix CSL MLA labelling
RUN sed -i -e 's/\(<title-short>\).*\(<\/title-short>\)/<title-short>MLA 8<\/title-short>/g' csl/modern-language-association.csl
RUN sed -i -e 's/\(<title-short>\).*\(<\/title-short>\)/<title-short>MLA 7<\/title-short>/g' csl/modern-language-association-7th-edition.csl

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

# start command as per package.json
CMD ["npm", "start"]
