exports.up = function (knex) {
  return knex.schema.createTable("user_branch_assignments", function (table) {
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

    table
      .bigInteger("branch_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("branches")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.boolean("is_primary").notNullable().defaultTo(false);

    table
      .enu("status", ["active", "inactive"], {
        useNative: false,
        enumName: "user_branch_assignments_status_enum",
      })
      .notNullable()
      .defaultTo("active");

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.unique(["user_id", "branch_id"], "uq_user_branch_assignments_user_branch");
    table.index(["tenant_id", "branch_id", "status"], "idx_uba_tenant_branch_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_branch_assignments");
};
