// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("EUR");
  const [currencyTo, setCurrencyTo] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);

  function handleEnterAmount(newAmount) {
    setAmount(newAmount);
  }

  function handleCurrencyChange(id, newCurrency) {
    if (id === "from") {
      setCurrencyFrom(newCurrency);
    } else {
      setCurrencyTo(newCurrency);
    }
  }

  return (
    <div>
      <InputForm
        amount={amount}
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
        onEnterAmount={handleEnterAmount}
        onCurrencyChange={handleCurrencyChange}
        isLoading={isLoading}
      />
      <Output
        amount={amount}
        from={currencyFrom}
        to={currencyTo}
        onLoading={setIsLoading}
      />
    </div>
  );
}

function InputForm({
  amount,
  currencyFrom,
  currencyTo,
  onEnterAmount,
  onCurrencyChange,
  isLoading,
}) {
  return (
    <>
      <EnterAmount
        amount={amount}
        onEnterAmount={onEnterAmount}
        isLoading={isLoading}
      />
      <SelectCurrency
        key="from"
        id="from"
        currency={currencyFrom}
        onCurrencyChange={onCurrencyChange}
        isLoading={isLoading}
      />
      <SelectCurrency
        key="to"
        id="to"
        currency={currencyTo}
        onCurrencyChange={onCurrencyChange}
        isLoading={isLoading}
      />
    </>
  );
}

function EnterAmount({ amount, onEnterAmount, isLoading }) {
  return (
    <input
      type="number"
      value={amount}
      onChange={(e) => onEnterAmount(Number(e.target.value))}
      disabled={isLoading}
    />
  );
}

function SelectCurrency({ id, currency, onCurrencyChange, isLoading }) {
  return (
    <select
      value={currency}
      onChange={(e) => onCurrencyChange(id, e.target.value)}
      disabled={isLoading}
    >
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}

function Output({ amount, from, to, onLoading }) {
  const [convertionRate, setConversionRate] = useState(amount);
  // const [isLoading, setIsLoading] = useState(false);

  // console.log(amount);

  useEffect(
    function () {
      const controller = new AbortController();

      async function convert() {
        try {
          if (!amount) return;

          onLoading(true);

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
            { signal: controller.signal }
          );

          const data = await res.json();

          // console.log(data);
          setConversionRate(data.rates[`${to}`]);
        } catch (error) {
          console.log(error.message);
        } finally {
          onLoading(false);
        }
      }

      if (from === to) {
        setConversionRate(amount);
        return;
      }

      convert();

      return function () {
        controller.abort();
      };
    },
    [amount, from, to, onLoading]
  );
  return <p>{amount && convertionRate.toString() + ` ${to}`}</p>;
}
