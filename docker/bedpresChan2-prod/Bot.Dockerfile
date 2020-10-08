FROM node:lts

COPY ./bedpresChan /srv/bedpresChan

RUN cd /srv/bedpresChan && yarn install && yarn tsc

FROM node:lts

COPY --from=0 /srv/bedpresChan /srv/bedpresChan

RUN rm -r /srv/bedpresChan/node_modules && rm -r /srv/bedpresChan/src && cp -r /srv/bedpresChan/build/* /srv/bedpresChan/ && rm -r /srv/bedpresChan/build

WORKDIR /srv/bedpresChan 

RUN yarn install --production && yarn cache clean

COPY ./docker/bedpresChan2-prod/startup.sh /srv/startup.sh

RUN ls -l && cat ../startup.sh

ENTRYPOINT ["/srv/startup.sh"]

CMD ["yarn", "node", "index.js"]

