migrate((db) => {
  const collection = new Collection({
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
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4uw92ioynhexgcz");

  return dao.deleteCollection(collection);
})
