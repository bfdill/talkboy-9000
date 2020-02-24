import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SoundComponent from './SoundComponent'
import { Sound } from '@talkboy-9000/models'

describe('SoundComponent', () => {
  const basename = 'basename'
  const id = 'id'

  let renderResult: undefined | ReturnType<typeof render> = undefined
  let makeSound: undefined | jest.Mock = undefined

  beforeEach(() => {
    const sound: Sound = {
      basename,
      id,
      filename: 'filename'
    }

    makeSound = jest.fn()

    renderResult = render(
      <SoundComponent sound={sound} makeSound={makeSound} />
    )
  })

  test('should display sound basename when rendered', () => {
    const button = renderResult.getByText(basename)

    expect(button).toBeInTheDocument()
  })

  test('should call makeSound when button clicked', () => {
    fireEvent.click(renderResult.getByText(basename))

    expect(makeSound).toHaveBeenCalledWith(id)
  })
})
