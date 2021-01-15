# Ramka v2 Express API Server

Features:

- upload files to the server
- create thumbnail
- read exif data
- calculate md5 hash of the files
- parse CS filename
- containerized database

Stack and tooling:

- express.js
- mongoDB & mongoose & mongo-express
- eslint
- prettier
- jest & supertest
- multer
- dotenv
- nodemon
- docker and docker-compose

## API documetation

### Get collections by name

**Method** : `GET`

**URL** : `/collections/:collectionName`

Default collection name: `all`.

**Code** : `200 OK`

```json
{
  "success": true,
  "data": {
    "images": [
      "5f2a634e589dd26ca7e78952",
      "5f2a634e589dd26ca7e78953",
      "5f2a634e589dd26ca7e78954",
      "5f2a634d589dd26ca7e78950"
    ],
    "_id": "5f2a634c589dd26ca7e7894f",
    "name": "all"
  }
}
```

In case wrong collection name you get response as follow:

```json
{
  "success": false,
  "message": "Not found in the DB collection with name: pierogi"
}
```

### Get all image info form DB

**Method** : `GET`

**URL** : `/images`

**Code** : `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "5f1ad600eb2d67505e03162e"
    },
    {},
    {}
  ]
}
```

### Get image info form DB by passing image \_id as request parameter

**Method** : `GET`

**URL** : `/images/:imageId`

**Code** : `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "5f1ad600eb2d67505e03162e"
    }
  ]
}
```

In case wrong id you get response as follow:

```json
{
  "success": false,
  "message": "Not found in the DB image with _id: 666"
}
```

### Upload multiple images on the server

**Method** : `POST`

**URL** : `/images`

**Code** : `200 OK`

example response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "5f1ad600eb2d67505e03162e",
      "imageUploadTimeStamp": "1595594240641",
      "imageUploadTimeStampISO": "2020-07-24T14:37:20.641Z",
      "imageOriginalName": "image-walczak-thesame.jpg",
      "imageFileName": "2d631774-784d-45a6-9de9-1e9b109e3b4f",
      "imageServerPath": "public/2d631774-784d-45a6-9de9-1e9b109e3b4f",
      "imageMimeType": "image/jpeg",
      "imageSize": 46898,
      "__v": 0
    }
  ]
}
```

## Setup

```
npm install
```

## Test

```
npm test
```

## Development

Spawn contenerized instance of the server app:

```
docker-compose up -d
```

First time server setup:

1. Seed db:

```
docker-compose up -d
docker-compose exec server bash
npm run resetdb
exit
```

2. Send example images to the server:

Warn: run below npm command from host shell.
It uses REST's POST method to send data.

```
npm run postimages
```

3. Turn on/off server for development:

```
docker-compose stop
docker-compose start
```

3. Remove app containers entirely:

```
docker-compose down -v
```

### Check eslint output:

```
npm run lint
```

Docker-compose also spawns mongo-express container
to be able to check out db's records during development process
(no need of MongoDB Compass app).
This service is exposed on port: `8081`.

## Scripts

To reset database:

```
npm run resetdb
```

To start server with reseted database:

```
npm run start:fresh
```

Import images from local dir to the server
define source dir and server url end point in .env file as variabe:

```.env
POST_IMAGES_SOURCE=
POST_IMAGES_DESTINATION_URL=
```

and run command:

```
npm run postimages
```
