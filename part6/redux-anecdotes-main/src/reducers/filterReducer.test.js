import { describe, test, expect } from 'vitest'
import filterReducer from './filterReducer'
import deepFreeze from 'deep-freeze'

describe('filterReducer', () => {
  const initialState = ''

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = filterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('returns state matching the action payload on filter/set', () => {
    const state = initialState
    const action = {
      type: 'filter/set',
      payload: 'testing'
    }

    deepFreeze(state)
    const newState = filterReducer(state, action)
    expect(newState).toEqual(action.payload)
  })
})