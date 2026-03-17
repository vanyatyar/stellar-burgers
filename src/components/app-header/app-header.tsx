// src/components/app-header/app-header.tsx
import { FC } from 'react'; // Добавьте этот импорт
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';
import { AppHeaderUI } from '../../components/ui/app-header/app-header'; // Добавьте правильный путь

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
