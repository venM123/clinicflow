exports.up = function (knex) {
  return knex.schema.createTable("prescription_items", function (table) {
    table.bigIncrements("id").primary();

    table
      .bigInteger("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .bigInteger("prescription_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("prescriptions")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.string("medication_name", 150).notNullable();
    table.string("form", 50).nullable();
    table.string("strength", 50).nullable();

    table.string("dose", 50).nullable();
    table.string("frequency", 80).nullable();
    table.integer("duration_days").nullable();

    table.decimal("quantity", 10, 2).nullable();
    table.string("instructions", 255).nullable();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.index(["tenant_id", "prescription_id"], "idx_rx_items_tenant_rx");
    table.index(["medication_name"], "idx_rx_items_medication_name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("prescription_items");
};
