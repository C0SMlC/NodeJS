/* eslint-disable */

// This is your test publishable API key.
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51NWy7TSIjZxF0ANoHSArHqORAZw5vPxm4TUVerlkriZhZ1rAcTMvy81r93FKjQmpBNHCOIwascNlACf9iHuSI3NQ00Cqe6emLR'
);

export const bookTour = async (tourId) => {
  try {
    // 1. get checkout from api
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // console.log(session);

    // 2. create checkout form and charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert(err, 'error');
  }
};
