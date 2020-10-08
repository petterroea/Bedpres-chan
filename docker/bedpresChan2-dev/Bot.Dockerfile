FROM node:lts

WORKDIR /srv/bedpresChan

ENV NODE_ENV development

COPY ./startup.sh /srv/

ENTRYPOINT ["/srv/startup.sh"]

CMD ["yarn", "dev"]