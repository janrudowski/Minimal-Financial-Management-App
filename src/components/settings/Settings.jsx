import TopBar from '../TopBar/TopBar';
import './settings.css';

export default function Settings() {
  return (
    <div className='settings-container'>
      <TopBar title={'Settings'} />
      <div className='account-information-container'>
        <h3>Account Information</h3>
        <p>Update your account information</p>
        <div className='personal-information-container'>
          <h3>Personal Information</h3>
          <button className='edit-btn'>
            <img
              src={`${process.env.PUBLIC_URL}/icons/edit-icon.png`}
              alt='edit icon'
            />
            Edit
          </button>
        </div>
        <form>
          <div className='form-row'>
            <div className='input-container'>
              <label htmlFor='firstName'>First Name</label>
              <input type='text' name='firstName' id='firstName' />
            </div>
            <div className='input-container'>
              <label htmlFor='lastName'>Last Name</label>
              <input type='text' name='lastName' id='lastName' />
            </div>
          </div>
          <div className='form-row'>
            <div className='input-container'>
              <label htmlFor='birthday'>Date of Birth</label>
              <input type='date' name='birthday' id='birthday' />
            </div>
            <div className='input-container'>
              <label htmlFor='phone'>First Name</label>
              <input type='tel' name='phone' id='phone' />
            </div>
          </div>
          <div className='form-row'>
            <div className='inputEmail-container'>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' id='email' />
            </div>
          </div>
          <div className='form-row'>
            <div className='input-container'>
              <label htmlFor='password'>Password</label>
              <input type='password' name='password' id='password' />
            </div>
            <div className='input-container'>
              <label htmlFor='passwordConfirm'>Confirm Password</label>
              <input
                type='password'
                name='passwordConfirm'
                id='passwordConfirm'
              />
            </div>
          </div>
          <button className='update-btn'>Update</button>
        </form>
      </div>
    </div>
  );
}
