exports.up = function (knex) {
  return knex.schema.createTable("doctor_branch_specializations", function (table) {
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
      .bigInteger("doctor_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("doctors")
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

    table
      .bigInteger("specialization_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("specializations")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.decimal("consultation_fee", 12, 2).nullable();

    table
      .enu("status", ["active", "inactive"], {
        useNative: false,
        enumName: "doctor_branch_specializations_status_enum",
      })
      .notNullable()
      .defaultTo("active");

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.unique(
      ["doctor_id", "branch_id", "specialization_id"],
      "uq_dbs_doctor_branch_specialization"
    );

    table.index(["tenant_id", "branch_id", "status"], "idx_dbs_tenant_branch_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("doctor_branch_specializations");
};
