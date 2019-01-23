import "jest"
import React from "react"
import { shallow } from "enzyme";
import {Layout} from "../src/components/Layout"

describe("Layout", ()=>{
    it("Matches snapshot", ()=>{
        const l = shallow(<Layout />)
        expect(l).toMatchSnapshot();
    })
})