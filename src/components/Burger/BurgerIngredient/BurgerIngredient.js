import React, {Component} from 'react';
import classes from './BurgerIngredient.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class BurgerIngredient extends Component {
     render() {
        const StyledMeat = styled.div`
            width: 80%;
            height: ${this.props.meatCount * 8}%;
            background: linear-gradient(#7f3608, #702e05);
            margin: 2% auto;
            border-radius: 15px;
            &:hover {
                cursor: pointer;
            }
        `;
    
        let ingredient = null;
        switch (this.props.type) {
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
                ingredient = <StyledMeat onClick={this.props.clicked}></StyledMeat>
                break;
            case ('cheese'):
                ingredient = <div className={classes.Cheese} onClick={this.props.clicked}></div>
                break;
            case ('salad'):
                ingredient = <div className={classes.Salad} onClick={this.props.clicked}></div>
                break;
            case ('bacon'):
                ingredient = <div className={classes.Bacon} onClick={this.props.clicked}></div>
                break;
            case ('tomato'):
                ingredient = <div className={classes.Tomato} onClick={this.props.clicked}></div>
                break;
            case ('onion'):
                ingredient = <div className={classes.Onion} onClick={this.props.clicked}></div>
                break;
            default:
                ingredient = null;
        }
        return ingredient;
    }
};
// can be done also in functional component
BurgerIngredient.propTypes = {
    type: PropTypes.string
}

export default BurgerIngredient;