migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2023-10-29 12:15:56.691Z",
      "updated": "2023-10-29 12:16:41.532Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
          "name": "name",
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
          "id": "users_avatar",
          "name": "avatar",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ],
            "thumbs": null,
            "protected": false
          }
        }
      ],
      "indexes": [],
      "listRule": "id = @request.auth.id",
      "viewRule": "id = @request.auth.id",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id",
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "requireEmail": false
      }
    },
    {
      "id": "4uw92ioynhexgcz",
      "created": "2023-10-29 12:16:41.535Z",
      "updated": "2023-10-29 12:16:41.579Z",
      "name": "documents_stats",
      "type": "view",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "khvalogk",
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
          "id": "5jxamune",
          "name": "total_pages",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "2vngsmd9",
          "name": "total_words",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "hqdbenzo",
          "name": "total_documents",
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
          "id": "die9kkzz",
          "name": "total_uploaded",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "6mmva5ol",
          "name": "total_created",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "hhexp9zs",
          "name": "min_created_date",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "6q5bhvdy",
          "name": "max_created_date",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        }
      ],
      "indexes": [],
      "listRule": "owner.id = @request.auth.id",
      "viewRule": "owner.id = @request.auth.id",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {
        "query": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    documents.owner AS owner,\n    SUM(page_count) AS total_pages,\n    SUM(word_count) AS total_words,\n    COUNT(*) AS total_documents,\n    SUM(CASE WHEN type = 'Uploaded' THEN 1 ELSE 0 END) AS total_uploaded,\n    SUM(CASE WHEN type = 'Created' THEN 1 ELSE 0 END) AS total_created,\n  MIN(created) AS min_created_date,\n  MAX(created) AS max_created_date\nFROM documents\nGROUP BY owner\n"
      }
    },
    {
      "id": "je0l596w0o6gf22",
      "created": "2023-10-29 12:16:41.538Z",
      "updated": "2023-10-29 12:16:41.587Z",
      "name": "documents_total_stats",
      "type": "view",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "uarsmx0s",
          "name": "total_documents",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "bivu8nw5",
          "name": "total_created",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        }
      ],
      "indexes": [],
      "listRule": "",
      "viewRule": "",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {
        "query": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    SUM(total_documents) AS total_documents,\n    SUM(total_created) AS total_created\nFROM documents_stats\n"
      }
    },
    {
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
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
