const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/userModel');
const Tour = require('../models/tourModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const createPriceObject = async (tour) => {
  try {
    const price = await stripe.prices.create({
      unit_amount: tour.price * 100, // Stripe accepts the price in cents, so multiply by 100
      currency: 'usd', // Set the currency, change to your desired currency if needed
      product_data: {
        name: tour.name, // Set the product name to the tour name
        // other product data...
      },
    });

    return price.id; // Return the ID of the created Price object
  } catch (err) {
    console.error('Error creating Price object in Stripe:', err);
    throw err;
  }
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('No document found with that ID', 404));
  }

  // 2. create a checkout session

  const priceId = await createPriceObject(tour);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
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
  // next();
});
