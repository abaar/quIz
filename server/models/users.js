module.exports = class User{
    constructor(id = null, name, username = null, password = null, token = null){
        this.id         = id
        this.name       = name
        this.username   = username
        this.password   = password 
        this.token      = token
    }
}