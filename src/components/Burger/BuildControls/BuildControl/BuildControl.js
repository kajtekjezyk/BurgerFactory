import React, {useContext} from 'react';
import classes from './BuildControl.css';
import IngredientContext from '../../../../context/IngredientsContext'
import PropTypes from 'prop-types'

const buildControl = (props) => {

    const ingredientContext = useContext(IngredientContext);
    return (
        <div className={classes.BuildControl}>
            <div className={classes.Label}>{props.label}</div>
            <button
                className={classes.Less}
                disabled={props.shouldDisableLess}
                onClick={() => ingredientContext.rem(props.type)}>
                    -
                </button>
            <button
                className={classes.More}
                disabled={props.shouldDisableMore}
                onClick={() => ingredientContext.add(props.type)}>
                    +
                </button>
            <label className={classes.Counter}>{props.elCount}</label>
        </div>
    );
};

buildControl.propTypes = {
    label: PropTypes.string,
    shouldDisableLess: PropTypes.bool,
    shouldDisableMore: PropTypes.bool,
    rem: PropTypes.func,
    add: PropTypes.func
}

export default buildControl;
