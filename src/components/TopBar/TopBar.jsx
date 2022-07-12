import './topbar.css';

export default function TopBar({ title }) {
  return (
    <div className='top-bar'>
      <h2 className='title'>{title}</h2>
      <div className='profile'>
        <img
          className='avatar-image'
          src={`${process.env.PUBLIC_URL}/images/profile-picture.jpg`}
          alt='user avatar'
        />
        <span className='avatar-name'>Michael Jackson</span>
        <img
          className='dashboard-profile-chevron'
          src='/icons/chevron-icon.svg'
          alt='chevron down'
        />
      </div>
    </div>
  );
}
