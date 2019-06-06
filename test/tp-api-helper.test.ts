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

  it("test post with include, exclude, format content_type, with body", (next) => {
    let postAction = t
      .post("Assignables")
      .exclude("Id")
      .include("Id")
      .exclude("Id")
      .include("Id")
      .format("JSON")
      .content_type("JSON")
      .withBody("test")

    expect(postAction.options).toBeTruthy()
    expect(postAction.options.url).toEqual(`https://${settings.instanceUrl}/api/v1/Assignables`)
    next()
  })

  it("Upload a file to TP", next => {
    var postFile = t
      .postFile()
      .withFiles(dir + "/test/testfile.txt", dir + "/test/testfile2.txt")
      .withTicketID(49397)

      expect(postFile.options.url).toEqual(`https://${settings.instanceUrl}/UploadFile.ashx`)
      expect(postFile.options.formData).toBeTruthy();
      expect(postFile.options.formData['generalId']).toEqual(49397);
      expect(postFile.options.formData['attachments'].length).toEqual(2);
      next()
  })
})
