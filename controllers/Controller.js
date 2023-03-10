const formatRp = require("../helpers/helper")
const { User, Item, Category, UserItem } = require("../models/index")
class Controller {
    static home(req, res) {
        res.render('homePage')
    }
    static itemPageRender(req, res) {
        const id = req.params.userId

        User.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Item,
                    include: Category
                }
            ]
        })
            .then((data) => {
                res.render('item', { data, formatRp })
            })
            .catch((err) => {
                res.send(err)
            })

    }
    static addItemUser(req, res) {
        Category.findAll()
            .then((data) => {
                res.render('addItem', { data, formatRp })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static addItemUserHandler(req, res) {
        const userId = req.session.userId
        let item = {}
        const { name, description, imgUrl, CategoryId } = req.body
        // console.log(name, description, imgUrl, CategoryId)
        Item.create({ name, description, imgUrl, CategoryId })
            .then((data) => {
                item.item = data.id
                return UserItem.create({ ItemId: data.id, UserId: userId })
            })
            .then((data) => {
                item.useritem = data
                // res.send(item)
                res.redirect(`/user/${userId}/items`)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
    static editItem(req, res) {
        const userId = req.params.userId
        const itemId = req.params.itemId
        let item = {}
        Item.findOne({
            where:
            {
                id: itemId
            },
            include: Category
        })
            .then((data) => {
                item.data = data
                return Category.findAll()
            })
            .then((category) => {
                item.category = category
                res.render('editItem', { item, userId })
            })
            .catch((err) => {
                res.send(err)
            })

    }
    static editItemHandler(req, res) {
        const userId = req.params.userId
        const itemId = req.params.itemId
        const { name, description, imgUrl, CategoryId } = req.body
        // console.log(name, description, imgUrl, CategoryId)
        Item.update({
            name, description, imgUrl, CategoryId
        }, {
            where: {
                id: itemId
            }
        })
            .then(() => {
                res.redirect(`/user/${userId}/items`)
            })
            .catch((err) => {
                res.send(err)
            })
    }
    static deleteItem(req, res) {
        const userId = req.params.userId
        const itemId = req.params.itemId

        Item.destroy({
            where: {
                id: itemId
            }
        })
            .then(() => {
                res.redirect(`/user/${userId}/items`)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
    static approved(req, res) {
        const itemId = req.params.itemId
        Item.update({
            status: 'Approved'
        }, {
            where: {
                id: itemId
            }
        })
            .then(() => {
                res.redirect('/adminPages')
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static showProfile(req, res) {
        const userId = req.params.userI

    }
}

module.exports = Controller