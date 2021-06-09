import Contact from '../models/contact.model';
import extend from 'lodash/extend';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => {
  const contact = new Contact(req.body);
  try {
    await contact.save();
    return res.status(200).json({
      message: 'New contact created!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * Load contact and append to req.
 */
const contactByID = async (req, res, next, id) => {
  try {
    let contact = await Contact.findById(id);
    if (!contact)
      return res.status('400').json({
        error: 'Contact not found',
      });
    req.profile = contact;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve contact',
    });
  }
};

const read = (req, res) => {
  return res.json(req.profile);
};

const list = async (req, res) => {
  try {
    let contacts = await Contact.find().select('name email updated created');
    res.json(contacts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  try {
    let contact = req.profile;
    contact = extend(contact, req.body);
    contact.updated = Date.now();
    await contact.save();
    contact.hashed_password = undefined;
    contact.salt = undefined;
    res.json(contact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let contact = req.profile;
    let deletedcontact = await contact.remove();
    deletedcontact.hashed_password = undefined;
    deletedcontact.salt = undefined;
    res.json(deletedcontact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  contactByID,
  read,
  list,
  remove,
  update,
};
