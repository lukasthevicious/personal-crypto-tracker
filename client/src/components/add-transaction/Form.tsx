import React, { useState, useRef, useEffect, useContext, FC } from "react";
import FormInput from "./FormInput";
import { StyledForm } from "./styled";
import DashboardContext from "../../state/DashboardContext";
import FormContext from "../../state/FormContext";
import CryptoSelect from "./CryptoSelect";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
  addHolding,
  updateHolding,
  deleteHolding,
} from "../../state/actions/holdings";
import { addTransaction } from "../../state/actions/transactions";
import TransactionType from "./TransactionType";
import { lsUserId } from "../../utils/ls-userId";
import { RootState } from "../..";
import updateHoldingStatistics from "./updateHoldingStatistics";
import { HoldingItem } from "../../common/modelTypes";
import MyButton from "../layout/MyButton";

const Form: FC = () => {
  const userId = lsUserId();

  const initialState = {
    transactionType: "buy",
    userId,
    name: "",
    price: "",
    amount: "",
    date: "",
  };

  const [formData, setFormData] = useState(initialState);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [existingHolding, setExistingHolding] = useState<HoldingItem>();
  const [formIsValid, setFormIsValid] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const holdings = useAppSelector((state: RootState) => state.holdings);

  const { getDashboardData } = useContext(DashboardContext);
  const {
    selectedCrypto,
    transactionType,
    setSelectedCrypto,
    setFormShown,
    setTransactionType,
  } = useContext(FormContext);

  //Při prvním načtení stáhne dashboard data (přes context.getDashboardData) a nastaví userID do formData (zde se sledují údaje, které budou zadany do formu)
  useEffect(() => {
    getDashboardData();
    setFormData({ ...formData, userId });
  }, []);

  //Crypto name a Transaction type jdou přes context API, ukládám přes useEffect do formData objectu.
  useEffect(() => {
    setFormData({
      ...formData,
      name: selectedCrypto!,
      transactionType: transactionType!,
    });

    //Při změně Crypto name a Transaction type ukládám již držené krypto podle názvu do setExistingHolding, aby se pak zobrazilo v případě špatně zadaného množství - viz. DOM
    const existingItem = holdings.find(
      (holding: HoldingItem) => holding.name === selectedCrypto!
    );
    setExistingHolding(existingItem);
  }, [selectedCrypto, transactionType]);

  const selectedCryptoInput = (crypto: string): void => {
    setFormIsValid(true);
    setSelectedCrypto(crypto);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    //Když vyskočí hláška s invalid amount, po update inputů zmizí.
    if (!formIsValid) {
      setFormIsValid(true);
    }
    //Input name = initial state object properties
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    //Existing item - aby se pak níže poslal do update nebo delete.
    const existingItem = holdings.find(
      (holding: HoldingItem) => holding.name === formData.name
    );
    /*    const existingItem = existingHolding as HoldingItem; */

    //Validace, že nedavam transakci, kdy prodam vic nez aktualne drzim v Holdings - pak se prirazuje formIsValid state.
    if (
      (formData.transactionType === "sell" &&
        existingItem.amount >= parseInt(formData.amount)) ||
      formData.transactionType === "buy"
    ) {
      setFormIsValid(true);

      const adjustedFormItem = {
        ...formData,
        price: parseInt(formData.price),
        amount: parseInt(formData.amount),
      };

      //Clearing inputs
      if (formRef.current !== null) {
        formRef.current.reset();
      }

      setFormShown(false);

      //Pokud dané krypto už aktuálně držím, proženu transakci přes updateHoldingStatistics funkci, kde se vypočítá nový holding objects vč. průměrné nák. ceny. Ten se potom pošle do reduceru
      if (existingItem !== undefined) {
        const updatedHolding = updateHoldingStatistics(
          existingItem,
          adjustedFormItem
        );
        //Pokud amount updatovaného holdingu se nerovná 0, tak dispatchuju updateHolding. Pokud se rovná 0 tak dispatchuju deleteHolding a holding se smaže z dtbs.
        if (updatedHolding!.amount !== 0) {
          console.log(updatedHolding);
          dispatch(
            updateHolding(adjustedFormItem.name, updatedHolding as HoldingItem)
          );
        } else {
          dispatch(
            deleteHolding({ userId: formData.userId, itemName: formData.name })
          );
        }
      } else {
        dispatch(addHolding(adjustedFormItem));
      }
      dispatch(addTransaction(adjustedFormItem));
    }
    setFormIsValid(false);
  };

  const handleBuySellChange = (
    e: React.MouseEvent<HTMLElement>,
    newBuySell: "buy" | "sell"
  ): void => {
    //Pokud se klikne na již zakliknutou možnost, tak to nic nezmění.
    if (newBuySell !== null) setTransactionType(newBuySell);
  };

  return (
    <StyledForm onSubmit={onSubmitHandler} ref={formRef}>
      <div className="form">
        <div className="form-data-container">
          <TransactionType
            buySell={formData.transactionType}
            handleBuySellChange={handleBuySellChange}
          />
          <CryptoSelect selected={selectedCryptoInput} value={formData.name} />
          <FormInput
            input={{
              id: "Price per item",
              type: "number",
              min: 0.01,
              step: 0.01,
              onChange: handleChange,
            }}
            startAdornment="$"
            autoFocus
            name="price"
          />
          <FormInput
            input={{
              id: "Amount",
              type: "number",
              min: 0.00001,
              step: 0.00001,
              onChange: handleChange,
            }}
            name="amount"
          />
          <p className={formIsValid ? "hide" : "display"}>
            You can't sell more than you hold. Your acutal holding of{" "}
            {formData.name} is {existingHolding?.amount}.
          </p>
          <FormInput
            input={{
              id: "Date of transaction",
              type: "date",
              onChange: handleChange,
            }}
            name="date"
          />
          <div className="buttons-container">
            <MyButton
              type="submit"
              variant="contained"
              text="Add transaction"
              purple
            />
            <MyButton
              variant="contained"
              text="Back"
              onClick={() => setFormShown(false)}
              red
            />
          </div>
        </div>
      </div>
    </StyledForm>
  );
};
export default Form;
