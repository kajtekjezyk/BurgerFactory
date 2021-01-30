import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const burger = (props) => {

    let transformedIngredientsCounter = props.burger.map((ingredient, index) => {
        return (
            <BurgerIngredient
                    clicked={()=>props.clicked(ingredient.ingType, ingredient.key)}
                    key={ingredient.ingType + index}
                    type={ingredient.ingType}
                    meatCount={ingredient.count}/>
        );
    });
               
    if (props.burger.length === 0) {
        transformedIngredientsCounter = <p>Please start Adding ingredients!</p>;
    }
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
            {transformedIngredientsCounter}
            <BurgerIngredient type='bread-bottom'/>

        </div>
    );
}

export default burger;





// let isMeatSet = false;
//     const meatCount = props.ingredientsCounter['meat'];
//     let transformedIngredientsCounter = Object.keys(props.ingredientsCounter)
//         .map(ingredient => {
//             return [...Array(props.ingredientsCounter[ingredient])].map((_, index) => {
//                 if (ingredient === 'meat')
//                 {   
//                     if (isMeatSet) {
//                         return null;
//                     }
//                     isMeatSet = true;   
//                 }
//                 return <BurgerIngredient
//                             clicked={()=>props.clicked(ingredient)}
//                             key={ingredient + index}
//                             type={ingredient}
//                             meatCount={meatCount} />
//             });
//         })
//         transformedIngredientsCounter = transformedIngredientsCounter.reduce((arr, el) => {  
//             return arr.concat(el);
//         }, []);
    
//     if (transformedIngredientsCounter.length === 0) {
//         transformedIngredientsCounter = <p>Please start Adding ingredients!</p>;
//     }