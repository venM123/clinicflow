async function seedBaseline(trx){
    await trx('tenants')
    .insert({
        id: 1,
        code: 'demo',
        name: 'ClinicFlow Demo Tenant',
        status: 1,
    }).onConflict('id')
    .merge();

    //branches
    await trx('branches')
    .insert({
        id: 1,
        tenant_id: 1,
        name: 'Main Branch',
        branch_code: 'main',
        status: 1,
    }).onConflict('id')
    .merge();

    //users
    await trx('users')
    .insert({
        id: 1,
    tenant_id: 1,
    email: 'admin@clinicflow.com',
    password_hash: 'TEMP_REPLACE_IN_3_4',
    first_name: 'Admin',
    last_name: 'User',
    role: 'super_admin',
    status: 1,
    }).onConflict('id')
    .merge();

}

exports.seed = async function seed(knex) {
  // deterministic seed orchestration goes here in Step 3.3

  await knex.transaction(async (trx) =>{
    await seedBaseline(trx);
  });
};
