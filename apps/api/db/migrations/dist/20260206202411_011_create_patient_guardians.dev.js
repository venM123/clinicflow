"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("patient_guardians", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("guardian_id").unsigned().notNullable().references("id").inTable("guardians").onDelete("RESTRICT").onUpdate("CASCADE");
    table["boolean"]("is_primary").notNullable().defaultTo(false);
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.unique(["patient_id", "guardian_id"], "uq_patient_guardians_patient_guardian");
    table.index(["tenant_id", "patient_id"], "idx_patient_guardians_tenant_patient");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("patient_guardians");
};