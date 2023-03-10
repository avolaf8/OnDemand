const express = require('express')
const Controller = require('./controllers/Controller')
const UserController = require('./controllers/UserController')
const app = express()
const session = require('express-session')
const port = 3000
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true // tambahan buat makin secure dari csrf attack
    }
}))

const isLoggedIn = function (req, res, next) {
    if (req.session.userId) {
        res.redirect('/user')
    } else {
        next()
    }
}
app.get('/register', isLoggedIn, UserController.registerRender)
app.post('/register', UserController.registerHandler)
app.get('/login', isLoggedIn, UserController.loginRender)
app.post('/login', UserController.loginHandler)
app.get('/logout', UserController.logout)

const isLogout = function (req, res, next) {
    // console.log(req.session)
    if (req.session.userId) {
        next()
    } else {
        const error = "Please login first"
        res.redirect(`/login?error=${error}`)
    }
}
const isAdmin = function (req, res, next) {
    if (req.session.role === 'Admin') {
        next()
    } else {
        const error = "You have no access to admin page"
        res.redirect(`/login?error=${error}`)
    }
}
const isUser = function (req, res, next) {
    if (req.session.role === 'user') {
        next()
    } else {

        res.redirect(`/adminPages`)
    }
}
app.get('/adminPages', isAdmin, UserController.adminPage)
app.get('/user/:userId/delete/:itemId', isAdmin, Controller.deleteItem)
app.get('/user/:itemId/status/approved', isAdmin, Controller.approved)


app.use(isLogout)
app.use(isUser)
app.get('/', Controller.home)
app.get('/user', UserController.userPage)
app.get('/user/add-items', Controller.addItemUser)
app.post('/user/add-items', Controller.addItemUserHandler)
app.get('/user/:userId/profile', Controller.showProfile)
app.get('/user/:userId/items', Controller.itemPageRender)
app.get('/user/:userId/edit/:itemId', Controller.editItem)
app.post('/user/:userId/edit/:itemId', Controller.editItemHandler)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})