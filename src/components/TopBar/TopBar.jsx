import { useAPI } from '../../contexts/APIContext';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../Spinner/Spinner';
import './topbar.css';

export default function TopBar({ title }) {
  const { currentUser } = useAuth();
  console.log(currentUser);
  const { loading } = useAPI();
  return (
    <div className='top-bar'>
      <h2 className='title'>{title}</h2>
      <div className='profile'>
        <img
          className='avatar-image'
          src={
            currentUser.photoURL ||
            `${process.env.PUBLIC_URL}/images/profile-picture.png`
          }
          alt='user avatar'
        />
        <span className='avatar-name'>
          {!loading ? (
            currentUser.displayName
          ) : (
            <Spinner width='1em' height='1em' />
          )}
        </span>
        <svg className='topbar-profile-chevron'>
          <use href='/icons/chevron-icon.svg#Layer_1'></use>
        </svg>
      </div>
    </div>
  );
}
