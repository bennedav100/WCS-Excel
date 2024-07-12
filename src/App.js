// App.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import './App.css';
import SortingArrow from './SortingArrow';

function App() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // State to store the selected option (column name or "All")
  const [filterValue, setFilterValue] = useState(""); // State to store the filter value entered by the user
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // State to store sorting configuration

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  }

  const handleOptionSelect = (e) => {
    setSelectedOption(e.target.value); // Update selected option based on user input
    setFilterValue(""); // Clear filter value when option changes
  }

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value); // Update filter value based on user input
  }

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const filteredData = sortedData.filter((row) => {
    if (selectedOption === "All") {
      // Filter by any column if "All" is selected
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      // Filter by specific column
      return String(row[selectedOption]).toLowerCase().includes(filterValue.toLowerCase());
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>WCS Excel Viewer</h1>
      </header>

      <div className="container">
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
        />

        {/* Select dropdown to choose column or option */}
        {data.length > 0 && (
          <div className="options-container">
            <label className="option-label">Select A Column:</label>
            <select className="option-select" value={selectedOption} onChange={handleOptionSelect}>
              <option value="">-- Select --</option>
              <option value="All">All Columns</option>
              {Object.keys(data[0]).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>

            {/* Input box for filter value */}
            {selectedOption && (
              <div className="filter-container">
                <label>Enter a value to filter:</label>
                <input 
                  type="text" 
                  value={filterValue} 
                  onChange={handleFilterChange} 
                  placeholder="Enter value to filter..."
                />
              </div>
            )}
          </div>
        )}

        {/* Display filtered and sorted table */}
        {filteredData.length > 0 && (
          <div className="table-container">
            <h2>Filtered and Sorted Results</h2>
            <table className="table">
              <thead>
                <tr>
                  {selectedOption === "All" ? (
                    // Display all columns if "All" is selected
                    Object.keys(data[0]).map((key) => (
                      <th key={key} onClick={() => handleSort(key)}>
                        <div className="column-header">
                          <div>{key}</div>
                          <SortingArrow 
                            direction={sortConfig.key === key ? sortConfig.direction : 'ascending'}
                          />
                        </div>
                      </th>
                    ))
                  ) : (
                    // Display selected column header
                    <th onClick={() => handleSort(selectedOption)}>
                      <div className="column-header">
                        <div>{selectedOption}</div>
                        <SortingArrow 
                          direction={sortConfig.key === selectedOption ? sortConfig.direction : 'ascending'}
                        />
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    {selectedOption === "All" ? (
                      // Display all columns' values if "All" is selected
                      Object.keys(row).map((key) => (
                        <td key={key}>{row[key]}</td>
                      ))
                    ) : (
                      // Display selected column's value
                      <td>{row[selectedOption]}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional content */}
      <footer className="App-footer">
        <p>Powered by React and XLSX</p>
      </footer>
    </div>
  );
}

export default App;
