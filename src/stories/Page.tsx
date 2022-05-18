import React from "react";

import "./page.css";

type User = {
  name: string;
};

export const Page: React.VFC = () => {
  const [user, setUser] = React.useState<User>();

  return <article></article>;
};
