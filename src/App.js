import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import { Routes, Route, Link, useLocation } from "react-router-dom";

import AuthService from "./services/auth.service";
import ProtectedRoute from "./common/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ManageBlockchain from "./components/blockchains/manage.component";
import BlockchainList from "./components/blockchains/list.component";
import ManageAttribute from "./components/attribute/manage.component";
import AttributeList from "./components/attribute/list.component";
import ManageCalendar from "./components/calendar/manage.component";
import CalendarList from "./components/calendar/list.component";
import UsersList from "./components/users/list.component";
import ManageUser from "./components/users/manage.component";
import PromoList from "./components/promos/list.component";
import ManagePromo from "./components/promos/manage.component";
import ManageTexts from "./components/texts/manage.component";

import EventBus from "./common/EventBus";

function App() {

  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const user = AuthService.getCurrentUser();
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
    { 'path': '/users/add', 'element': <ManageUser isEdit={false} /> },
    { 'path': '/users/:id', 'element': <ManageUser isEdit={true} /> },
    { 'path': '/texts', 'element': <ManageTexts />, label: "Texts" },
    { 'path': '/blockchains', 'element': <BlockchainList />, label: "Blockchains" },
    { 'path': '/blockchains/add', 'element': <ManageBlockchain isEdit={false} /> },
    { 'path': '/blockchains/:id', 'element': <ManageBlockchain isEdit={true} /> },
    { 'path': '/attributes', 'element': <AttributeList />, label: "Attributes" },
    { 'path': '/attributes/add', 'element': <ManageAttribute isEdit={false} /> },
    { 'path': '/attributes/:id', 'element': <ManageAttribute isEdit={true} /> },
    { 'path': '/calendars', 'element': <CalendarList />, label: "CNFT Calendars" },
    { 'path': '/calendar/add', 'element': <ManageCalendar isEdit={false} /> },
    { 'path': '/calendar/:id', 'element': <ManageCalendar isEdit={true} /> },
    { 'path': '/promos', 'element': <PromoList />, label: "Promos" },
    { 'path': '/promos/:id', 'element': <ManagePromo/> },
    { 'path': '/profile', 'element': <Profile />, label: "Profile" },
  ];

  return (
    <>
      <Navbar collapseOnSelect bg="dark" expand="lg" variant="dark">
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
                  {ProtectedRoutes.map((route, index) => {
                    const path = route.path;
                    if (index === 0) {
                      if (typeof currentUser.role !== "undefined") {
                        return <li key={index} className="nav-item">
                          <Nav.Link to={route.path} as={Link} eventKey={index + 1} className={`${curPathname == path ? "active " : ""} nav-link text-white`}>
                            {route.label}
                          </Nav.Link>
                        </li>
                      }
                    }else{
                      if ("label" in route) {
                        return <li key={index} className="nav-item">
                          <Nav.Link to={route.path} as={Link} eventKey={index + 1} className={`${curPathname == path ? "active " : ""} nav-link text-white`}>
                            {route.label}
                          </Nav.Link>
                        </li>
                      }
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