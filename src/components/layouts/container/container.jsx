import clsx from 'clsx';

export const Container = ({ children, className }) => {
  return (
    <div className={clsx('container mx-auto px-4', className)}>{children}</div>
  );
};
