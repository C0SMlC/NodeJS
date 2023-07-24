import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (data, type) => {
  try {
    const url =
      type === 'passowrd'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('Data Updated Successfully!', 'success');
      location.reload(true);
    }
  } catch (error) {
    showAlert(error.response.data.message, 'error');
  }
};
