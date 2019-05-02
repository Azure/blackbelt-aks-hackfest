mongoimport --host localhost --db webratings --collection heroes --type json --file ./heroes.json --jsonArray
# Removing initial sample ratings to make it easier for students to see new ratings added.
#mongoimport --host localhost --db webratings --collection ratings --type json --file ./ratings.json --jsonArray
mongoimport --host localhost --db webratings --collection sites --type json --file ./sites.json --jsonArray