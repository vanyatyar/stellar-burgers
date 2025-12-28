import React, { FC, RefObject, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { BurgerIngredientUI as BurgerIngredient } from '../burger-ingredient';
import { TIngredient, TTabMode } from '@utils-types';

interface BurgerIngredientsUIProps {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  titleSaucesRef: RefObject<HTMLHeadingElement>;
  bunsRef: (node?: Element | null) => void;
  mainsRef: (node?: Element | null) => void;
  saucesRef: (node?: Element | null) => void;
  onTabClick: (tab: string) => void;
}

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = ({
  currentTab,
  buns,
  mains,
  sauces,
  titleBunRef,
  titleMainRef,
  titleSaucesRef,
  bunsRef,
  mainsRef,
  saucesRef,
  onTabClick
}) => {
  const location = useLocation();
  const [ingredientCounts, setIngredientCounts] = useState<
    Record<string, number>
  >({});

  const getIngredientCount = (ingredientId: string): number =>
    ingredientCounts[ingredientId] || 0;

  const handleAddIngredient = (ingredientId: string) => {
    setIngredientCounts((prevCounts) => ({
      ...prevCounts,
      [ingredientId]: (prevCounts[ingredientId] || 0) + 1
    }));
  };

  return (
    <section className={styles.burger_components}>
      <div className={styles.tab}>
        <Tab value='bun' active={currentTab === 'bun'} onClick={onTabClick}>
          Булки
        </Tab>
        <Tab value='sauce' active={currentTab === 'sauce'} onClick={onTabClick}>
          Соусы
        </Tab>
        <Tab value='main' active={currentTab === 'main'} onClick={onTabClick}>
          Начинки
        </Tab>
      </div>
      <div className={styles.content}>
        <div className={styles.ingredients_section}>
          <h2
            className='text text_type_main-medium mt-10 mb-6'
            ref={titleBunRef}
          >
            Булки
          </h2>
          <ul className={styles.ingredients} ref={bunsRef}>
            {buns.map((item) => (
              <BurgerIngredient
                key={item._id}
                ingredient={item}
                count={getIngredientCount(item._id)}
                handleAdd={() => handleAddIngredient(item._id)}
                locationState={{ background: location }}
              />
            ))}
          </ul>

          <h2
            className='text text_type_main-medium mt-10 mb-6'
            ref={titleSaucesRef}
          >
            Соусы
          </h2>
          <ul className={styles.ingredients} ref={saucesRef}>
            {sauces.map((item) => (
              <BurgerIngredient
                key={item._id}
                ingredient={item}
                count={getIngredientCount(item._id)}
                handleAdd={() => handleAddIngredient(item._id)}
                locationState={{ background: location }}
              />
            ))}
          </ul>

          <h2
            className='text text_type_main-medium mt-10 mb-6'
            ref={titleMainRef}
          >
            Начинки
          </h2>
          <ul className={styles.ingredients} ref={mainsRef}>
            {mains.map((item) => (
              <BurgerIngredient
                key={item._id}
                ingredient={item}
                count={getIngredientCount(item._id)}
                handleAdd={() => handleAddIngredient(item._id)}
                locationState={{ background: location }}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
