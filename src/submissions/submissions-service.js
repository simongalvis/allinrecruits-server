const SubmissionsService = {
    getAllSubmissions(knex){
        return knex.select('*').from('submissions')
    },
    insertSubmission(knex, newSubmission) {
        return knex
          .insert(newSubmission)
          .into('submissions')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
      },
    
      getById(knex, id) {
        return knex
          .from('submissions')
          .select('*')
          .where('id', id)
          .first()
      },
    
      deleteSubmission(knex, id) {
        return knex('submissions')
          .where({ id })
          .delete()
      },
    
      updateSubmission(knex, id, newSubmissionFields) {
        return knex('submissions')
          .where({ id })
          .update(newSubmissionFields)
      }
    

}

module.exports = SubmissionsService;