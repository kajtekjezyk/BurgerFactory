import React from 'react'
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()});

describe('<NavigationItems />', () => {
    let wrapper = null;
    beforeEach(()=> {
        wrapper = shallow(<NavigationItems />);
    })
    it('should render two <NavigationItem /> elements if not authenticated user', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render three <NavigationItem /> elements if user is authenticated', () => {
        wrapper.setProps({isAuth: true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it('should contains <NavigationItem /> with link props set to logout if user is authenticated', () => {
        wrapper.setProps({isAuth: true});
        expect(wrapper.contains(<NavigationItem link="/logout" exact>Logout</NavigationItem>)).toEqual(true);
    });

    it('should contains <NavigationItem /> with link props set to auth if user is not authenticated', () => {
        expect(wrapper.contains(<NavigationItem link="/auth" exact>Authentication</NavigationItem>)).toEqual(true);
    });
})