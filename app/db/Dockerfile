FROM mongo:3.6.1-jessie

COPY ./heroes.json /heroes.json
COPY ./ratings.json /ratings.json
COPY ./sites.json /sites.json
COPY ./import.sh /import.sh
COPY ./import-cosmosdb.sh /import-cosmosdb.sh

EXPOSE 27017
