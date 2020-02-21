import { Sound } from '@talkboy-9000/models'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type GetSoundsState = {
  sounds: Sound[]
}
export type FullState = {
  getSounds: GetSoundsState
}

export type RequestGetSoundsAction = Action<'REQUEST/getSounds'>
export type SuccessGetSoundsAction = Action<'SUCCESS/getSounds'> & {
  payload: Sound[]
}
export type FailGetSoundsAction = Action<'FAILED/getSounds'> & { err: Error }

export type RequestMakeSoundsAction = Action<'REQUEST/makeSounds'>
export type SuccessMakeSoundsAction = Action<'SUCCESS/makeSounds'>
export type FailMakeSoundsAction = Action<'FAILED/makeSounds'> & { err: Error }

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

export type MakeSound = (
  id: number
) => ThunkAction<
  void,
  FullState,
  undefined,
  RequestMakeSoundsAction | SuccessMakeSoundsAction | FailMakeSoundsAction
>
