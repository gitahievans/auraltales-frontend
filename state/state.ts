import { Audiobook } from '@/types/types'
import {proxy} from 'valtio'

export const sideNavState = proxy ({
    open: false
})

export const userState = proxy ({
    isLoggedIn: false,
    user: null
})

export const fetchedAudiobooks = proxy ({
    audiobooks: [] as Audiobook[],
})
