import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload
    }
  }
})

export const { set } = filterSlice.actions
export default filterSlice.reducer