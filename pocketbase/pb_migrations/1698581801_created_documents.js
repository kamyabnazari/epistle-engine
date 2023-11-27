migrate((db) => {
  const collection = new Collection({
    "id": "8iv79uqtsxbzb7i",
    "created": "2023-10-29 12:16:41.539Z",
    "updated": "2023-10-29 12:16:41.539Z",
    "name": "documents",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wril0oaf",
        "name": "owner",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "u24kgjzx",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "kcapcxkb",
        "name": "document",
        "type": "file",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 104857600,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "r04pmvga",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Created",
            "Uploaded"
          ]
        }
      },
      {
        "system": false,
        "id": "xjjs1yqp",
        "name": "page_count",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "e67iynho",
        "name": "word_count",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "4xrn6pah",
        "name": "classified_topic",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "gfcbrhw1",
        "name": "chat_history",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "owner.id = @request.auth.id",
    "viewRule": "owner.id = @request.auth.id",
    "createRule": "@request.auth.id != null",
    "updateRule": "owner.id = @request.auth.id",
    "deleteRule": "owner.id = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("8iv79uqtsxbzb7i");

  return dao.deleteCollection(collection);
})
