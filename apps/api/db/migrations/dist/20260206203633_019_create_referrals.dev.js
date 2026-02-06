"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("referrals", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("encounter_id").unsigned().nullable().references("id").inTable("encounters").onDelete("SET NULL").onUpdate("CASCADE");
    table.bigInteger("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("from_branch_id").unsigned().notNullable().references("id").inTable("branches").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("to_branch_id").unsigned().notNullable().references("id").inTable("branches").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("from_doctor_id").unsigned().nullable().references("id").inTable("doctors").onDelete("SET NULL").onUpdate("CASCADE");
    table.bigInteger("to_doctor_id").unsigned().nullable().references("id").inTable("doctors").onDelete("SET NULL").onUpdate("CASCADE");
    table.text("reason").nullable();
    table.enu("urgency", ["routine", "urgent", "stat"], {
      useNative: false,
      enumName: "referrals_urgency_enum"
    }).notNullable().defaultTo("routine");
    table.enu("status", ["pending", "accepted", "completed", "rejected", "cancelled"], {
      useNative: false,
      enumName: "referrals_status_enum"
    }).notNullable().defaultTo("pending");
    table.dateTime("referred_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "patient_id"], "idx_ref_tenant_patient");
    table.index(["from_branch_id", "to_branch_id"], "idx_ref_from_to_branch");
    table.index(["status", "urgency"], "idx_ref_status_urgency");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("referrals");
};