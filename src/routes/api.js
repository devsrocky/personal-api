const express = require('express')
const router = express.Router()

// Auth-verfiy controller
const AuthVerification = require('../middleware/AuthVerification')

// Controllers
const ThemeController = require('../controller/Theme/ThemeController')
const UserController = require('../controller/user/userController')
const ReviewController = require('../controller/review/ReviewController')
const appointmentController = require('../controller/appointment/appointmentController')
const RowWorckController = require('../controller/RowWork/RowWorckController')
const orderController = require('../controller/order/orderController')
const DeliveryController = require('../controller/delivery/deliveryController')
const BuyersController = require('../controller/Buyers/BuyersController')
const SiteStaticsController = require('../controller/statistics/SiteStaticsController')
const ColorController = require('../controller/other/othersController')
const ChatController = require('../controller/chat/ChatController')

// Local path
router.post('/CreateHeroContent', AuthVerification, ThemeController.CreateHeroContent)
router.post('/updateHeroContent/:id', AuthVerification, ThemeController.updateHeroContent)
router.get('/listHeroContent/:pageNo/:perPage/:keyword', AuthVerification, ThemeController.listHeroContent)
router.get('/HeroContentDetails/:id', ThemeController.HeroContentDetails)
router.get('/deleteHeroContent/:DeleteId',AuthVerification, ThemeController.deleteHeroContent)



router.post('/CreateNiche', AuthVerification, ThemeController.CreateNiche)
router.post('/updateNiche/:id', AuthVerification, ThemeController.updateNiche)
router.get('/listNiches/:pageNo/:perPage/:keyword', ThemeController.listNiches)
router.get('/deleteNich/:DeleteId', AuthVerification, ThemeController.deleteNich)
router.get('/NicheDetails/:id', AuthVerification, ThemeController.NicheDetails)

router.post('/CreatePortfolio', AuthVerification, ThemeController.CreatePortfolio)
router.post('/updatePortfolio/:id', AuthVerification, ThemeController.updatePortfolio)
router.get('/listPortfolio/:pageNo/:PerPage/:keyword', ThemeController.listPortfolio)
router.get('/portfolioListByNiche/:tablink', ThemeController.listByNiche)
router.get('/deletePortfolio/:DeleteId',AuthVerification, ThemeController.deletePortfolio)
router.get('/PortfolioDetails/:id', ThemeController.PortfolioDetails)



// Reviews path
router.post('/CreateReview', AuthVerification, ReviewController.CreateReview)
router.post('/updateReview/:id', AuthVerification, ReviewController.updateReview)
router.get('/listOfReview/:pageNo/:PerPage/:keyword', ReviewController.listOfReview)
router.get('/reviewListByNich/:tablink', ReviewController.reviewListByNich)
router.get('/DeleteReview/:DeleteId', AuthVerification, ReviewController.DeleteReview)
router.get('/reviewDetailsById/:ReviewId', ReviewController.reviewDetailsById)



// Appointment path
router.post('/CreateAppointment', appointmentController.CreateAppointment)
router.post('/updateAppointment/:id', AuthVerification, appointmentController.updateAppointment)
router.get('/ListOfAppointment/:pageNo/:perPage/:keyword', AuthVerification, appointmentController.ListOfAppointment)
router.get('/deleteAppointment/:DeleteId', AuthVerification, appointmentController.deleteAppointment)
router.get('/AppointmentsByStatus/:status', AuthVerification, appointmentController.AppointmentsByStatus)
router.get('/AppointmentDetailsById/:id', AuthVerification, appointmentController.AppointmentDetailsById)


// user path
router.post('/userRegistration', UserController.userRegistration)
router.get('/userEmailVerification/:email', UserController.userEmailVerification)
router.post('/userProfileVerification/:email/:otp', UserController.userProfileVerification)
router.get('/userList/:pageNo/:perPage/:keyword', UserController.userList)
router.get('/userListByRole/:RoleText', UserController.userListByRole)
router.get('/UserDetailsById/:id', UserController.UserDetailsById)
router.post('/userUpdateByAdmin/:id', AuthVerification, UserController.userUpdateByAdmin)
router.get('/deleteUserAccount/:DeleteId', AuthVerification, UserController.deleteUserAccount)


// Buyers
router.get('/buyerList/:Keyword', BuyersController.buyerList)

router.post('/userPassReset/:email/:otp', UserController.userPassReset)
router.post('/userLogin', UserController.userLogin)
router.post('/userUpdate', AuthVerification, UserController.userUpdate)
router.get('/userProfileDetails',AuthVerification,  UserController.userProfileDetails)




// RowWork path
router.post('/createrowWordk', AuthVerification, RowWorckController.createrowWordk)
router.post('/updaterowWork/:id', AuthVerification, RowWorckController.updaterowWork)
router.get('/RowWorkList/:pageNo/:PerPage/:keyword', RowWorckController.RowWorkList)
router.get('/deleteRowWork/:DeleteId', AuthVerification, RowWorckController.deleteRowWork)
router.get('/rowWorkDetails/:id', RowWorckController.rowWorkDetails)

// Order path
router.post('/createOrder', AuthVerification, orderController.createOrder)
router.post('/updateOrder/:id', AuthVerification, orderController.updateOrder)
router.get('/ProgressOrderList', AuthVerification, orderController.ProgressOrderList)

router.post('/orderAcceptByBuyer/:OrderId/:UserId', orderController.orderAcceptByBuyer)


router.get('/OrderList/:pageNo/:PerPage/:keyword', orderController.OrderList)
router.get('/OrderListByStatus/:StatusTXT', orderController.OrderListByStatus)
router.get('/deleteOrder/:DeleteId', AuthVerification, orderController.deleteOrder)
router.get('/orderListByUser', AuthVerification, orderController.orderListByUser)
router.get('/orderDetails/:OrderId', AuthVerification, orderController.orderDetails)

// Delivery path
router.post('/createDelivery', AuthVerification, DeliveryController.createDelivery)
router.post('/updateDelivery/:id', AuthVerification, DeliveryController.updateDelivery)
router.get('/listOfDelivery/:pageNo/:PerPage/:keyword', AuthVerification, DeliveryController.listOfDelivery)
router.get('/DeliveryListByStatus/:status', DeliveryController.DeliveryListByStatus)
router.get('/deleteDelivery/:DeleteId', AuthVerification, DeliveryController.deleteDelivery)

router.get('/DeliveryListByUser', AuthVerification, DeliveryController.DeliveryListByUser)
router.post('/acceptDeliveryByBuyer/:DeliveryId/:UserId', DeliveryController.acceptDeliveryByBuyer)


// Dashboard routes
router.post('/SiteVisitor/:map',SiteStaticsController.SiteVisitor)
router.get('/SiteVisitorCountList',SiteStaticsController.SiteVisitorCountList)

// Others routes
router.post('/CreateChat',AuthVerification, ChatController.CreateChat)
router.get('/ChatListByClient',AuthVerification, ChatController.ChatListByClient)
router.get('/ChatListByAdmin/:ClientId',AuthVerification, ChatController.ChatListByAdmin)
router.get('/deleteChatByAdmin/:DeleteId',AuthVerification, ChatController.deleteChatByAdmin)


// Others routes
router.post('/createColor', AuthVerification, ColorController.createColor)



// export module
module.exports = router;