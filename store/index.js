export const state = () => ({
  cart: [],
  checkout: []
})
export const getters = {
  checkoutId: (state) => {
    return state.checkout && state.checkout.id ? state.checkout.id : null
  },
  checkoutWebUrl: (state) => {
    return state.checkout && state.checkout.webUrl ? state.checkout.webUrl : '#'
  },
  cartCount: (state) => {
    if (!state.cart.length) return 0
    return state.cart.reduce((ac, next) => ac + next.quantity, 0)
  },
  cartTotal: (state) => {
    if (!state.cart.length) return 0
    return state.cart.reduce((ac, next) => ac + next.quantity * next.price, 0)
  }
}
export const mutations = {
  updateCartUI: (state, payload) => {
    state.cartUIStatus = payload
  },
  clearCart: (state) => {
    state.cart = []
  },
  addToCart: (state, payload) => {
    const itemfound = state.cart.find((el) => el.id === payload.id)
    if (itemfound) {
      // Update shopify cart

      itemfound.quantity += payload.quantity
    } else {
      // Add new line item to shopify cart
      state.cart.push(payload)
    }
  },
  setCheckout: (state, payload) => {
    state.checkout = payload
  }
}
export const actions = {
  async addToCart({ getters, commit, state, dispatch }, payload) {
    try {
      let checkoutId = getters.checkoutId
      if (!checkoutId) {
        await dispatch('createCheckout')
      }
      checkoutId = getters.checkoutId
      const itemfound = await state.cart.find((el) => el.id === payload.id)
      // eslint-disable-next-line
      console.log('Checkout id is: ', checkoutId, itemfound)
      const lineItemsToAdd = [
        {
          variantId: payload.selectedVariant.id,
          quantity: payload.quantity
        }
      ]
      let latestCheckout = []
      if (!itemfound) {
        latestCheckout = await this.$shopify.checkout
          .addLineItems(checkoutId, lineItemsToAdd)
          .then((checkout) => {
            // Do something with the updated checkout
            return checkout
          })
      } else {
        const lineItemsToUpdate = [
          {
            variantId: payload.selectedVariant.id,
            quantity: payload.quantity
          }
        ]
        latestCheckout = await this.$shopify.checkout
          .updateLineItems(checkoutId, lineItemsToUpdate)
          .then((checkout) => {
            // Do something with the updated checkout
            return checkout
          })
      }
      // eslint-disable-next-line
      console.log('Checkout id is: ', latestCheckout)
      commit('addToCart', payload)
      commit('setCheckout', latestCheckout)
    } catch (errors) {
      // eslint-disable-next-line
      console.log('Checkout id is: Errors ', errors)
      return errors
    }
  },
  async createCheckout({ getters, commit }) {
    const checkout = await this.$shopify.checkout
      .create({})
      .then((checkout) => {
        return checkout
      })
    commit('setCheckout', checkout)
  }
}
