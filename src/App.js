import React, { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import { Routes, Route, Link, useLocation } from "react-router-dom";

import AuthService from "./services/auth.service";
import ProtectedRoute from "./common/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
// import Register from "./components/Register";
import Profile from "./components/Profile";
import CreateBlockchain from "./components/blockchains/create.component";
import EditBlockchain from "./components/blockchains/edit.component";
import BlockchainList from "./components/blockchains/list.component";
import CreateCalendar from "./components/calendar/create.component";
import EditCalendar from "./components/calendar/edit.component";
import CalendarList from "./components/calendar/list.component";
import CreateProject from "./components/projects/create.component";
import EditProject from "./components/projects/edit.component";
import ProjectList from "./components/projects/list.component";
import UsersList from "./components/users/list.component";
import CreateUser from "./components/users/create.component";
import EditUser from "./components/users/edit.component";
import PromoList from "./components/promos/list.component";

import EventBus from "./common/EventBus";

function App() {

  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log("user");
    console.log(user);

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  const location = useLocation();
  const curPathname = location.pathname;
  const ProtectedRoutes = [
    { 'path': '/users', 'element': <UsersList />, label: "Users" },
    { 'path': '/users/:add', 'element': <CreateUser /> },
    { 'path': '/users/:id', 'element': <EditUser /> },
    { 'path': '/blockchains', 'element': <BlockchainList />, label: "Blockchain items" },
    { 'path': '/blockchains/add', 'element': <CreateBlockchain /> },
    { 'path': '/blockchains/:id', 'element': <EditBlockchain /> },
    { 'path': '/calendars', 'element': <CalendarList />, label: "CNFT Calendars" },
    { 'path': '/calendar/add', 'element': <CreateCalendar /> },
    { 'path': '/calendar/:id', 'element': <EditCalendar /> },
    // { 'path': '/projects', 'element': <ProjectList />, label: "NFT Projects" },
    // { 'path': '/projects/add', 'element': <CreateProject /> },
    // { 'path': '/projects/:id', 'element': <EditProject /> },
    { 'path': '/promos', 'element': <PromoList />, label: "Promos" },
    { 'path': '/profile', 'element': <Profile />, label: "Profile" },
  ];

  return (
    <>
      <Navbar bg="dark">
        <Container>
          <Navbar.Brand>
            <Link to={"/"} className="nav-link text-white">
              Picassio CMS
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="navbar-nav me-auto">
              {currentUser && (
                <>
                  {currentUser.role !== undefined && ProtectedRoutes.map((route, index) => {
                    if ("label" in route) {
                      const path = route.path;
                      return <li key={index} className="nav-item">
                        <Link to={route.path}  className={`${curPathname == path ? "active " : ""} nav-link text-white`}>
                          {route.label}
                        </Link>
                      </li>
                    }
                  })}
                </>)
              }
            </div>
            <div className="d-flex">

              {currentUser ? (
                <>
                  <div className="nav-item">
                    <a href="/login" className="nav-link text-white" onClick={logOut}>
                      LogOut
                    </a>
                  </div>
                </>) : (
                <>
                  <div className="nav-item">
                    <Link to={"/login"} className="nav-link text-white">
                      Login
                    </Link>
                  </div>

                  {/* <div className="nav-item">
                    <Link to={"/register"} className="nav-link text-white">
                      Sign Up
                    </Link>
                  </div> */}
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login admin="0" />} />
          <Route exact path="/admin" element={<Login admin="1" />} />
          {/* <Route exact path="/register" element={<Register />} /> */}
          {ProtectedRoutes.map((route, index) => (
            <Route key={index} exact path={route.path} element={<ProtectedRoute />}>
              <Route exact path={route.path} element={route.element} />
            </Route>
          ))}
        </Routes>
      </Container>
    </>);
}

export default App;