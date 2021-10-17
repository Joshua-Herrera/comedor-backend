FROM node:16.8.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "--inspect=9229" , "start" ]