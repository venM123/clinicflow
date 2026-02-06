"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("lab_orders", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("encounter_id").unsigned().nullable().references("id").inTable("encounters").onDelete("SET NULL").onUpdate("CASCADE");
    table.bigInteger("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("ordered_by_doctor_id").unsigned().notNullable().references("id").inTable("doctors").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("branch_id").unsigned().notNullable().references("id").inTable("branches").onDelete("RESTRICT").onUpdate("CASCADE");
    table.string("test_name", 150).notNullable();
    table.string("test_code", 60).nullable();
    table.enu("priority", ["routine", "urgent", "stat"], {
      useNative: false,
      enumName: "lab_orders_priority_enum"
    }).notNullable().defaultTo("routine");
    table.enu("status", ["ordered", "collected", "processing", "completed", "cancelled"], {
      useNative: false,
      enumName: "lab_orders_status_enum"
    }).notNullable().defaultTo("ordered");
    table.dateTime("ordered_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "patient_id"], "idx_lab_orders_tenant_patient");
    table.index(["branch_id", "ordered_at"], "idx_lab_orders_branch_ordered_at");
    table.index(["status", "priority"], "idx_lab_orders_status_priority");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("lab_orders");
};