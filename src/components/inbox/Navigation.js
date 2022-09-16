import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/lws-logo-dark.svg';
import { userLoggedOut } from '../../features/auth/authSlice';

export default function Navigation() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.clear();
  };
  const { user } = useSelector((state) => state.auth);
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <img className="h-10" src={logoImage} alt="Learn with Sumit" />
          </Link>

          <div className="flex">
            <p className="text-white">
              <span className="">{user.name}</span>
            </p>
            <p className="text-white mx-5 border px-5">
              <span className="cursor-pointer" onClick={logout}>
                Logout
              </span>
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
