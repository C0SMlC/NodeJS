const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/userModel');
const Tour = require('../models/tourModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('No document found with that ID', 404));
  }

  // 2. create a checkout session

  const price = await stripe.prices.create({
    product: `${req.params.tourId}`,
    unit_amount: 2000,
    currency: 'usd',
  });

  console.log(price);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // name: `${tour.name} Tour`,
        // description: tour.summary,
        // images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        price: tour.price * 100,
        // currency: 'usd',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
  });
  // 3. create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
  next();
});
