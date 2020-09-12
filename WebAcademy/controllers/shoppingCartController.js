let db = require('../database/models');
const mailing = require('./helpers/mailerHelper');
const helper = require('./helpers/shoppingCartHelper');

const mp = require('mercadopago');

mp.configure({
    access_token: process.env.MP_ACCESS_TOKEN
  });

module.exports = {
    list: (req, res, next) => {
        db.Category.findAll({
            include: [{ association: 'courses' }]
        })
            .then(categories => {
                db.ShoppingCart.findOne({where: {user_id: req.session.loggedIn.id, status: 1}})
                    .then(cart => {
                        if(cart) {
                            db.CartCourse.findAll({where: {shopping_cart_id: cart.id}, include: [{ association: 'courses'}]})
                            .then(cart_courses => {
                                let final_price = 0;
                                
                                cart_courses.forEach(course => {
                                    final_price += Number(course.courses.price);
                                });

                                if(cart_courses.length == 0){
                                    res.render('shoppingCart', {categories, loggedInUser: req.session.loggedIn, courses: [], error: true, final_price})
                                } else {
                                    res.render('shoppingCart', {categories, loggedInUser: req.session.loggedIn, courses: cart_courses, error: false, final_price});
                                };
                            });
                        } else {
                            res.render('shoppingCart', {categories, loggedInUser: req.session.loggedIn, courses: [], error: true, final_price: 0})
                        };
                    });
            })
            .catch(err => res.json({msg: 'ERROR', err}));
    },
    create: (req, res, next) => {
        // BUSCO EL CARRITO ACTIVO DEL USUARIO
        db.ShoppingCart.findOne({where: {user_id: req.session.loggedIn.id, status: 1}})
        .then(cart => {
            if(!cart) {
                // SI NO HAY CARRITO, LO CREO Y AGREGO EL CURSO
                db.ShoppingCart.create({user_id: req.session.loggedIn.id})
                .then(cart => {
                    helper.create_course(cart.id, req.body.course_id, res)
                })
                .catch(err => res.json({msg: 'ERROR', err}));
            } else {
                // SI YA EXISTIA, AGREGO EL CURSO EN ESE SHOPPING CART
                helper.create_course(cart.id, req.body.course_id, res)
            };
        })
        .catch(err => res.json({msg: 'ERROR', err}));
    },
    destroy: (req, res, next) => {
        db.CartCourse.destroy({where: {id: req.params.cartCourseId}})
            .then(() => res.redirect('/shoppingCart'))
            .catch(err => res.json({msg: 'ERROR', err}));
    },
    purchase: (req, res, next) => {

        let preference = {
            items: [
              {
                title: 'Mi producto',
                unit_price: 100,
                quantity: 1,
              }
            ]
          };
          
          mp.preferences.create(preference)
          .then(function(response){
          // Este valor reemplazará el string "<%= global.id %>" en tu HTML
           // global.id = response.body.id;
           res.redirect(response.body.init_point)
            console.log(response);
          }).catch(function(error){
            console.log(error);
          });
        // db.User.findByPk(req.session.loggedIn.id)
        // .then(user => {
        //     db.ShoppingCart.findOne({where: {user_id: user.id, status: 1}})
        // .then(cart => {
        //     db.ShoppingCart.update({status: 0}, {where: {id: cart.id}})
        //     return cart;
        // })
        // .then(cart => {
        //     db.CartCourse.destroy({where: {shopping_cart_id: cart.id}})
        //     .then(() => {
        //     mailing.sendPurchaseEmail(user.email);
        //     res.redirect('/');
        //     });
        // })
        // .catch(err => res.json({msg: 'ERROR', err}));
        // });
    },
};