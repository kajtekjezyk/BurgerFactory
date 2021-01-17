import React from 'react'
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import {BurgerBuilder} from "./BurgerBuilder";

configure({adapter: new Adapter()});

describe("<BurgerBuilder />", () => {
    let wrapper = null;
    beforeEach(() => {
        wrapper = shallow(<BurgerBuilder initBurger={() => {}}/>);
    });

    it("should render <BuildControls /> when receiving ingredients", () => {
        wrapper.setProps({
            ingredients: {
                salad:0
            }
        });
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    });
});