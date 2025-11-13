import { describe, test, expect } from 'vitest'
import notificationReducer from './notificationReducer'
import deepFreeze from 'deep-freeze'

describe('notificationReducer', () => {
  const initialState = { message: '' }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = notificationReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('returns state matching the action payload on notification/set', () => {
    const state = initialState
    const action = {
      type: 'notification/set',
      payload: 'testing'
    }

    deepFreeze(state)
    const newState = notificationReducer(state, action)
    expect(newState).toEqual({
      message: action.payload
    })
  })

  test('resets state notification/clear', () => {
    const state = {
      message: 'Test message'
    }
    const action = {
      type: 'notification/clear'
    }

    deepFreeze(state)
    const newState = notificationReducer(state, action)
    expect(newState).toEqual(initialState)
  })
})