"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("audit_logs", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("actor_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
    table.string("action", 100).notNullable(); // e.g. CREATE_PATIENT

    table.string("entity_type", 80).notNullable(); // e.g. patients, invoices

    table.string("entity_id", 64).nullable(); // string for flexibility

    table.text("details_json").nullable(); // JSON string snapshot

    table.string("ip_address", 64).nullable();
    table.string("user_agent", 255).nullable();
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.index(["tenant_id", "created_at"], "idx_audit_tenant_created_at");
    table.index(["entity_type", "entity_id"], "idx_audit_entity");
    table.index(["actor_user_id"], "idx_audit_actor");
    table.index(["action"], "idx_audit_action");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("audit_logs");
};