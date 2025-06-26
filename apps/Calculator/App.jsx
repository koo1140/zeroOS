import React, { useState } from 'react';
import './App.css';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (currentValue == null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prevValue, nextValue, op) => {
    switch (op) {
      case '+':
        return prevValue + nextValue;
      case '-':
        return prevValue - nextValue;
      case '*':
        return prevValue * nextValue;
      case '/':
        return prevValue / nextValue;
      default:
        return nextValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (currentValue != null && operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result); // Keep result for further operations
      setDisplay(String(result));
      setOperator(null); // Clear operator after equals
      setWaitingForOperand(true); // Ready for new input or operation
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="keypad">
        <button onClick={() => performOperation('/')}>÷</button>
        <button onClick={() => performOperation('*')}>×</button>
        <button onClick={() => performOperation('-')}>−</button>
        <button onClick={() => performOperation('+')}>+</button>

        <button onClick={() => inputDigit(7)}>7</button>
        <button onClick={() => inputDigit(8)}>8</button>
        <button onClick={() => inputDigit(9)}>9</button>
        <button onClick={handleEquals} className="equals">=</button>

        <button onClick={() => inputDigit(4)}>4</button>
        <button onClick={() => inputDigit(5)}>5</button>
        <button onClick={() => inputDigit(6)}>6</button>

        <button onClick={() => inputDigit(1)}>1</button>
        <button onClick={() => inputDigit(2)}>2</button>
        <button onClick={() => inputDigit(3)}>3</button>

        <button onClick={() => inputDigit(0)} className="zero">0</button>
        <button onClick={inputDecimal}>.</button>
        <button onClick={clearDisplay} className="clear">C</button>
      </div>
    </div>
  );
};

export default CalculatorApp;
