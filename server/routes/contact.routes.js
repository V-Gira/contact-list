import express from 'express'
import contactCtrl from '../controllers/contact.controller'
import authCtrl from '../controllers/auth.controller'
//
const router = express.Router()

router.route('/api/contacts')
  .get(contactCtrl.list)
  .post(contactCtrl.create)

router.route('/api/contacts/:contactId')
  .get(authCtrl.requireSignin, contactCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, contactCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, contactCtrl.remove)

router.param('contactId', contactCtrl.contactByID)

export default router
