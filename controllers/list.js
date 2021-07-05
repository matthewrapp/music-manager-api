const User = require('../models/user');
const Contact = require('../models/contact');
const Task = require('../models/task');
const task = require('../models/task');
const { update } = require('../models/user');

// CONTACT CONTROLLERS
exports.postCreateContact = (req, res, next) => {
     User.findById(req.user.userId)
        .then(user => {
            if (!user || user === null) {
                return res.status(400).json({
                    message: 'User doesn\'t exist or must have been deleted in the past. Please sign up.'
                })
            }
            return user
        })
         .then(user => {
             Contact.findOne({
                    email: req.body.email
                })
                 .then(contact => {
                    if (contact !== null) {
                        return res.status(400).json({
                            message: 'Contact already exists.'
                        })
                    }
                    const newContact = new Contact({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        channelName: req.body.channelName,
                        email: req.body.email,
                        type: req.body.type,
                        userId: user._id
                    });

                    newContact.save();
                    return res.status(200).json({
                        result: newContact
                    })
                 })
                 .catch(err => {
                    return res.status(500).json({
                        message: err
                    })
                })
             
        })
         .catch(err => {
             return res.status(500).json({
                message: err
            })
         })
}

exports.postDeleteContact = (req, res, next) => {
    if (!req.body.contactId) {
        return res.status(400).json({
            message: 'There is no contact. Please select the contact you want to delete.'
        })
    }

    Contact.findByIdAndDelete(req.body.contactId)
        .then(result => {
            if (result === null) {
                return res.status(400).json({
                    message: 'Contact already deleted.'
                })
            }

            return res.status(200).json({
                result: result
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}

exports.postUpdateContact = (req, res, next) => {
    User.findById(req.user.userId)
        .then(user => {
            if (!user || user === null) {
                return res.status(400).json({
                    message: 'User doesn\'t exist or must have been deleted in the past. Please sign up.'
                })
            }
            return user
        })
        .then(user => {
            Contact.findById(req.body.contactId)
                .then(contact => {
                    if (contact === null) {
                        return res.status(400).json({
                            message: 'Contact doesn\'t exist. Please create one.'
                        })
                    }

                    const contactToUpdate = contact;
                    // query through all the emails to make sure it doens't already exist
                    Contact.find({
                        email: req.body.email
                    })
                        .then(contact => {
                            // if there is a contact under the email the user wants to change the email too
                            if (contact.length !== 0) {
                                // if that email is the same as another email in the database under a difference contact, throw an err, if it's under the same contact, continue
                                if (contact[0].email !== contactToUpdate.email) {
                                    return res.status(400).json({
                                        message: 'Email already exists in the database under another contact.'
                                    })
                                }
                            }

                            contactToUpdate.firstName = req.body.firstName;
                            contactToUpdate.lastName = req.body.lastName;
                            contactToUpdate.channelName = req.body.channelName;
                            contactToUpdate.email = req.body.email;
                            contactToUpdate.type = req.body.type;
                            contactToUpdate.save();
                            return res.status(200).json({
                                result: contactToUpdate
                            })

                        })
                        .catch(err => {
                            return res.status(500).json({
                                message: err
                            })
                        })

                })
                .catch(err => {
                    return res.status(500).json({
                        message: err
                    })
                })
        })
}

exports.getAllContacts = (req, res, next) => {
    Contact.find({
        userId: req.user.userId
    })
    .then(contacts => {
        if (contacts.length === 0) {
            return res.status(400).json({
                message: 'There are no contacts. Please create one.'
            })
        }

        return res.status(200).json({
            result: contacts
        })    
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })    
    })
}

// TASK CONTROLLERS
exports.postCreateTask = (req, res, next) => {
     User.findById(req.user.userId)
        .then(user => {
            if (!user || user === null) {
                return res.status(400).json({
                    message: 'User doesn\'t exist or must have been deleted in the past. Please sign up.'
                })
            }
            return user
        })
         .then(user => {             
            const newTask = new Task({
                description: req.body.description,
                type: req.body.type,
                checked: req.body.checked,
                userId: user._id
            });

            newTask.save();
            return res.status(200).json({
                result: newTask
            })
        })
         .catch(err => {
             return res.status(500).json({
                message: err
            })
         })
}

exports.postDeleteTask = (req, res, next) => {
    if (!req.body.taskId) {
        return res.status(400).json({
            message: 'There is no task. Please select the task you want to delete.'
        })
    }

    Task.findByIdAndDelete(req.body.taskId)
        .then(result => {
            if (result === null) {
                return res.status(400).json({
                    message: 'Task already deleted.'
                })
            }

            return res.status(200).json({
                result: result
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}

exports.postUpdateChecked = (req, res, next) => {
    User.findById(req.user.userId)
        .then(user => {
            if (!user || user === null) {
                return res.status(400).json({
                    message: 'User doesn\'t exist or must have been deleted in the past. Please sign up.'
                })
            }
            return user
        })
        .then(user => {
            if (req.body.tasks !== undefined) {
                req.body.tasks.map(updatedTask => {
                    Task.findById(updatedTask.taskId)
                        .then(task => {
                            task.checked = updatedTask.checked;
                            task.save();
                            return task;
                        })
                        .catch(err => {
                            return res.status(500).json({
                                message: err
                            })
                        })
                });
            }

            if (req.body.contacts !== undefined) {
                req.body.contacts.map(updatedContact => {
                    Contact.findById(updatedContact.contactId)
                        .then(contact => {
                            contact.checked = updatedContact.checked;
                            contact.save();
                            return contact;
                        })
                        .catch(err => {
                            return res.status(500).json({
                                message: err
                            })
                        })
                })
            }
        })
        .then(result => {
            return res.status(200).json({
                message: 'Update Successfull.'
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}

exports.postUpdateTask = (req, res, next) => {
    User.findById(req.user.userId)
        .then(user => {
            if (!user || user === null) {
                return res.status(400).json({
                    message: 'User doesn\'t exist or must have been deleted in the past. Please sign up.'
                })
            }
            return user
        })
        .then(user => {
            Task.findById(req.body.taskId)
                .then(task => {
                    if (task === null) {
                        return res.status(400).json({
                            message: 'Task doesn\'t exist. Please create one.'
                        })
                    }
                    task.description = req.body.description;
                    task.type = req.body.type;
                    // task.checked = req.body.checked;
                    task.save();
                    return res.status(200).json({
                        result: task
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        message: err
                    })
                })
        })
}

exports.getAllTasks = (req, res, next) => {
    Task.find({
        userId: req.user.userId
    })
    .then(tasks => {
        if (tasks.length === 0) {
            return res.status(400).json({
                message: 'There are no tasks. Please create one.'
            })
        }

        return res.status(200).json({
            result: tasks
        })    
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })    
    })
}