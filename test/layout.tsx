import React from "react"
import { shallow } from "enzyme";
import {DesktopLayout} from "../src/components/Layout/DesktopLayout"

describe("Layout", ()=>{
    it("Matches snapshot", ()=>{
        const l = shallow(<DesktopLayout />)
        expect(l).toMatchSnapshot();
    })
})