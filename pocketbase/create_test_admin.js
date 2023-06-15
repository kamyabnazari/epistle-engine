migrate(
  (db) => {
    const admin = new Admin();

    admin.email = "test@example.com";
    admin.setPassword("1234567890");

    return Dao(db).saveAdmin(admin);
  },
  (db) => {
    const dao = new Dao(db);

    const admin = dao.findAdminByEmail("test@example.com");

    return dao.deleteAdmin(admin);
  }
);
