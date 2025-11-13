import { createSlice } from '@reduxjs/toolkit';

const initialState = { message: '' }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set(state, action) {
      return { message: action.payload }
    },
    clear() {
      return initialState
    }
  }
})

const { set, clear } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(set(message))

    setTimeout(
      () => dispatch(clear()),
      seconds * 1000
    )
  }
}

export default notificationSlice.reducer