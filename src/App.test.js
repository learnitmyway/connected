import { mount } from "@vue/test-utils";
import moment from "moment";

import App from "./App";
import getActions from "./actionsClient";

jest.mock("./actionsClient");
jest.mock("moment");

describe("App", () => {
  const data = [
    { type: "UNLOCK", time: 1558985077355, status: "PENDING" },
    { type: "LOCK", time: 1558985032079, status: "COMPLETE" },
    { type: "LOCK", time: 1558985004649, status: "FAILED" }
  ];

  beforeEach(() => {
    getActions.mockReturnValue(data);
    moment.mockReturnValue({ calendar: jest.fn() });
  });

  it("displays all rows", async () => {
    const wrapper = await mount(App);

    expect(wrapper.findAll("li").length).toBe(3);
  });

  describe("columns", async () => {
    let columns;
    let calendar;

    beforeEach(async () => {
      moment.mockReset();
      calendar = jest.fn();
      moment.mockReturnValue({ calendar });

      const wrapper = await mount(App);

      columns = wrapper.find("li").findAll(".column");
    });

    it("display type", async () => {
      expect(columns.at(0).text()).toBe("UNLOCK");
    });

    it("displays formatted date", async () => {
      expect(moment).toHaveBeenCalledWith(1558985077355);
      expect(calendar).toHaveBeenCalled();
    });

    it("display status", async () => {
      expect(columns.at(2).text()).toBe("PENDING");
    });
  });
});
