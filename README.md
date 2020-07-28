# Ramka v2 Express API Server

Features:

- upload files to the server
- create thumbnail
- read exif data
- calculate md5 hash of the files
- parse CS filename

Stack and tooling:

- express.js
- mongoDB & mongoose
- eslint
- prettier
- jest & supertest
- multer
- dotenv
- nodemon

## API documetation

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

**URL** : `/images/5f1ad600eb2d67505e03162e`

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

### Get not found message when passing wrong image \_id as request parameter

**Method** : `GET`

**URL** : `/images/666`

**Code** : `200 OK`

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

```
npm run dev
```

check eslint output:

```
npm run lint
```

## Scripts

reset database:

```
npm run resetdb
```

start server with reseted database:

```
npm run start-fresh
```

make server dirs (for first deploy)

```
npm run makedirs
```
