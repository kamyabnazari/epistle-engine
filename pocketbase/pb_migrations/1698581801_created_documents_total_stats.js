migrate((db) => {
  const collection = new Collection({
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
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("je0l596w0o6gf22");

  return dao.deleteCollection(collection);
})
