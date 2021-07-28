const User = require('../models/user');
const Contact = require('../models/contact');
const Task = require('../models/task');
const Campaign = require('../models/campaign');
const campaign = require('../models/campaign');
const task = require('../models/task');

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
                 .then(async contact => {
                    if (contact !== null) {
                        return res.status(400).json({
                            message: 'Contact already exists.'
                        })
                    }
                    const allCampaigns = await Campaign.find();
                    const newContact = new Contact({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        channelName: req.body.channelName,
                        email: req.body.email,
                        type: req.body.type,
                        userId: user._id
                    });

                    newContact.save()
                        .then(contact => {
                            allCampaigns.forEach(campaign => {
                                campaign.contacts.push({
                                    contactId: contact._id,
                                    checked: false
                                })
                                campaign.save();
                            })
                            return
                        })
                        .catch(err => {
                            return res.status(400).json({
                                message: err
                            })
                        })
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

exports.postDeleteContact = async (req, res, next) => {
    if (!req.body.contactId) {
        return res.status(400).json({
            message: 'There is no contact. Please select the contact you want to delete.'
        })
    }
    
    const contactToDelete = await Contact.findById(req.body.contactId);
    Campaign.find()
        .then(campaigns => {
            if (campaigns === null) {
                return res.status(400).json({
                    message: 'No campaigns. Please create one.'
                })
            }

            // delete reference of contact within the campaign
            return campaigns.map(campaign => {
                return campaign.contacts.find((contact, index) => {
                    if (contact.contactId == req.body.contactId) {
                        campaign.contacts.splice(index, 1);
                        campaign.save();
                        return contact
                    }
                })
            })
        })
        .then(contact => {
            contactToDelete.remove(err => {
                if (!err) {
                    return res.status(200).json({
                        result: 'Success'
                    })
                } else {
                    return res.status(400).json({
                        message: err
                    })
                }
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
         .then(async user => {             
            const newTask = new Task({
                description: req.body.description,
                type: req.body.type,
                checked: req.body.checked,
                userId: user._id
            });
            const allCampaigns = await Campaign.find();
            newTask.save()
                .then(task => {
                    allCampaigns.forEach(campaign => {
                        campaign.tasks.push({
                            taskId: task._id,
                            checked: false
                        })
                        campaign.save();
                    })
                    return
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err
                    })
                })
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

exports.postDeleteTask = async (req, res, next) => {
    if (!req.body.taskId) {
        return res.status(400).json({
            message: 'There is no task. Please select the task you want to delete.'
        })
    }
    const taskToDelete = await Task.findById(req.body.taskId);

    Campaign.find()
        .then(campaigns => {
            if (campaigns === null) {
                return res.status(400).json({
                    message: 'No campaigns. Please create one.'
                })
            }
            // delete reference of task within the campaign
            return campaigns.map(campaign => {
                return campaign.tasks.find((task, index) => {
                    if (task.taskId == req.body.taskId) {
                        campaign.tasks.splice(index, 1);
                        campaign.save();
                        return task
                    }
                })
            })

        })
        .then(task => {
            taskToDelete.remove(err => {
                if (!err) {
                    return res.status(200).json({
                        result: 'Success'
                    })
                } else {
                    return res.status(400).json({
                        message: err
                    })
                }
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