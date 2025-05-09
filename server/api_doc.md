# Planorama API Documentation

## Public Site

## 1. GET /destinations

_Response (200 – OK)_

```json
[
 {
   "id": 1,
   "name": "Tokyo",
   "photoReference": "CnRnAAA...",
   "description": "Kota metropolitan modern di Jepang..."
 },
 ...
]
```

&nbsp;

## 2. GET /destinations/search?query=paris

_Response (200 – OK)_

```js
[
  {
    place_id: "string",
    name: "Paris",
    photo: "string",
    rating: 4.7,
    types: ["tourist_attraction"],
  },
];
```

&nbsp;

## 3. POST /login/google

_Request:_

- body

```json
{
  "credential": "string" // Google ID Token
}
```

_Response (200 – OK):_

```json
{
  "access_token": "string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

_Response (400 – Bad Request):_

```json
{
  "message": "Credential is required"
}
```

_Response (401 – Unauthorized):_

```json
{
  "message": "Invalid Google token"
}
```

&nbsp;

## 4. GET /destinations/:placeId

_Response (200 – OK):_

```json
{
  "name": "Eiffel Tower",
  "rating": 4.7,
  "photos": ["string"],
  "description": "Menara ikonik di Paris"
}
```

_Response (404 – Not Found):_

```json
{
  "message": "Destination not found"
}
```

&nbsp;

## 5. POST /ai/generate-trip

_Request:_

```json
{
  "city": "Tokyo",
  "start_date": "2025-05-10",
  "end_date": "2025-05-15"
}
```

_Response (200 – OK):_

```json
{
  "generated_plan": "Day 1: Tokyo Tower, Day 2: Shibuya...",
  "total_budget": 7500000
}
```

_Response (400 – Bad Request):_

```json
{
  "message": "Start date, end date, and city are required"
}
```

&nbsp;

## 7. POST /trips

_Request:_

```json
{
  "title": "Trip ke Jepang",
  "city": "Tokyo",
  "start_date": "2025-05-10",
  "end_date": "2025-05-15",
  "generated_plan": "string",
  "total_budget": 7500000
}
```

_Response (201 – Created):_

```json
{
  "message": "Trip created successfully",
  "tripId": 3
}
```

&nbsp;

## 8. GET /trips

_Response (200 – OK):_

```json
[
  {
    "id": 3,
    "title": "Trip ke Jepang",
    "start_date": "2025-05-10",
    "total_budget": 7500000
  }
]
```

&nbsp;

## 9. DELETE /trips/:id

_Response (200 – OK):_

```json
{
  "message": "Trip deleted"
}
```

_Response (404 – Not Found):_

```json
{
  "message": "Trip not found"
}
```

&nbsp;

## 10. POST /itineraries

_Request:_

```json
{
  "tripId": 3,
  "day": 1,
  "activity": "Kunjungi Tokyo Tower"
}
```

_Response (201 – Created):_

```json
{
  "message": "Itinerary added"
}
```

&nbsp;
