# Relationship Mapping

**Author** Kris Sakarias

**Version** 1.0.0 

## Overview
This is a server built with the web framework Express. A House schema is modeled and a router is built with express that makes requests to endpoints. The server uses Mongoose to communicate with the database and fulfill the requests.

### Documentation
Starting the Server:

```
git clone https://github.com/kris71990/11-12-express

npm i

mongod

npm run test
```

The tests test performance of these requests:

1. A POST request to api/house
    - This request creates a new House with the information supplied by the user and saves it into the database with a reference id. A successful post will return the submitted JSON and a successful status. If the data cannot be posted, either due to incomplete information or internal error, an error is returned.

2. A GET request to api/house/:id
    - The get request requires an id number that is associated with a particular database entry. It uses that id number, finds, and returns the desired data. If the id number is not associated with anything in the database, a 404 error is returned.

3. A DELETE request to api/house/:id
    - The delete request also requires an id number. It finds the requested data and deletes the entry from the database, returning a success if successful and an error if the id is not found.

4. A PUT request to api/house/:id
    - The put request requires an id and uses mongoose to update the house with the given id. A 200 status and the updated json is returned upon success, and error on failure or if the id does not exist.