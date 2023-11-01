import { add, sub } from "../utils"

describe('test all util functions', () => {
  test('correctly add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })

  test('correctly subtract two numbers', () => {
    expect(sub(2, 1)).toBe(1)
  })
})