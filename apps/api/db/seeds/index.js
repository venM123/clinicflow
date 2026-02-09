async function seedBaseline(trx){

}

exports.seed = async function seed(knex) {
  // deterministic seed orchestration goes here in Step 3.3

  await knex.transaction(async (trx) =>{
    await seedBaseline(trx);
  });
};
