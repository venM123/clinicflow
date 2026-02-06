exports.up = function (knex) {
  return knex.schema.createTable("invoice_items", function (table) {
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
      .bigInteger("invoice_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("invoices")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.string("item_type", 40).notNullable(); // service | lab | medicine | misc
    table.string("description", 255).notNullable();

    table.decimal("unit_price", 12, 2).notNullable().defaultTo(0.0);
    table.decimal("quantity", 10, 2).notNullable().defaultTo(1.0);
    table.decimal("line_total", 12, 2).notNullable().defaultTo(0.0);

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.index(["tenant_id", "invoice_id"], "idx_invoice_items_tenant_invoice");
    table.index(["item_type"], "idx_invoice_items_type");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("invoice_items");
};
