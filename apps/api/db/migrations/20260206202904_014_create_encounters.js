exports.up = function (knex) {
  return knex.schema.createTable("encounters", function (table) {
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
      .bigInteger("appointment_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("appointments")
      .onDelete("SET NULL")
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
      .bigInteger("patient_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("patients")
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
      .enu("visit_type", ["onsite", "telemedicine", "walkin"], {
        useNative: false,
        enumName: "encounters_visit_type_enum",
      })
      .notNullable();

    table.text("chief_complaint").nullable();
    table.text("soap_subjective").nullable();
    table.text("soap_objective").nullable();
    table.text("soap_assessment").nullable();
    table.text("soap_plan").nullable();

    table
      .enu("status", ["open", "closed", "signed"], {
        useNative: false,
        enumName: "encounters_status_enum",
      })
      .notNullable()
      .defaultTo("open");

    table.dateTime("started_at").notNullable();
    table.dateTime("ended_at").nullable();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.index(["tenant_id", "patient_id", "started_at"], "idx_enc_tenant_patient_started");
    table.index(["doctor_id", "started_at"], "idx_enc_doctor_started");
    table.index(["branch_id", "started_at"], "idx_enc_branch_started");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("encounters");
};
