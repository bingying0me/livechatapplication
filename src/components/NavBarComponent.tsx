import { Link, Outlet } from "react-router-dom";
import { signInWithGoogle, signOut } from "../utils/auth.utils";
import { useAuth } from "../context/AuthContext";

const NavBarComponent = () => {
  const { authUser, isLoggedIn, setAuthUser, setIsLoggedIn } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(setAuthUser, setIsLoggedIn);
  };

  const handleSignOut = () => {
    signOut(setAuthUser, setIsLoggedIn);
    window.location.reload(); // Reload the page
  };

  return (
    <>
      <div className="flex justify-between bg-gray-900 p-5 border-b-2 border-white text-white">
        <Link to="/">Rooms</Link>
        <div className="flex items-center">
          {isLoggedIn ? (
            <>
              <div className="mr-2">Welcome, {authUser?.displayName}</div>
              <div onClick={handleSignOut}>Sign Out</div>
            </>
          ) : (
            <div onClick={handleGoogleSignIn}>Sign In</div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavBarComponent;
