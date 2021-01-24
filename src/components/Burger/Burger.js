import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const burger = (props) => {
    let isMeatSet = false;
    const meatCount = props.ingredients['meat'];
    let transformedIngredients = Object.keys(props.ingredients)
        .map(ingredient => {
            return [...Array(props.ingredients[ingredient])].map((_, index) => {
                if (ingredient === 'meat')
                {   
                    if (isMeatSet) {
                        return null;
                    }
                    isMeatSet = true;   
                }
                return <BurgerIngredient
                            clicked={()=>props.clicked(ingredient)}
                            key={ingredient + index}
                            type={ingredient}
                            meatCount={meatCount} />
            });
        })
        transformedIngredients = transformedIngredients.reduce((arr, el) => {  
            return arr.concat(el);
        }, []);
    
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start Adding ingredients!</p>;
    }
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom'/>

        </div>
    );
}

export default burger;


// const ingredientsNum = transformedIngredients.reduce((elSum, elem) => {
//     return elSum += elem.length;
// },0);