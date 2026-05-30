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
      className='invalid'
      id={id}
      role='alert'
    >
      {message}
    </p>
  );
}
