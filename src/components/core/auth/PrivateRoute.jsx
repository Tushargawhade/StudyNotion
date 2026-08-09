import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (token !== null) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;
