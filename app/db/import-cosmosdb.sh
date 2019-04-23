echo "Importing data into $MONGODB_URI ..."
mongoimport --uri $MONGODB_URI --collection heroes --type json --file ./heroes.json --jsonArray
mongoimport --uri $MONGODB_URI --collection ratings --type json --file ./ratings.json --jsonArray
mongoimport --uri $MONGODB_URI --collection sites --type json --file ./sites.json --jsonArray
echo "Completed import."