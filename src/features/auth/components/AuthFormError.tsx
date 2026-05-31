type AuthFormErrorProps = {
  id: string;
  message: string;
};

export default function AuthFormError({ id, message }: AuthFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className='text-sm font-medium text-app-danger'
      id={id}
      role='alert'
    >
      {message}
    </p>
  );
}
