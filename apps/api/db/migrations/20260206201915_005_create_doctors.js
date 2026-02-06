exports.up = function (knex) {
  return knex.schema.createTable("doctors", function (table) {
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
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.string("license_no", 80).notNullable();
    table.string("ptr_no", 80).nullable();
    table.string("s2_no", 80).nullable();
    table.string("signature_url", 255).nullable();
    table.boolean("is_telemedicine_enabled").notNullable().defaultTo(false);

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.dateTime("deleted_at").nullable();

    table.unique(["tenant_id", "user_id"], "uq_doctors_tenant_user");
    table.unique(["tenant_id", "license_no"], "uq_doctors_tenant_license");

    table.index(["tenant_id"], "idx_doctors_tenant");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("doctors");
};
