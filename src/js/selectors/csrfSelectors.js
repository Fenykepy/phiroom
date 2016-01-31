import { createSelector } from 'reselect'


/*
 * input selectors
 */

export const csrfSelector = state => state.common.csrf

export const csrfTokenSelector = state => state.common.csrf.token
