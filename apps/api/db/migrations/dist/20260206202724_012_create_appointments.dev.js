"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("appointments", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("branch_id").unsigned().notNullable().references("id").inTable("branches").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("doctor_id").unsigned().notNullable().references("id").inTable("doctors").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("service_id").unsigned().nullable().references("id").inTable("services").onDelete("SET NULL").onUpdate("CASCADE");
    table.enu("appointment_type", ["onsite", "telemedicine"], {
      useNative: false,
      enumName: "appointments_type_enum"
    }).notNullable().defaultTo("onsite");
    table.dateTime("start_at").notNullable();
    table.dateTime("end_at").notNullable();
    table.enu("status", ["booked", "confirmed", "checked_in", "completed", "cancelled", "no_show"], {
      useNative: false,
      enumName: "appointments_status_enum"
    }).notNullable().defaultTo("booked");
    table.string("reason", 255).nullable();
    table.string("telemedicine_link", 255).nullable();
    table.bigInteger("created_by_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "branch_id", "start_at"], "idx_appt_tenant_branch_start");
    table.index(["doctor_id", "start_at"], "idx_appt_doctor_start");
    table.index(["patient_id", "start_at"], "idx_appt_patient_start");
    table.index(["status"], "idx_appt_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("appointments");
};