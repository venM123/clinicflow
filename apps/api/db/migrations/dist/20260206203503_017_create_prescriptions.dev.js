"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("prescriptions", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("encounter_id").unsigned().notNullable().references("id").inTable("encounters").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("doctor_id").unsigned().notNullable().references("id").inTable("doctors").onDelete("RESTRICT").onUpdate("CASCADE");
    table.text("notes").nullable();
    table.enu("status", ["draft", "issued", "cancelled"], {
      useNative: false,
      enumName: "prescriptions_status_enum"
    }).notNullable().defaultTo("issued");
    table.dateTime("issued_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "encounter_id"], "idx_rx_tenant_encounter");
    table.index(["doctor_id", "issued_at"], "idx_rx_doctor_issued_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("prescriptions");
};