import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type FullState = {
  sounds: any
}

export type RequestGetSoundsAction = Action<'REQUEST/getSounds'>
export type SuccessGetSoundsAction = Action<'SUCCESS/getSounds'> & {
  payload: any
}
export type FailGetSoundsAction = Action<'FAILED/getSounds'> & { err: Error }
export type AnyAction =
  | RequestGetSoundsAction
  | SuccessGetSoundsAction
  | FailGetSoundsAction
export type GetSounds = () => ThunkAction<
  void,
  FullState,
  undefined,
  RequestGetSoundsAction | SuccessGetSoundsAction | FailGetSoundsAction
>
