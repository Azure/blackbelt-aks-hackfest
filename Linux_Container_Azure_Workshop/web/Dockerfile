FROM node:carbon

ARG VCS_REF
ARG BUILD_DATE
ARG IMAGE_TAG_REF

# Metadata
LABEL maintainer="brianisrunning@gmail.com"
LABEL org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.name="Ratings Web App" \
      org.label-schema.description="Simple node web app" \
      org.label-schema.vcs-url="https://github.com/chzbrgr71/steelthread" \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.docker.dockerfile="/rating-web/Dockerfile"

ENV GIT_SHA $VCS_REF
ENV IMAGE_BUILD_DATE $BUILD_DATE
ENV IMAGE_TAG $IMAGE_TAG_REF

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "staging" ]
