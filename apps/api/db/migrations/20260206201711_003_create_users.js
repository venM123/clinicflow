exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.bigIncrements("id").primary();

    table
      .bigInteger("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.string("employee_no", 40).nullable();

    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("middle_name", 100).nullable();

    table.string("email", 150).notNullable();
    table.string("mobile", 30).nullable();

    table.string("password_hash", 255).notNullable();

    table
      .enu(
        "role",
        [
          "super_admin",
          "branch_admin",
          "doctor",
          "nurse",
          "receptionist",
          "cashier",
          "lab_tech",
          "pharmacist",
        ],
        { useNative: false, enumName: "users_role_enum" }
      )
      .notNullable();

    table
      .enu("status", ["active", "inactive", "locked"], {
        useNative: false,
        enumName: "users_status_enum",
      })
      .notNullable()
      .defaultTo("active");

    table.dateTime("last_login_at").nullable();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.dateTime("deleted_at").nullable();

    table.unique(["tenant_id", "email"], "uq_users_tenant_email");
    table.unique(["tenant_id", "employee_no"], "uq_users_tenant_employee_no");

    table.index(["tenant_id", "role", "status"], "idx_users_tenant_role_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
