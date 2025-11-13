import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import anecdoteReducer from './anecdoteReducer'

describe('anecdoteReducer', () => {
  const initialState = []

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = anecdoteReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('sets new state with action anecdote/set', () => {
    const state = [
      { content: 'old anecdote', votes: 2, id: 1 }
    ]

    const action = {
      type: 'anecdote/set',
      payload: [
        { content: 'new anecdote 1', votes: 0, id: 2 },
        { content: 'new anecdote 2', votes: 3, id: 3 }
      ]
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    expect(newState).toEqual(action.payload)
  })


  test('returns new state with action anecdote/create', () => {
    const state = initialState
    const action = {
      type: 'anecdote/create',
      payload: {
        content: 'this is a redux test',
        votes: 0,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })

  test('updates anecdote with action anecdote/update', () => {
    const state = [
      {
        content: 'this is a redux test',
        votes: 0,
        id: 1
      },
      {
        content: 'redux is awesome',
        votes: 0,
        id: 2
      },
    ]

    const action = {
      type: 'anecdote/update',
      payload: {
        content: 'this is a redux test',
        votes: 1,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    expect(newState).toHaveLength(state.length)
    expect(newState).toContainEqual({ ...state[1] })
    expect(newState).toContainEqual({
      ...state[0],
      votes: state[0].votes + 1
    })
  })
})