import { FC, useMemo } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'default' | 'outlined' | 'rounded';

interface Props {
  text: string;
  variant?: ButtonVariant;
  onClick?: () => void;
}

const Button: FC<Props> = ({ text, variant = 'default', onClick }) => {
  const classToRender = useMemo(() => [styles.button, styles[variant]].join(' '), [variant]);

  return (
    <div className={classToRender} onClick={onClick}>
      <span>{text}</span>
    </div>
  );
};

export default Button;
