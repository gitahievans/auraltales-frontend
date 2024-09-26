import {proxy} from 'valtio'

export const sideNavState = proxy ({
    open: false
})

export const userState = proxy ({
    isLoggedIn: false,
    user: null
})