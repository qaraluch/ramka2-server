# Ramka v2 Express API Server

## API documetation

### Upload multiple images on the server

**Method** : `POST`

**URL** : `/images`

**Code** : `200 OK`

example response:

```json
[
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
]
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
