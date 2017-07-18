///<reference path="../node_modules/@types/jest/index.d.ts"/>
import { TargetProcess } from "../src/tp-api-helper"

/**
 * Dummy test
 */
describe("Dummy test", () => {
  let t: TargetProcess

  beforeAll(() => {
    t = new TargetProcess("md5.tpondemand.com", "https", 1)
  })
  it("works if true is truthy", () => {
    t
      .get("Assignables")
      .include("Id", "Name", "EntityState", "EntityState[NextStates]")
      .execute()
      .then(result => {
        expect(result.Items.length).toBeTruthy()
      })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  })
})
