import cn from 'classnames';

export const User = ({ user, activeUser, setActiveUser }) => {
  return (
    <a
      data-cy="FilterUser"
      href="#/"
      className={cn({ 'is-active': user.name === activeUser })}
      onClick={() => setActiveUser(user.name)}
    >
      {user.name}
    </a>
  );
};
