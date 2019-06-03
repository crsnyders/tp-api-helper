import { TargetProcess, Results, PostFile } from "../src/tp-api-helper"
import * as _ from "lodash"
var settings = require("./settings.json")
let dir = process.cwd()

describe("Dummy test", () => {
  let t: TargetProcess

  beforeAll(() => {
    t = new TargetProcess(settings.instanceUrl, "https", 1, {
      token: settings.serviceToken
    })
  })

  it("Test get with skip, take, format, orderby and where", next => {
    t
      .get("Generals")
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
        console.log(result)
        next()
      })
      .catch(err => {
        console.log(JSON.stringify(err))
        next()
      })
  })

  it("Test get with take, orderbydesc, appen", next => {
    t
      .get("Generals")
      .include("Id")
      .exclude("Id")
      .take(1)
      .orderByDesc("Name")
      .append("Tasks-Count")
      .execute()
      .then(result => {
        if (_.get(result, "Items")) {
          expect((result as Results).Items.length).toEqual(1)
          next()
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err))
        next()
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

  it("Upload a file to TP", next => {
    t
      .postFile()
      .withFiles(dir + "/test/testfile.txt", dir + "/test/testfile2.txt")
      .withTicketID(49397)
      .execute()
      .then(result => {
        console.log("sucessfull upload", result)
        expect(result).toBeTruthy()
        next()
      })
      .catch(err => {
        console.error("failed to upload", err)
        next()
      })
  })
})
