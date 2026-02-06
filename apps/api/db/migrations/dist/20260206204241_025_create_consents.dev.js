"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("consents", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("encounter_id").unsigned().nullable().references("id").inTable("encounters").onDelete("SET NULL").onUpdate("CASCADE");
    table.string("consent_type", 80).notNullable(); // e.g. telemedicine, procedure, data_sharing

    table.text("consent_text").nullable();
    table.enu("status", ["granted", "revoked"], {
      useNative: false,
      enumName: "consents_status_enum"
    }).notNullable().defaultTo("granted");
    table.dateTime("signed_at").notNullable().defaultTo(knex.fn.now());
    table.string("signature_file_url", 255).nullable();
    table.bigInteger("witness_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "patient_id"], "idx_consents_tenant_patient");
    table.index(["consent_type", "status"], "idx_consents_type_status");
    table.index(["signed_at"], "idx_consents_signed_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("consents");
};