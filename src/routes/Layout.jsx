import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav className="home-link">
        <Link to="/" className="home-anchor">Home</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
