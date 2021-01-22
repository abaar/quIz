module.exports = class User{
    constructor(id = null, name, username = null, password = null, token = null, active = true, subclass_id = null, class_id = null, school_id = null){
        this.id             = id
        this.name           = name
        this.username       = username
        this.password       = password 
        this.token          = token
        this.active         = true
        this.subclass_id    = subclass_id
        this.class_id       = class_id
        this.school_id      = school_id
    }
}