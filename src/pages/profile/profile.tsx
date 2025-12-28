import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { selectUser } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { isLoading, error } = useSelector((state) => ({
    isLoading: state.user.isLoading,
    error: state.user.error
  }));

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== (user?.name || '')) updateData.name = formValue.name;
    if (formValue.email !== (user?.email || ''))
      updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    dispatch(updateUser(updateData));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error ?? undefined}
    />
  );
};
