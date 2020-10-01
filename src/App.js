import React, { Component } from "react";

import "./App.css";
 
const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
const sortOn = (arr, prop) => arr.sort (
      function (a, b) {
          if (a[prop] < b[prop]){
              return -1;
          } else if (a[prop] > b[prop]){
              return 1;
          } else {
              return 0;   
          }
      }
  );

class App extends Component {
  
  state = {
    stores: [],
    isLoading: true,
    finalRevenue: 0,
    input: "",
    filtered: []
  }

  componentDidMount() {
    Promise.all([
      fetch('http://localhost:3000/api/branch1.json'),
      fetch('http://localhost:3000/api/branch2.json'),
      fetch('http://localhost:3000/api/branch3.json')
    ]).then(responses =>  {
      
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then( data => {

      const branch1 = data[0].products;
      const branch2 = data[1].products;
      const branch3 = data[2].products;


      const all = [branch1, branch2, branch3];
      let unsorted = [];
      let finalProducts = [];

      for (let i = 0; all.length !== 0; i++) {
        let j = 0;
        while (j < all.length) {
            if (i >= all[j].length) {
                all.splice(j, 1);
            } else {
            
              unsorted.push({
                name: all[j][i].name,
                revenue: all[j][i].unitPrice * all[j][i].sold
              });
                j += 1;
            }
        }
    }

  sortOn(unsorted, "name");
  
  var holder = {};

   unsorted.forEach(function(d) {
     if (holder.hasOwnProperty(d.name)) {
       holder[d.name] = holder[d.name] + d.revenue;
       formatNumber(holder[d.name])
     } else {
       holder[d.name] = d.revenue;
     }
   });
   
   for (var prop in holder) {
     finalProducts.push({ name: prop, revenue: holder[prop] });
   }


    this.setState({ stores: finalProducts, isLoading: false});
    console.log('check state in api', this.state.isLoading);
    }).catch( error =>  {
      // if there's an error, log it

      console.log(error);
    });
}

getValueInput = evt => {

  const inputValue = evt.target.value;
  
  this.setState({ input: inputValue });
  this.filterNames(inputValue);
}

filterNames = inputValue => {
  
  let finalStore = this.state.stores;
  
  this.setState({
    filtered: finalStore.filter(item =>
      item.name.toLowerCase().includes(inputValue.toLowerCase()))
    });
}


displayTotalRev() {

  let finalStore = this.state.stores;
  let filteredStore = this.state.filtered;
  let sum;

  finalStore.reduce(function(prev, current) {
    sum = prev + +current.revenue;
   return sum
  }, 0);

   if( filteredStore.length === 0) {
    finalStore.reduce(function(prev, current) {
      sum = prev + +current.revenue;
     return sum
    }, 0);
   } else {
    filteredStore.reduce(function(prev, current) {
      sum = prev + +current.revenue;
     return sum
    }, 0);
   }

  return (
    <tr>
        <td>Total</td>
        <td>{formatNumber(sum)}</td>
    </tr>
 )
}

renderTableData() {
  
  let filteredStore = this.state.filtered;

  let finalStore = this.state.stores;
  
  if( filteredStore.length === 0) {
    return finalStore.map((store) => {
       
       return (
          <tr key={store.name}>
             <td>{store.name}</td>
             <td>{formatNumber(store.revenue)}</td>
          </tr>
       )
    })
  } else {
    return filteredStore.map((store) => {
     
       return (
          <tr key={store.name}>
             <td>{store.name}</td>
             <td>{formatNumber(store.revenue)}</td>
          </tr>
       )
    })
  }
} 

  render() {
   // const { isLoading } = this.state;
    console.log('check state in render', this.state.isLoading);
    // if (this.state.isLoading) {
  
    //    return <p>Loading...</p>;
    // } else {
    //   return <table></table>;
    // }
  
    return (
      <div className="product-list">
        <label>Search Products</label>
        <input type="text" onChange={ this.getValueInput }></input>
        <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {this.renderTableData()}
        </tbody>
        <tfoot>
          {this.displayTotalRev()}
        </tfoot>
      </table>
    </div>
    );
  }
}

export default App;
