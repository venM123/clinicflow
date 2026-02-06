exports.up = function (knex) {
  return knex.schema.createTable("specializations", function (table) {
    table.bigIncrements("id").primary();

    table
      .bigInteger("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.string("name", 120).notNullable();
    table.string("description", 255).nullable();

    table
      .enu("status", ["active", "inactive"], {
        useNative: false,
        enumName: "specializations_status_enum",
      })
      .notNullable()
      .defaultTo("active");

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.unique(["tenant_id", "name"], "uq_specializations_tenant_name");
    table.index(["tenant_id", "status"], "idx_specializations_tenant_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("specializations");
};
