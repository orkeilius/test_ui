import { useState } from 'react';
import './App.css';

function App() {
  const [currentVal, setCurrentVal] = useState('0');
  const [previousVal, setPreviousVal] = useState(null);
  const [operation, setOperation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // The backend URL is retrieved from Vite's injected environment variables.
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const clearAll = () => {
    setCurrentVal('0');
    setPreviousVal(null);
    setOperation(null);
    setErrorMsg('');
  };

  const clearCurrent = () => {
    setCurrentVal('0');
    setErrorMsg('');
  };

  const handleNumber = (number) => {
    if (currentVal === '0' || currentVal === 'Error') {
      setCurrentVal(number.toString());
    } else {
      setCurrentVal(currentVal + number.toString());
    }
  };

  const getOperationSymbol = (op) => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '';
    }
  };

  const handleOperator = (op) => {
    if (operation && previousVal && currentVal) {
      // Calculate chain
      calculateResult(op);
      return;
    }
    setOperation(op);
    setPreviousVal(currentVal);
    setCurrentVal('0');
  };

  const calculateResult = async (nextOp = null) => {
    if (!operation || !previousVal) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // Create request URL compatible with the requested structure (e.g. /calculate?operation=add&a=2&b=3)
      const url = new URL(`${backendUrl}/calculate`);
      url.searchParams.append('operation', operation);
      url.searchParams.append('a', previousVal);
      url.searchParams.append('b', currentVal);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Assume backend returns JSON like { "result": 5 } or string
      const data = await response.json();
      const result = data.result !== undefined ? data.result : data;

      setCurrentVal(String(result));
      setPreviousVal(nextOp ? String(result) : null);
      setOperation(nextOp);

    } catch (error) {
      console.error("Calculation Error:", error);
      setErrorMsg('Calculation failed. Is backend running?');
      setCurrentVal('Error');
      setPreviousVal(null);
      setOperation(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="calculator">
        <div className="screen">
          <div className="history">
            {previousVal} {operation ? getOperationSymbol(operation) : ''}
          </div>
          <div className="current">{loading ? '...' : currentVal}</div>
        </div>

        <div className="keypad">
          <button className="clear" onClick={clearAll}>AC</button>
          <button className="clear" style={{ gridColumn: 'span 1' }} onClick={clearCurrent}>C</button>
          <button className="operator" onClick={() => handleOperator('divide')}>÷</button>

          <button onClick={() => handleNumber(7)}>7</button>
          <button onClick={() => handleNumber(8)}>8</button>
          <button onClick={() => handleNumber(9)}>9</button>
          <button className="operator" onClick={() => handleOperator('multiply')}>×</button>

          <button onClick={() => handleNumber(4)}>4</button>
          <button onClick={() => handleNumber(5)}>5</button>
          <button onClick={() => handleNumber(6)}>6</button>
          <button className="operator" onClick={() => handleOperator('subtract')}>-</button>

          <button onClick={() => handleNumber(1)}>1</button>
          <button onClick={() => handleNumber(2)}>2</button>
          <button onClick={() => handleNumber(3)}>3</button>
          <button className="operator" onClick={() => handleOperator('add')}>+</button>

          <button onClick={() => handleNumber(0)}>0</button>
          <button onClick={() => handleNumber('.')}>.</button>
          <button className="equals" onClick={() => calculateResult(null)} style={{ gridColumn: 'span 2' }}>=</button>
        </div>
      </div>
      {errorMsg && <div className="error">{errorMsg}</div>}
    </div>
  );
}

export default App;
