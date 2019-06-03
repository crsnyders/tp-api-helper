import { TargetProcess, Results, PostFile } from "../src/tp-api-helper"
import * as _ from "lodash"

let serviceToken = ""
let instanceUrl = "md5.tpondemand.com"

describe("Dummy test", () => {
  let t: TargetProcess

  beforeAll(() => {
    t = new TargetProcess(instanceUrl, "https", 1, { token: serviceToken })
  })

  it("Test get with skip, take, format, orderby and where", () => {
    t
      .get("Assignables")
      .exclude("Id")
      .include("Id", "Name", "EntityState", "EntityState[NextStates]")
      .skip(2)
      .take(5)
      .format("XML")
      .orderBy("Id")
      .where("Id gt 1")
      .execute()
      .then(result => {
        if (_.get(result, "Items")) {
          expect((result as Results).Items.length).toBeTruthy()
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  })
  it("Test get with take, orderbydesc, appen", () => {
    t
      .get("Assignables")
      .include("Id")
      .exclude("Id")
      .take(1)
      .orderByDesc("Name")
      .append("Tasks-Count")
      .execute()
      .then(result => {
        if (_.get(result, "Items")) {
          expect((result as Results).Items.length).toEqual(1)
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  })

  it("test post with include, exclude, format content_type, with body", () => {
    t
      .post("Assignables")
      .exclude("Id")
      .include("Id")
      .exclude("Id")
      .include("Id")
      .format("JSON")
      .content_type("JSON")
      .withBody("test")

    expect(t.options).toBeTruthy()
  })

  it("Upload a file to TP", () => {
    t.postFile().withFiles("./testfile.txt").withTicketID(49397)
    t
      .execute()
      .then(result => {
        console.log(result)
        expect(result).toBeTruthy()
      })
      .catch(err => {
        console.console(err)
      })
  })
})
