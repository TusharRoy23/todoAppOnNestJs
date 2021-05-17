# Image source
FROM node:lts

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ./package.json /app/

# Then install the NPM module
RUN npm install --verbose

RUN npm install --no-package-lock

# Copy current directory to APP folder
COPY . /app/

EXPOSE 3000
CMD ["npm", "run", "start:dev"]