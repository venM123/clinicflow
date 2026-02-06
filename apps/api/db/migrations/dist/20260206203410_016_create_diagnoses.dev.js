"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("diagnoses", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("encounter_id").unsigned().notNullable().references("id").inTable("encounters").onDelete("RESTRICT").onUpdate("CASCADE");
    table.string("icd10_code", 20).nullable();
    table.string("diagnosis_text", 255).notNullable();
    table.enu("diagnosis_type", ["primary", "secondary", "rule_out"], {
      useNative: false,
      enumName: "diagnoses_type_enum"
    }).notNullable().defaultTo("primary");
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "encounter_id"], "idx_diag_tenant_encounter");
    table.index(["icd10_code"], "idx_diag_icd10_code");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("diagnoses");
};