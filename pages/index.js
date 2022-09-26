import React, { useMemo, useState } from "react";
import { UserContext } from "../components/userContext";
import { RenderTabs } from "../components/renderTabs";
import { NavBar } from "../components/navBar";

export default function Home() {

  const [tab, setTab] = useState('Home');

  return (
    <UserContext.Provider value = {{tab, setTab}}>
        <NavBar />
        <RenderTabs /> 
    </UserContext.Provider>
  );
}