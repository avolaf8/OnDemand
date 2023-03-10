const { User, Item, UserItem } = require("../models/index")
const bcrypt = require("bcryptjs")
class UserController {
    static registerRender(req, res) {
        const error = req.query.error
        res.render('auth-pages/register', { error })
    }
    static registerHandler(req, res) {
        const { username, email, password, role } = req.body
        User.create({ username, email, password, role })
            .then(() => {
                res.redirect('login')
            })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    const errors = err.errors.map((el) => {
                        return el.message
                    })
                    res.redirect(`/register?error=${errors}`)
                } else if (err.name === "SequelizeUniqueConstraintError") {
                    const errorEmail = err.errors.map((el) => {
                        return el.message
                    })
                    res.redirect(`/register?error=${errorEmail}`)
                } else {

                    res.send(err)
                }
            })

    }
    static loginRender(req, res) {
        const error = req.query.error
        res.render('auth-pages/login', { error })
    }

    static loginHandler(req, res) {
        const { email, password } = req.body
        console.log(email, password)
        User.findOne({
            where: {
                email
            }
        })
            .then((user) => {
                if (user) {
                    const isValidPass = bcrypt.compareSync(password, user.password)
                    if (isValidPass) {
                        req.session.userId = user.id
                        req.session.role = user.role
                        if (user.role === 'Admin') {
                            return res.redirect('/adminPages')
                        } else {

                            return res.redirect('/user')
                        }
                    } else {
                        const error = `Invalid username/password`
                        return res.redirect(`/login?error=${error}`)
                    }
                } else {
                    const error = "Invalid username/password"
                    return res.redirect(`/login?error=${error}`)
                }
            })
            .catch((err) => {
                res.send(err)
            })
    }
    static userPage(req, res) {
        User.findOne()
            .then((data) => {
                res.render('userPage', { data })

            })
            .catch((err) => {
                res.send(err)
            })
    }

    static adminPage(req, res) {
        UserItem.findAll({
            include: [Item, {
                model: User,
                attributes: {
                    exclude: ['password']
                }
            }]
        })
            .then((data) => {
                // res.send(data)
                res.render('admin-pages/dashboard', { data })
            })
            .catch((err) => {
                res.send(err)
            })
    }
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/login')
            }
        })

    }
}

module.exports = UserController