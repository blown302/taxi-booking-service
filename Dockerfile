FROM node:carbon
COPY app app
COPY test test
ADD package.json .
RUN npm i
CMD ["npm", "start"]