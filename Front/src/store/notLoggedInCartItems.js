import { createAction, createReducer } from "@reduxjs/toolkit"

export const loadNotLoggedInCart = createAction("LOAD_NOT_LOGGED_IN_CART_ITEMS")
export const addToNotLoggedInCart = createAction("ADD_TO_NOT_LOGGED_IN_CART")
export const removeFromNotLoggedInCart = createAction(
  "REMOVE_FROM_NOT_LOGGED_IN_CART"
)
export const clearNotLoggedInCart = createAction("CLEAR_NOT_LOGGED_IN_CART")
export const changeQuantityInNotLoggedInCart = createAction(
  "CHANGE_QUANTITY_IN_NOT_LOGGED_IN_CART"
)

export const notLoggedInCartItemsReducer = createReducer([], {
  [loadNotLoggedInCart]: (state, action) => action.payload,
  [addToNotLoggedInCart]: (state, action) => {
    let filteredState = state.filter(
      (cartItem) => cartItem.productId !== action.payload.productId
    )
    return [...filteredState, action.payload]
  },
  [removeFromNotLoggedInCart]: (state, action) =>
    state.filter((cartItem) => cartItem.id !== action.payload.id),
  [clearNotLoggedInCart]: (state, action) => [],
  [changeQuantityInNotLoggedInCart]: (state, action) => {
    state.map((cartItem) => {
      if (cartItem.productId !== action.payload.productId) return cartItem
      else {
        cartItem.quantity = action.payload.quantity
        return cartItem
      }
    })
  },
})
