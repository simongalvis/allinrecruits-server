const AdminsService = {
    getAllAdmins(knex){
        return knex.select('*').from('admins')
    },
    insertAdmin(knex, newAdmin) {
        return knex
          .insert(newAdmin)
          .into('admins')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
      },
    
      getById(knex, id) {
        return knex
          .from('admins')
          .select('*')
          .where('id', id)
          .first()
      },
    
      deleteAdmin(knex, id) {
        return knex('admins')
          .where({ id })
          .delete()
      },
    
      updateAdmin(knex, id, newAdminFields) {
        return knex('admins')
          .where({ id })
          .update(newAdminFields)
      }
    

}

module.exports = AdminsService;