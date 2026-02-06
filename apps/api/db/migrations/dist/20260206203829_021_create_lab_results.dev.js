"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("lab_results", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("lab_order_id").unsigned().notNullable().references("id").inTable("lab_orders").onDelete("CASCADE").onUpdate("CASCADE");
    table.bigInteger("uploaded_by_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
    table.text("result_summary").nullable();
    table.string("file_url", 255).nullable();
    table["boolean"]("is_abnormal").notNullable().defaultTo(false);
    table.bigInteger("verified_by_doctor_id").unsigned().nullable().references("id").inTable("doctors").onDelete("SET NULL").onUpdate("CASCADE");
    table.dateTime("verified_at").nullable();
    table.dateTime("released_to_patient_at").nullable();
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.unique(["lab_order_id"], "uq_lab_results_lab_order");
    table.index(["tenant_id", "lab_order_id"], "idx_lab_results_tenant_order");
    table.index(["released_to_patient_at"], "idx_lab_results_released_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("lab_results");
};