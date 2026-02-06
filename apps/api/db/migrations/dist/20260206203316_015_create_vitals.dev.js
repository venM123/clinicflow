"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("vitals", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("encounter_id").unsigned().notNullable().references("id").inTable("encounters").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("taken_by_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
    table.decimal("temperature_c", 5, 2).nullable();
    table.integer("heart_rate_bpm").nullable();
    table.integer("resp_rate_bpm").nullable();
    table.integer("systolic_mmHg").nullable();
    table.integer("diastolic_mmHg").nullable();
    table.integer("spo2_percent").nullable();
    table.decimal("height_cm", 6, 2).nullable();
    table.decimal("weight_kg", 6, 2).nullable();
    table.decimal("bmi", 6, 2).nullable();
    table.string("notes", 255).nullable();
    table.dateTime("recorded_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "encounter_id"], "idx_vitals_tenant_encounter");
    table.index(["recorded_at"], "idx_vitals_recorded_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("vitals");
};