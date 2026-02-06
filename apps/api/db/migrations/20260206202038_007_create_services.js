exports.up = function (knex) {
  return knex.schema.createTable("services", function (table) {
    table.bigIncrements("id").primary();

    table
      .bigInteger("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.string("service_code", 50).notNullable();
    table.string("name", 150).notNullable();
    table.text("description").nullable();

    table.decimal("base_price", 12, 2).notNullable().defaultTo(0.0);
    table.integer("duration_minutes").notNullable().defaultTo(30);

    table
      .enu("status", ["active", "inactive"], {
        useNative: false,
        enumName: "services_status_enum",
      })
      .notNullable()
      .defaultTo("active");

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.unique(["tenant_id", "service_code"], "uq_services_tenant_service_code");
    table.unique(["tenant_id", "name"], "uq_services_tenant_name");

    table.index(["tenant_id", "status"], "idx_services_tenant_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("services");
};
