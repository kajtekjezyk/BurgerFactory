import React from 'react';
import classes from './BurgerIngredient.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledMeat = styled('div')`
    width: 80%;
    height: ${props => props.meatCount * 8}%;
    background: linear-gradient(#7f3608, #702e05);
    margin: 2% auto;
    border-radius: 15px;
    &:hover {
        cursor: pointer;
    }
`;

const burgerIngredient = props => {

    let ingredient = null;
    switch (props.type) {
        case ('bread-bottom'):
            ingredient = <div className={classes.BreadBottom}></div>;
            break;
        case ('bread-top'):
            ingredient = (
                <div className={classes.BreadTop}>
                    <div className={classes.Seeds1}></div>
                    <div className={classes.Seeds2}></div>
                </div>
            );
            break;
        case ('meat'):
            ingredient = <StyledMeat meatCount={props.meatCount} onClick={props.clicked}></StyledMeat>
            break;
        case ('cheese'):
            ingredient = <div className={classes.Cheese} onClick={props.clicked}></div>
            break;
        case ('salad'):
            ingredient = <div className={classes.Salad} onClick={props.clicked}></div>
            break;
        case ('bacon'):
            ingredient = <div className={classes.Bacon} onClick={props.clicked}></div>
            break;
        case ('tomato'):
            ingredient = <div className={classes.Tomato} onClick={props.clicked}></div>
            break;
        case ('onion'):
            ingredient = <div className={classes.Onion} onClick={props.clicked}></div>
            break;
        default:
            ingredient = null;
    }
    return ingredient;
};

burgerIngredient.propTypes = {
    type: PropTypes.string
}

export default burgerIngredient;