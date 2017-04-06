FROM node

ENV SOURCE_URL mysql://root:test@localhost/test
ENV QUERY stable

COPY . /code

WORKDIR /code

RUN npm install

ENTRYPOINT ["npm","start","--silent"]
