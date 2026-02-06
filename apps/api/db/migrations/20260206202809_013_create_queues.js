exports.up = function (knex) {
  return knex.schema.createTable("queues", function (table) {
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
      .bigInteger("branch_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("branches")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .bigInteger("appointment_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("appointments")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table
      .bigInteger("patient_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("patients")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.date("queue_date").notNullable();
    table.integer("queue_no").notNullable();

    table
      .enu("status", ["waiting", "in_consult", "done", "skipped", "cancelled"], {
        useNative: false,
        enumName: "queues_status_enum",
      })
      .notNullable()
      .defaultTo("waiting");

    table.dateTime("called_at").nullable();
    table.dateTime("served_at").nullable();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.unique(["branch_id", "queue_date", "queue_no"], "uq_queues_branch_date_no");
    table.index(["tenant_id", "branch_id", "queue_date", "status"], "idx_queues_main");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("queues");
};
