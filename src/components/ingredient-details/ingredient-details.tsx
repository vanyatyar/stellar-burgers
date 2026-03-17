import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { setIngredientDetails } from '../../services/slices/ingredientDetailsSlice';
import {
  selectIngredients,
  selectIngredientDetails
} from '../../services/selectors';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = useSelector(selectIngredientDetails);

  useEffect(() => {
    if (id && ingredients.length > 0) {
      const ingredient = ingredients.find((ing) => ing._id === id);
      if (ingredient) {
        dispatch(setIngredientDetails(ingredient));
      }
    }
  }, [id, ingredients, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div data-testid='ingredient-details'>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};

IngredientDetails.displayName = 'IngredientDetails';
