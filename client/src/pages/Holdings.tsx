import ActualHoldings from "../components/holdings/ActualHoldings";
import AddTransaction from "../components/add-transaction/AddTransaction";
import { useEffect, useState, FC } from "react";
import { lsUserId } from "../utils/ls-userId";

import NeedToLogin from "./screens/NeedToLogin";

const Holdings: FC = () => {
  const [user, setUser] = useState(lsUserId());

  useEffect(() => {
    setUser(lsUserId());
  }, []);

  return (
    <>
      {user ? (
        <>
          <AddTransaction />
          <ActualHoldings />
        </>
      ) : (
        <NeedToLogin />
      )}
    </>
  );
};
export default Holdings;
