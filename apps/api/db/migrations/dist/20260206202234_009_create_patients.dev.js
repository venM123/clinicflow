"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("patients", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.string("patient_no", 40).notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("middle_name", 100).nullable();
    table.date("birth_date").notNullable();
    table.enu("sex", ["male", "female", "other"], {
      useNative: false,
      enumName: "patients_sex_enum"
    }).notNullable();
    table.enu("civil_status", ["single", "married", "widowed", "separated", "other"], {
      useNative: false,
      enumName: "patients_civil_status_enum"
    }).nullable();
    table.string("mobile", 30).nullable();
    table.string("email", 150).nullable();
    table.string("address_line1", 200).nullable();
    table.string("address_line2", 200).nullable();
    table.string("city", 100).nullable();
    table.string("province", 100).nullable();
    table.string("blood_type", 5).nullable();
    table.text("allergies").nullable();
    table.enu("status", ["active", "inactive", "deceased"], {
      useNative: false,
      enumName: "patients_status_enum"
    }).notNullable().defaultTo("active");
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.dateTime("deleted_at").nullable();
    table.unique(["tenant_id", "patient_no"], "uq_patients_tenant_patient_no");
    table.index(["tenant_id", "last_name", "first_name"], "idx_patients_tenant_name");
    table.index(["birth_date"], "idx_patients_birth_date");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("patients");
};