import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../../services/slices/burgerConstructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(ingredient.uid || ingredient.id!));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(ingredient.uid || ingredient.id!));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.uid || ingredient.id!));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
