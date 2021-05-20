import React, { useEffect, useRef, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Foods {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

const Dashboard = () => {
  const [foods, setFoods] = useState<Foods[]>([])
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const isLoaded = useRef(true)
  useEffect(() => {
    if (isLoaded.current) {
      const loadFoods = async () => {
        const response = await api.get('/foods');
    
        setFoods(response.data);
        isLoaded.current = false;
      };
      loadFoods();
    }
  })

  const handleAddFood = async (food: Foods) => {
    try {
      const response = await api.post<Foods>('/foods', {
        ...food,
        available: true,
      });

      const newFood = response.data;

      setFoods((old) => [...old, newFood]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Foods) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen((old) => !old);
  }

  const toggleEditModal = () => {
    setEditModalOpen((old) => !old);
  }

  const handleEditFood = (food: Foods) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              available={food.available}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
